'use client';

import { IConversation, IMessage } from './types';
import fakeData from '@/components/chat/fakeData.json';
import Message from './Message';
import { User } from '@supabase/supabase-js';

type ChatProps = {
  conversation: IConversation | null;
  currentUser: User | null;
};

const Chat = ({ conversation, currentUser }: ChatProps) => {
  // TODO charger les messages de la conversation
  const messages: IMessage[] = fakeData.messages.filter(
    (message) => message.conversation_id === conversation?.id
  );

  return (
    <div className='h-full bg-slate-100 px-6 dark:bg-zinc-700 dark:text-white'>
      {conversation === null ? (
        <div>Select a conversation</div>
      ) : (
        <div className='flex flex-col overflow-y-scroll '>
          <span>
            Conversation : {conversation?.id} between{' '}
            {conversation?.item_owner.username} and{' '}
            {conversation?.participants[0].username}
          </span>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isSent={message.user_id === currentUser?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;
