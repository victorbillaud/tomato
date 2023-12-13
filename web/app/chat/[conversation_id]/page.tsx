import { AnonBanner } from '@/components/chat/AnonBanner';
import Chat from '@/components/chat/Chat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { ChatSkeleton, InputSkeleton } from '@/components/chat/Skeletons';
import { DBItem, DBMessage } from '@/components/chat/types';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import {
  getConversationItem,
  getMessages,
} from '@utils/lib/messaging/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Conversation({
  params,
}: {
  params: { conversation_id: string };
}) {
  const cookieStore = cookies();
  const existingCookie = cookieStore.get('conversation_tokens')?.value;
  const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
  const specificToken: any = Object.values(conversationTokens).find(
    (token: any) => token.conversation_id === params.conversation_id
  );

  const supabase = createClient(cookieStore, {
    'conversation-tokens': Object.values(conversationTokens)
      .map((token: any) => token.token)
      .join(','),
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { messages, error: messageError } = await getMessages(supabase, [
    params.conversation_id,
  ]);

  if (messageError) {
    redirect('/chat');
  }

  const { item, error: itemError } = await getConversationItem(
    supabase,
    params.conversation_id
  );

  if (itemError) {
    console.error(itemError);
    return null;
  }

  if (!messages && !item) {
    return (
      <div className='flex h-full w-full flex-col justify-end overflow-hidden px-4 sm:w-2/3'>
        <ChatSkeleton />
        <InputSkeleton />
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col justify-start gap-1 sm:w-2/3 sm:pl-4'>
      {specificToken?.token && !user && <AnonBanner />}
      <ChatHeader currentUser={user as User} item={item as DBItem} />
      <div className='flex h-full flex-col justify-end gap-1 overflow-hidden px-3 sm:px-0'>
        <Chat
          conversationId={params.conversation_id}
          oldMessages={messages as DBMessage[]}
          currentUser={user as User}
        />
        <ChatInput conversationId={params.conversation_id} />
      </div>
    </div>
  );
}
