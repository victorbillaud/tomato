import Chat from '@/components/chat/Chat';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='flex h-full w-2/3'>
      <Chat messages={null} currentUser={user} />
    </div>
  );
}
