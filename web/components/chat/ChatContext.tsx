'use client';

import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { listUserConversations } from '@utils/lib/messaging/services';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DBMessage } from './types';

type ChatContextProps = {
  newMessages: Record<string, DBMessage[]>;
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

  useEffect(() => {
    async function fetchConversations() {
      // Console headers in the client

      const { data: conversationsFetched, error: conversationsError } =
        await listUserConversations(supabase);

      if (conversationsError) {
        throw new Error("Couldn't fetch conversations");
      }

      setConversationsIds(
        conversationsFetched.map((conversation) => conversation.id)
      );
    }

    fetchConversations();
  }, [supabase]);

  useEffect(() => {
    let messagesChannel: RealtimeChannel;

    if (!authToken) {
      return;
    }

    supabase.realtime.setAuth(
      authToken ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );

    messagesChannel = supabase
      .channel('messages')
      .on(
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
      )
      .subscribe();

    return () => {
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [conversationsIds, authToken]);

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
    <ChatContext.Provider value={{ newMessages }}>
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
