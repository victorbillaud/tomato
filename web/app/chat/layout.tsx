import { ChatProvider } from '@/components/chat/ChatContext';
import ChatList from '@/components/chat/ChatList';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
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
