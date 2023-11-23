'use client';

import { IChatProps, IMessage } from './types';
import fakeData from '@/components/chat/fakeData.json';
import Message from './Message';

const Chat = ({ conversation, currentUser }: IChatProps) => {
  // TODO charger les messages de la conversation (en UseEffect ?)
  const messages: IMessage[] = fakeData.messages.filter(
    (message) => message.conversation_id === conversation?.id
  );

  const renderMessages = () => {
    // sort the messages by date & time (oldest first)
    messages.sort((a, b) => {
      return a.created_at > b.created_at ? 1 : -1;
    });

    // Check if there are any messages
    if (!messages.length) {
      return <div>No messages in this conversation.</div>;
    }

    const renderedMessages: JSX.Element[] = [];
    let prevMessage: IMessage | null = null;
    let displayDate = true;

    for (const message of messages) {
      const isCurrentUser = message.user_id === currentUser?.id;
      const isSameUser = message.user_id === prevMessage?.user_id;

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
      {conversation === null ? (
        <div>Select a conversation</div>
      ) : (
        <div className='flex flex-col overflow-y-scroll '>
          <span className='text-center'>
            debug : {conversation?.id} between{' '}
            {conversation?.item_owner.username} and{' '}
            {conversation?.participants[0].username}
          </span>
          {renderMessages()}
        </div>
      )}
    </div>
  );
};

export default Chat;
