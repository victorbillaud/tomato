'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Message from './Message';
import { useChatContext } from './ChatContext';
import { ChatProps, DBMessage } from './types';

export default function Chat({
  conversationId,
  oldMessages,
  currentUser,
}: ChatProps) {
  const [messages, setMessages] = useState<DBMessage[] | null>(
    oldMessages ?? null
  );
  const { newMessages } = useChatContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const memoMessages = useMemo(() => messages, [messages]);

  function addMessages(messages: DBMessage[]) {
    // set messages with new messages but avoid duplicates
    setMessages((prevMessages) => [
      ...(prevMessages ?? []),
      ...messages.filter((msg) => !prevMessages?.find((m) => m.id === msg.id)),
    ]);
  }

  useEffect(() => {
    // initialize messages with old messages when fetched
    if (oldMessages) {
      addMessages(oldMessages);
    }
  }, [oldMessages]);

  useEffect(() => {
    // add new messages of this conversation only
    if (newMessages && conversationId) {
      addMessages(newMessages[conversationId] ?? []);
    }
  }, [newMessages, conversationId]);

  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is sent
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
