import Chat from '@/components/chat/Chat';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import fakeData from '@/components/chat/fakeData.json';
import Input from '@/components/chat/Input';

export default async function Index(props: {
  params: { conversation_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conversation = props.params.conversation_id
    ? fakeData.chats.find((chat) => chat.id === props.params.conversation_id)
    : null;

  return (
    <div className='flex h-full w-2/3 flex-col justify-end'>
      <Chat conversation={conversation} currentUser={user} />
      <Input conversation_id={props.params.conversation_id} />
    </div>
  );
}
