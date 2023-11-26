import Chat from '@/components/chat/Chat';
import Input from '@/components/chat/Input';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { getConversationMessages } from '@utils/lib/messaging/services';

export default async function Index(props: {
  params: { conversation_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { messages, error } = await getConversationMessages(
    supabase,
    props.params.conversation_id
  );

  return (
    <div className='flex h-full w-2/3 flex-col justify-end space-y-2 '>
      <Chat messages={messages} currentUser={user} />
      <Input conversation_id={props.params.conversation_id} />
    </div>
  );
}
