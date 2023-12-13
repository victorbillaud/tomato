'use client';
import { useState } from 'react';
import { InputText } from '../common/input';
import { Icon } from '../common/icon';
import { InputChatProps } from './types';
import { createClient } from '@/utils/supabase/client';
import { insertMessage } from '@utils/lib/messaging/services';

const Input = ({ conversationId }: InputChatProps) => {
  const supabase = createClient();
  const [value, setValue] = useState('');

  async function sendMessage(e: any) {
    e.preventDefault();

    // Check that the message is not empty
    if (value.trim().length === 0) {
      return;
    }

    // Insert the message in the database
    const { insertedMessage, error } = await insertMessage(supabase, {
      content: value as string,
      conversation_id: conversationId as string,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    if (!insertedMessage) {
      throw new Error('Message not inserted');
    }

    setValue('');
  }

  return (
    <form
      onSubmit={sendMessage}
      className='flex w-full rounded-full bg-white py-1 pl-6 pr-2 dark:bg-zinc-700'
    >
      <input
        name='message'
        placeholder='Type a message'
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className='w-full bg-transparent text-black focus:outline-none dark:text-white'
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

export default Input;
