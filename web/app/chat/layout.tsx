import ChatList from '@/components/chat/ChatList';
import { ChatProvider } from '@/components/chat/ChatContext';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { listUserConversations } from '@utils/lib/messaging/services';
import { User } from '@supabase/supabase-js';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error('User not found');
  }

  const { data: conversations, error: conversationsError } =
    await listUserConversations(supabase);

  if (conversationsError) {
    throw new Error("Couldn't fetch conversations");
  }

  return (
    <div className='flex h-[80vh] w-full overflow-hidden'>
      <ChatProvider>
        <ChatList conversations={conversations} currentUser={user as User} />
        {children}
      </ChatProvider>
    </div>
  );
}
