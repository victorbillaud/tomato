'use client';
import { ChatProps, DBMessage } from './types';
import Message from './Message';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const Chat = ({ conversationId, oldMessages, currentUser }: ChatProps) => {
  const supabase = createClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<DBMessage[]>(oldMessages || []);

  useEffect(() => {
    if (oldMessages) {
      setMessages(oldMessages);
    }
  }, [oldMessages]);

  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is sent
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // TODO: set this to a realtime subscription
  useEffect(() => {
    // Listen for new messages inserted in the database
    const changes = supabase
      .channel('conversation:' + conversationId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
          filter: 'conversation_id=eq.' + conversationId,
        },
        (payload: any) => {
          const newMessage = payload.new;
          // Check if the message is not already in the list to avoid duplicates
          if (!messages.find((msg) => msg.id === newMessage.id)) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();

    // Unsubscribe from the channel when the component unmounts
    return () => {
      changes.unsubscribe();
    };
  }, [conversationId, messages, supabase]);

  const renderMessages = () => {
    // Check if there are any messages
    if (!messages) {
      return (
        <div className='flex h-full w-full items-center justify-center'>
          Select a conversation
        </div>
      );
    } else if (messages.length === 0) {
      return (
        <div className='flex h-full w-full items-center justify-center'>
          No messages in this conversation.
        </div>
      );
    }

    // Sort the messages by date & time (oldest first)
    messages.sort((a, b) => {
      return a.created_at > b.created_at ? 1 : -1;
    });

    return (
      <>
        {messages.map((message, index) => {
          return (
            <Message
              key={message.id}
              message={message}
              prevMessage={index !== 0 ? messages[index - 1] : null}
              nextMessage={
                index !== messages.length ? messages[index + 1] : null
              }
              currentUser={currentUser}
            />
          );
        })}
      </>
    );
  };

  return (
    <div
      className='h-full w-full overflow-y-scroll rounded-md px-2 py-2 dark:text-white sm:px-6 '
      ref={scrollContainerRef}
    >
      <>{renderMessages()}</>
    </div>
  );
};

export default Chat;
