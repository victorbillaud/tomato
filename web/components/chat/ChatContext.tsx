'use client';

import { createClient } from '@/utils/supabase/client';
import { listUserConversations } from '@utils/lib/messaging/services';
import Cookies from 'js-cookie';
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

  const [newMessages, setNewMessages] = useState<Record<string, DBMessage[]>>(
    {}
  ); // conversationId: [message, message, ...]
  const [conversationsIds, setConversationsIds] = useState<string[]>([]);

  useEffect(() => {
    // fetch the conversations of the user to get the ids
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
  }, []);

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
    // Listen for new messages inserted in the database
    const existingCookie = Cookies.get('conversation_tokens');
    const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
    // supabase.realtime.setAuth(
    //   Object.values(conversationTokens)
    //     .map((token: any) => token.token)
    //     .join(',')
    // );

    console.log(supabase);

    const changes = supabase
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

          console.log('new message', newMessage);

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

    // Unsubscribe from the channel when the component unmounts
    return () => {
      supabase.removeChannel(changes);
    };
  }, [conversationsIds, newMessages]);

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
