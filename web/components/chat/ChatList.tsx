import { cookies } from 'next/headers';
import { Text } from '../common/text';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { listUserConversations } from '@utils/lib/messaging/services';
import { getItem } from '@utils/lib/item/services';
import { getUserAvatarUrlById } from '@utils/lib/user/services';
import Image from 'next/image';
import { Icon } from '../common/icon';

export default async function ChatList() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { data: conversations, error: conversationsError } =
    await listUserConversations(supabase);

  if (error || !user) {
    throw new Error('User not found');
  }

  if (conversationsError) {
    console.error(conversationsError);
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
    <div className='flex h-full w-full flex-col divide-y-[1px] divide-gray-700 dark:divide-white'>
      <Text variant={'h2'} className='pb-6 pt-2'>
        Conversations
      </Text>
      {conversations &&
        conversations.map(async (conversation) => {
          const { avatarUrl, error: avatarError } = await getUserAvatarUrlById(
            supabase,
            conversation.finder_id
          );

          const itemInfo = await getItemInfo(conversation.item_id);

          return (
            <Link
              href={/chat/ + conversation.id}
              key={conversation.id}
              className='flex items-center space-x-2 p-2 hover:bg-gray-700/10 dark:hover:bg-white/20'
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt='avatar'
                  width={40}
                  height={40}
                  className=' rounded-full'
                />
              ) : (
                <Icon
                  name='user-circle'
                  size={44}
                  stroke={1}
                  color='dark:text-white text-black'
                />
              )}

              <div>
                <Text variant={'h4'}>{itemInfo?.name}</Text>
                <Text variant={'body'}>
                  <Text variant={'body'} className='truncate'>
                    {conversation.last_message?.sender_id === user?.id
                      ? 'You: '
                      : ''}
                    {conversation.last_message?.content}
                  </Text>
                </Text>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
