import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DBMessage } from './types';
import { createClient } from '@/utils/supabase/client';

type ChatContextProps = {
  newMessages: DBMessage[];
};

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const supabase = createClient();
  const [newMessages, setNewMessages] = useState<DBMessage[]>([]);

  useEffect(() => {
    // Listen for new messages inserted in the database
    const changes = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
        },
        (payload: any) => {
          const newMessage: DBMessage = payload.new;
          // Check if the message is not already in the list to avoid duplicates
          if (!newMessages.find((msg) => msg.id === newMessage.id)) {
            setNewMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();

    // Unsubscribe from the channel when the component unmounts
    return () => {
      changes.unsubscribe();
    };
  }, [supabase, newMessages]);

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
