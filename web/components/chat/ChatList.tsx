import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import {
  listUserConversations,
  TConversationWithLastMessage,
} from '@utils/lib/messaging/services';
import { getItem } from '@utils/lib/item/services';
import { getUserAvatarUrlById } from '@utils/lib/user/services';
import { ChatListProps } from './types';
import Link from 'next/link';
import Image from 'next/image';
import { Text } from '../common/text';
import { Icon } from '../common/icon';
import dateFormat from 'dateformat';

export default async function ChatList({
  selectedConversationId,
}: ChatListProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not found');
  }

  const { data: conversations, error: conversationsError } =
    await listUserConversations(supabase);

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

  // ! Pour l'instant on ne peut pas récupérer les infos de l'item lorsque l'on est finder
  async function getItemInfo(itemId: string) {
    const { data: item, error } = await getItem(supabase, itemId);
    if (error) {
      console.error(error);
      return null;
    }
    return item;
  }

  const displayLastMessageDate = (
    conversation: TConversationWithLastMessage
  ) => {
    const today = new Date();
    const lastMsgDate = new Date(
      conversation.last_message?.created_at as string
    );
    const timeDifference = today.getTime() - lastMsgDate.getTime();

    // Si le message a été envoyé aujourd'hui, afficher simplement l'heure
    if (today.getDate() === lastMsgDate.getDate()) {
      return dateFormat(conversation.last_message?.created_at, 'HH:MM');
    }
    // Si le message a été envoyé il y a moins de 7j, afficher le jour de la semaine et l'heure
    else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
      return dateFormat(conversation.last_message?.created_at, 'ddd HH:MM');
    }
    // Si il a été envoyé il y a moins de un an, afficher le jour et le mois
    else if (timeDifference < 365 * 24 * 60 * 60 * 1000) {
      return dateFormat(conversation.last_message?.created_at, 'd mmm');
    }
    // sinon afficher le jour, le mois et l'année
    else {
      return dateFormat(conversation.last_message?.created_at, 'd mmm yy');
    }
  };

  return (
    <div className='flex h-full w-full flex-col divide-y-[1px] divide-gray-700 dark:divide-white'>
      <Text variant={'h2'} className='pb-6 pt-2'>
        Conversations
      </Text>
      {conversations &&
        conversations.map(async (conversation) => {
          let isOwner = conversation.owner_id === user?.id;

          const { avatarUrl, error: avatarError } = await getUserAvatarUrlById(
            supabase,
            isOwner ? conversation.finder_id : conversation.owner_id
          );

          const itemInfo = await getItemInfo(conversation.item_id);

          const selectedStyle =
            selectedConversationId === conversation?.id
              ? ' bg-gray-700/10 dark:bg-white/20 '
              : '';

          return (
            <Link
              href={/chat/ + conversation.id}
              key={conversation.id}
              className={`${selectedStyle} flex items-center gap-2 p-2 hover:bg-gray-700/10 dark:hover:bg-white/20`}
            >
              <div className='flex-shrink-0'>
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
              </div>

              <div className='flex-grow truncate'>
                <Text variant={'h4'}>
                  {`${isOwner ? 'My ' : 'Found: '}${itemInfo?.name}`}
                </Text>
                <Text variant={'body'} className='truncate'>
                  {conversation.last_message?.sender_id === user?.id
                    ? 'You: '
                    : ''}
                  {conversation.last_message?.content}
                </Text>
              </div>

              <div className='flex-shrink-0'>
                <Text variant={'body'}>
                  {displayLastMessageDate(conversation)}
                </Text>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
