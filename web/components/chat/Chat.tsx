'use client';
import { ChatProps, TMessage } from './types';
import Message from './Message';
import { useEffect, useRef } from 'react';
import { formatDate } from '@utils/lib/formatting/date';

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

    const renderedMessages: JSX.Element[] = [];
    let prevMessage: TMessage | null = null;
    let displayDate = true;

    for (const message of messages) {
      const isCurrentUser = message.sender_id === currentUser?.id;
      const isSameUser = message.sender_id === prevMessage?.sender_id;
      const user = users?.find((user) => user.id === message.sender_id);

      // Calculate time difference between current message and previous message
      if (prevMessage) {
        const currentDate = new Date(message.created_at);
        const prevDate = new Date(prevMessage.created_at);
        const timeDiff = currentDate.getTime() - prevDate.getTime();
        const diffHours = timeDiff / (1000 * 60);

        // Set 'displayDate' to true if it's greater than 1 hour
        if (diffHours > 60) {
          displayDate = true;
        }
      }

      renderedMessages.push(
        <>
          {displayDate ? (
            <div className='self-center text-sm'>
              {formatDate(message?.created_at)}
            </div>
          ) : null}
          <Message
            key={message?.id}
            message={message}
            user={user}
            isSent={isCurrentUser}
            firstMessage={!isSameUser}
          />
        </>
      );

      // Update state for the next iteration
      prevMessage = message;
      displayDate = false;
    }

    return <div className='flex w-full flex-col '>{renderedMessages}</div>;
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
