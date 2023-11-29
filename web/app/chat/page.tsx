import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className='w-full sm:w-1/3'>
        <ChatList selectedConversationId={null} />
      </div>
      <div className='hidden h-full min-w-[66%] sm:flex'>
        <Chat messages={null} users={null} currentUser={user} />
      </div>
    </>
  );
}
