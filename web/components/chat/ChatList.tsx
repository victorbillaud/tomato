import { cookies } from 'next/headers';
import { Text } from '../common/text';
import { createClient } from '@/utils/supabase/server';
import fakeData from './fakeData.json';
import Link from 'next/link';

export default async function ChatList() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO charger les conversations de l'utilisateur
  const conversations = fakeData.chats.filter(
    (chat) => chat.item_owner.id === user?.id
  );

  return (
    <div className='flex h-full w-2/5 flex-col divide-y-2 divide-gray-700 dark:divide-white'>
      <Text variant={'h2'} className='pb-6 pt-2'>
        Conversations
      </Text>
      {conversations.map((conversation) => (
        <Link
          href={/chat/ + conversation.id}
          key={conversation.id}
          className='p-2 hover:bg-gray-700/10 dark:hover:bg-white/20'
        >
          <Text variant={'h4'}>
            {conversation.participants[0].full_name +
              ' (' +
              conversation.participants[0].id +
              ')'}
          </Text>
          <Text key={conversation.id} variant={'body'}>
            {conversation.last_message.content}
          </Text>
        </Link>
      ))}
    </div>
  );
}
