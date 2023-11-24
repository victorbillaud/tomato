import { InputText } from '../common/input';
import { Icon } from '../common/icon';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

async function Input(props: { conversation_id: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sendMessage = async (formData: FormData) => {
    'use server';

    const value = formData.get('message') as string;

    const message = {
      id: '1', // generé par supabase
      conversation_id: conversation_id,
      content: value,
      created_at: new Date(),
      user_id: user?.id,
    };

    console.log(message);

    // TODO bon bah là faut ajouter le message à la conversation quoi
    return redirect('/chat/' + conversation_id);
  };

  return (
    <form action={sendMessage} className='flex '>
      <InputText name='message' placeholder='Type a message' />
      <div className='flex h-10 w-10 cursor-pointer items-center justify-center'>
        <button type='submit'>
          <Icon name={'send'} size={30} color={'text-primary-900'} fill />
        </button>
      </div>
    </form>
  );
}

export default Input;
