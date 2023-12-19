'use client';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Icon } from '../common/icon';
import { InputText } from '../common/input';
import { useChatContext } from './ChatContext';
import { InputChatProps } from './types';

const ChatInput = ({ conversationId }: InputChatProps) => {
  const supabase = createClient();
  const { insertMessage } = useChatContext();

  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);

  async function sendMessage(e: any) {
    e.preventDefault();

    // Check that the message is not empty
    if (value.trim().length === 0) {
      return;
    }

    // Insert the message in the database
    const insertedMessage = await insertMessage(value, conversationId);

    if (!insertedMessage) {
      throw new Error('Message not inserted');
    }

    setValue('');
  }

  return (
    <form
      onSubmit={sendMessage}
      className='flex w-full rounded-full border border-zinc-200 bg-white py-1 pl-6 pr-2 dark:border-zinc-600 dark:bg-zinc-800'
    >
      <input
        name='message'
        placeholder={focus ? '' : 'Type a message...'}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className='w-full bg-transparent text-black focus:outline-none dark:text-white'
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <div className='mx-2 flex h-10 w-10 cursor-pointer items-center justify-center'>
        <button type='submit'>
          <Icon
            name={'send'}
            size={33}
            color={'text-primary-900'}
            fill
            animateOnClick
          />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
