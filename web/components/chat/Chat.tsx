'use client';

import { ChatProps } from './types';
import Message from './Message';
import { Database } from '@utils/lib/supabase/supabase_types';

const Chat = ({ messages, currentUser }: ChatProps) => {
  const renderMessages = () => {
    // Check if there are any messages
    if (!messages) {
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
    let prevMessage: Database['public']['Tables']['message']['Row'] | null =
      null;
    let displayDate = true;

    for (const message of messages) {
      const isCurrentUser = message.sender_id === currentUser?.id;
      const isSameUser = message.sender_id === prevMessage?.sender_id;

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
              {message.created_at.toString()}
            </div>
          ) : null}
          <Message
            key={message.id}
            message={message}
            isSent={isCurrentUser}
            firstMessage={!isSameUser}
          />
        </>
      );

      // Update state for the next iteration
      prevMessage = message;
      displayDate = false;
    }

    return renderedMessages;
  };

  return (
    <div className='h-full bg-slate-100 px-6 dark:bg-zinc-700 dark:text-white'>
      <div className='flex h-full w-full flex-col overflow-y-scroll'>
        {renderMessages()}
      </div>
    </div>
  );
};

export default Chat;
