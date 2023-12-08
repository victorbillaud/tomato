import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

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
    'conversation-token': specificToken?.token,
  });

  const { data, error } = await supabase
    .from('conversation')
    .select('*')
    .eq('id', params.conversation_id)
    .single();

  return (
    <Text variant='h4' className='text-center opacity-90'>
      How it seems you found an item... {params.conversation_id}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Text>
  );
}
