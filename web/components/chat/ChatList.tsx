import { cookies } from 'next/headers';
import { Text } from '../common/text';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { listUserConversations } from '@utils/lib/messaging/services';
import { getItem } from '@utils/lib/item/services';

export default async function ChatList() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversations, error } = await listUserConversations(supabase);

  if (error) {
    console.error(error);
    return <div>Erreur de chargement des conversations</div>;
  }

  // sort conversations by last message date & time (newest first)
  conversations &&
    conversations.sort((a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return dateB.getTime() - dateA.getTime();
    });

  async function getItemInfo(itemId: string) {
    const { data: item, error } = await getItem(supabase, itemId);
    if (error) {
      console.error(error);
      return null;
    }
    return item;
  }

  return (
    <div className='flex h-full w-1/3 flex-col divide-y-2 divide-gray-700 dark:divide-white'>
      <Text variant={'h2'} className='pb-6 pt-2'>
        Conversations
      </Text>
      {conversations &&
        conversations.map(async (conversation) => {
          const itemInfo = await getItemInfo(conversation.item_id);

          return (
            <Link
              href={/chat/ + conversation.id}
              key={conversation.id}
              className='p-2 hover:bg-gray-700/10 dark:hover:bg-white/20'
            >
              <Text variant={'h4'}>
                {itemInfo?.name + ' (' + conversation.finder_id + ')'}
              </Text>
              <Text variant={'body'}>
                <Text variant={'body'} className='truncate'>
                  {conversation.last_message?.sender_id === user?.id
                    ? 'You: '
                    : ''}
                  {conversation.last_message?.content}
                </Text>
              </Text>
            </Link>
          );
        })}
    </div>
  );
}
