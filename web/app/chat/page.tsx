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
      <div className='w-full border-gray-700/10 dark:border-white/20 sm:w-1/3 sm:border-r-[1px]'>
        <ChatList selectedConversationId={null} />
      </div>
      <div className='hidden h-full w-full sm:flex sm:w-2/3'>
        <Chat conversationId={null} messages={null} currentUser={user} />
      </div>
    </>
  );
}
