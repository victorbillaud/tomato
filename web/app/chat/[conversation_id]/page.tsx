import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Chat from '@/components/chat/Chat';
import Input from '@/components/chat/Input';
import ChatHeader from '@/components/chat/ChatHeader';
import { ChatSkeleton, InputSkeleton } from '@/components/chat/Skeletons';
import { DBItem, DBMessage } from '@/components/chat/types';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import {
  getConversationMessages,
  getConversationWithItem,
} from '@utils/lib/messaging/services';

export default async function Index({
  params,
}: {
  params: { conversation_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const conversationId = params.conversation_id;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error('User not found');
  }

  const { messages, error: messageError } = await getConversationMessages(
    supabase,
    conversationId
  );
  // if can't get messages, redirect to conversations list
  if (messageError) {
    redirect('/chat');
  }

  const { item, error: itemError } = await getConversationWithItem(
    supabase,
    conversationId
  );
  if (itemError) {
    console.error(itemError);
    return null;
  }

  if (!user && !messages && !item) {
    return (
      <div className='flex h-full w-full flex-col justify-end overflow-hidden px-4 sm:w-2/3'>
        <ChatSkeleton />
        <InputSkeleton />
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col justify-start sm:w-2/3 sm:pl-2'>
      <ChatHeader currentUser={user as User} item={item as DBItem} />
      <div className='flex h-full flex-col justify-end gap-2 overflow-y-scroll px-3 sm:px-0'>
        <Chat
          conversationId={conversationId}
          oldMessages={messages as DBMessage[]}
          currentUser={user as User}
        />
        <Input conversationId={conversationId} />
      </div>
    </div>
  );
}
