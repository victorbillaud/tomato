'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Message from './Message';
import { ChatProps, DBMessage } from './types';
import { createClient } from '@/utils/supabase/client';

export default function Chat({
  conversationId,
  oldMessages,
  currentUser,
}: ChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<DBMessage[] | null>(
    oldMessages ?? null
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const memoMessages = useMemo(() => messages, [messages]);

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
          const newMessage: DBMessage = payload.new;
          // Check if the message is not already in the list to avoid duplicates
          if (!memoMessages?.find((msg) => msg.id === newMessage.id)) {
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newMessage,
            ]);
          }
        }
      )
      .subscribe();

    // Unsubscribe from the channel when the component unmounts
    return () => {
      changes.unsubscribe();
    };
  }, [conversationId, memoMessages, supabase]);

  // Check if there are any messages to display
  if (!memoMessages) {
    return (
      <div className='flex h-full w-full items-center justify-center dark:text-white'>
        Select a conversation
      </div>
    );
  } else if (memoMessages.length === 0) {
    return (
      <div className='flex h-full w-full items-center justify-center dark:text-white'>
        No messages in this conversation.
      </div>
    );
  }

  const renderMessages = () => {
    // Sort the messages by date & time (oldest first)
    memoMessages.sort((a, b) => {
      return a.created_at > b.created_at ? 1 : -1;
    });

    return (
      <>
        {memoMessages.map((message, index) => {
          return (
            <Message
              key={message.id}
              message={message}
              prevMessage={memoMessages[index - 1] ?? undefined}
              nextMessage={memoMessages[index + 1] ?? undefined}
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
}
