'use client';
import { useEffect, useState } from 'react';
import { InputText } from '../common/input';
import { Icon } from '../common/icon';
import { InputChatProps } from './types';
import { createClient } from '@/utils/supabase/client';
import { insertMessage } from '@utils/lib/messaging/services';

const Input = ({ conversationId }: InputChatProps) => {
  const supabase = createClient();
  const [value, setValue] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setMessageContent(value);
  };

  useEffect(() => {
    async function sendMessage() {
      // Check that the message is not empty
      if (messageContent.trim().length === 0) {
        return;
      }

      // Insert the message in the database
      const { insertedMessage, error } = await insertMessage(supabase, {
        content: messageContent as string,
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

    sendMessage();
  }, [supabase, conversationId, messageContent]);

  return (
    <form onSubmit={handleSubmit} className='flex '>
      <InputText
        name='message'
        placeholder='Type a message'
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
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
