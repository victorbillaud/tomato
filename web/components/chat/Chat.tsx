'use client';
import { ChatProps, TMessage } from './types';
import Message from './Message';
import { useEffect, useRef } from 'react';

// TODO: set this to a realtime
const Chat = ({ messages, users, currentUser }: ChatProps) => {
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
      className='h-full w-full overflow-y-scroll rounded-md bg-slate-100 px-6 py-2 dark:bg-zinc-700 dark:text-white'
      ref={scrollContainerRef}
    >
      <>{renderMessages()}</>
    </div>
  );
};

export default Chat;
