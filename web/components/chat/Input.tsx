import { InputText } from '../common/input';
import { Icon } from '../common/icon';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { insertMessage } from '@utils/lib/messaging/services';
import { revalidatePath } from 'next/cache';

const sendMessage = async (formData: FormData) => {
  'use server';
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const value = formData.get('message') as string;
  const conversation_id = formData.get('conversation_id') as string;

  // Check that the message is not empty
  if (value.trim().length === 0) {
    return;
  }

  const { insertedMessage, error } = await insertMessage(supabase, {
    content: value as string,
    conversation_id: conversation_id as string,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  if (!insertedMessage) {
    throw new Error('Message not inserted');
  }

  revalidatePath('/chat/' + conversation_id);
};

async function Input(props: { conversation_id: string }) {
  return (
    <form action={sendMessage} className='flex '>
      <InputText name='message' placeholder='Type a message' />
      <input name='conversation_id' value={props.conversation_id} hidden />
      <div className='flex h-10 w-10 cursor-pointer items-center justify-center'>
        <button type='submit'>
          <Icon name={'send'} size={30} color={'text-primary-900'} fill />
        </button>
      </div>
    </form>
  );
}

export default Input;
