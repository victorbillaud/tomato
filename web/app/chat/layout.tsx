import ChatList from '@/components/chat/ChatList';
import { ChatProvider } from '@/components/chat/ChatContext';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { listUserConversations } from '@utils/lib/messaging/services';
import { User } from '@supabase/supabase-js';
import { Text } from '@/components/common/text';
import { StyledLink } from '@/components/common/link';

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
    <ChatProvider>
      {conversations.length > 0 ? (
        <div className='flex h-[80vh] w-full overflow-hidden'>
          <ChatList conversations={conversations} currentUser={user as User} />
          {children}
        </div>
      ) : (
        <div className='my-10 flex w-full max-w-[700px] flex-col items-center justify-start gap-10 px-3 text-center'>
          <Text variant='h3'>You don&apos;t have any conversations yet</Text>
          <Text variant='body' className='mx-5'>
            Found a lost object? Scan its QR Code to start a chat with its owner
            ! Or, if you&apos;ve lost something, wait for someone to find it and
            contact you!
          </Text>
          <StyledLink
            variant='secondary'
            text='Return home'
            href='/'
          ></StyledLink>
        </div>
      )}
    </ChatProvider>
  );
}
