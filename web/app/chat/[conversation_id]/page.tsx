import Chat from '@/components/chat/Chat';
import Input from '@/components/chat/Input';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import {
  getConversationMessages,
  getConversationUsers,
} from '@utils/lib/messaging/services';
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

  // if can't get messages, redirect to chat page
  if (messageError) {
    redirect('/chat');
  }

  const { users, error: usersError } = await getConversationUsers(
    supabase,
    props.params.conversation_id
  );

  return (
    <>
      <div className='hidden w-full sm:block sm:w-1/3'>
        <ChatList selectedConversationId={props.params.conversation_id} />
      </div>
      <div className='flex h-full min-w-[66%] flex-col justify-end gap-2 '>
        <MobileHeader />
        <Chat messages={messages} users={users} currentUser={user} />
        <Input conversation_id={props.params.conversation_id} />
      </div>
    </>
  );
}
