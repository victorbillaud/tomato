import { ChatProvider } from '@/components/chat/ChatContext';
import ChatList from '@/components/chat/ChatList';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { listUserConversations } from '@utils/lib/messaging/services';
import { cookies } from 'next/headers';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const existingCookie = cookieStore.get('conversation_tokens')?.value;
  const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
  const supabase = createClient(cookieStore, {
    'conversation-tokens': Object.values(conversationTokens)
      .map((token: any) => token.token)
      .join(','),
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
