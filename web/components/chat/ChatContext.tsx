'use client';

import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  getMessages,
  insertMessage as insertMessageService,
  listUserConversations,
} from '@utils/lib/messaging/services';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DBMessage } from './types';

type ChatContextProps = {
  newMessages: Record<string, DBMessage[]>;
  insertMessage: (
    content: string,
    conversationId: string
  ) => Promise<DBMessage>;
};

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const supabase = createClient();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [newMessages, setNewMessages] = useState<Record<string, DBMessage[]>>(
    {}
  );
  const [conversationsIds, setConversationsIds] = useState<string[]>([]);

  const insertMessage = useCallback(
    async (content: string, conversationId: string) => {
      const { insertedMessage, error } = await insertMessageService(supabase, {
        content: content,
        conversation_id: conversationId as string,
      });

      if (error) {
        console.error(error);
        throw error;
      }

      if (!insertedMessage) {
        throw new Error('Message not inserted');
      }

      setNewMessages((prevMessages) => ({
        ...prevMessages,
        [conversationId]: [
          ...(prevMessages?.[conversationId] || []),
          insertedMessage,
        ],
      }));
      return insertedMessage;
    },
    [supabase]
  );

  useEffect(() => {
    // initialize newMessages with the conversations ids and an empty array
    if (conversationsIds.length > 0) {
      setNewMessages(
        conversationsIds.reduce((acc, id) => {
          return {
            ...acc,
            [id]: [],
          };
        }, {})
      );
    }
  }, [conversationsIds]);

  const fetchConversations = useCallback(async () => {
    const { data: conversationsFetched, error: conversationsError } =
      await listUserConversations(supabase);

    if (conversationsError) {
      throw new Error("Couldn't fetch conversations");
    }

    setConversationsIds(
      conversationsFetched.map((conversation) => conversation.id)
    );
  }, [supabase]);

  const fetchMessages = useCallback(async () => {
    let currentDateTime = new Date();
    currentDateTime.setSeconds(currentDateTime.getSeconds() - 5);
    const { messages, error: messagesError } = await getMessages(
      supabase,
      conversationsIds,
      currentDateTime.toISOString()
    );

    if (messagesError) {
      throw new Error("Couldn't fetch new messages");
    }

    messages &&
      messages.forEach((message) => {
        setNewMessages((prevMessages) => ({
          ...prevMessages,
          [message.conversation_id]: [
            ...(prevMessages?.[message.conversation_id] || []),
            message,
          ],
        }));
      });
  }, [conversationsIds, supabase]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    let messagesChannel: RealtimeChannel = supabase.channel(`messages`, {
      config: {
        broadcast: { self: true },
      },
    });

    if (!authToken) {
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    } else {
      supabase.realtime.setAuth(
        authToken ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      );

      messagesChannel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
          filter: `conversation_id=in.(${conversationsIds.join(',')})`,
        },
        (payload: any) => {
          const newMessage: DBMessage = payload.new;
          const messageConvId = newMessage.conversation_id;

          // Check if the message belongs to one of the conversations of the user
          if (messageConvId && conversationsIds.includes(messageConvId)) {
            // Check if the message is not already in the list to avoid duplicates
            if (
              !newMessages?.[messageConvId]?.find(
                (msg: DBMessage) => msg.id === newMessage.id
              )
            ) {
              setNewMessages((prevMessages) => ({
                ...prevMessages,
                [messageConvId]: [
                  ...(prevMessages?.[messageConvId] || []),
                  newMessage,
                ],
              }));
            }
          }
        }
      );
    }

    messagesChannel.subscribe();

    return () => {
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [conversationsIds, authToken, supabase, fetchMessages, newMessages]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data) {
        console.error('Error fetching user:', error);
      } else {
        setAuthToken(data.session?.access_token || null);
      }
    };

    fetchSession();
  }, [supabase]);

  return (
    <ChatContext.Provider value={{ newMessages, insertMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('ChatContext not found');
  }
  return context;
};
