import Chat from '@/components/chat/Chat';
import fakeData from '@/components/chat/fakeData.json';
import Input from '@/components/chat/Input';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Conversation({
  params: { conversation_id },
}: {
  params: { conversation_id: string[] };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conversation = conversation_id
    ? fakeData.chats.find((chat) => chat.id === conversation_id[0])
    : null;

  return (
    <>
      {!conversation ? (
        <Chat conversation={null} currentUser={user} />
      ) : (
        <Chat conversation={conversation} currentUser={user} />
      )}
      <Input />
    </>
  );
}
