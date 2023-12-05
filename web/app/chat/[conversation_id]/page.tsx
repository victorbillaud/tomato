import Chat from '@/components/chat/Chat';
import Input from '@/components/chat/Input';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { getConversationMessages } from '@utils/lib/messaging/services';
import { redirect } from 'next/navigation';
import ChatList from '@/components/chat/ChatList';
import MobileHeader from '@/components/chat/MobileHeader';

export default async function Index(props: {
  params: { conversation_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { messages, error: messageError } = await getConversationMessages(
    supabase,
    props.params.conversation_id
  );

  // if can't get messages, redirect to conversations list
  if (messageError) {
    redirect('/chat');
  }

  return (
    <>
      <div className='hidden w-full border-gray-700/10 dark:border-white/20 sm:block sm:w-1/3 sm:border-r-[1px]'>
        <ChatList selectedConversationId={props.params.conversation_id} />
      </div>
      <div className='flex h-full w-full flex-col justify-end gap-2 sm:w-2/3 sm:pl-2'>
        <MobileHeader />
        <Chat
          conversationId={props.params.conversation_id}
          oldMessages={messages ?? undefined}
          currentUser={user ?? undefined}
        />
        <Input conversation_id={props.params.conversation_id} />
      </div>
    </>
  );
}
