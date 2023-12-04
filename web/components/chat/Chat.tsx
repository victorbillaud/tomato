'use client';
import { ChatProps } from './types';
import Message from './Message';
import { useEffect, useRef } from 'react';

const Chat = ({ conversationId, messages, currentUser }: ChatProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is sent
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

    // sort the messages by date & time (oldest first)
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
