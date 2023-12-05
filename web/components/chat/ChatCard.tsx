import { getUserDetails } from '@utils/lib/user/services';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import { ChatCardProps } from './types';
import { TConversationWithLastMessage } from '@utils/lib/messaging/services';
import dateFormat from 'dateformat';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Tag } from '../common/tag';

const displayLastMessageDate = (conversation: TConversationWithLastMessage) => {
  const today = new Date();
  const lastMsgDate = new Date(
    conversation.last_message?.created_at || conversation.created_at
  );
  const timeDifference = today.getTime() - lastMsgDate.getTime();

  // If the message was sent today, display only the time
  if (today.getDate() === lastMsgDate.getDate()) {
    return dateFormat(lastMsgDate, 'HH:MM');
  }
  // If the message was sent less than 7 days ago, display the day of the week and the time
  else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
    return dateFormat(lastMsgDate, 'ddd HH:MM');
  }
  // If it was sent less than a year ago, display the day and the month
  else if (timeDifference < 365 * 24 * 60 * 60 * 1000) {
    return dateFormat(lastMsgDate, 'd mmm');
  }
  // else display the day, the month and the year
  else {
    return dateFormat(lastMsgDate, 'd mmm yy');
  }
};

export default async function ChatCard({
  conversation,
  selectedConversationId,
  user,
  itemInfo,
}: ChatCardProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let isOwner = conversation.owner_id === user?.id;

  const { user: userDetails, error: avatarError } = await getUserDetails(
    supabase,
    isOwner ? conversation.finder_id : conversation.owner_id
  );

  const avatarUrl = userDetails?.avatar_url;

  const selectedStyle =
    selectedConversationId === conversation?.id
      ? ' bg-gray-700/10 dark:bg-white/20 '
      : '';

  // ! Same here, we can't get the item info when we are the finder
  const renderTag = () => {
    if (itemInfo) {
      if (itemInfo?.lost) {
        return <Tag text='lost' color='red' size='small' />;
      } else if (!itemInfo?.lost) {
        return <Tag text='found' color='green' size='small' />;
      }
    }
  };

  return (
    <Link
      href={/chat/ + conversation.id}
      key={conversation.id}
      className={`${selectedStyle} flex items-center gap-2 px-2 py-3 hover:bg-gray-700/10 dark:hover:bg-white/20`}
    >
      <div className='flex-shrink-0'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt='avatar'
            width={36}
            height={36}
            className='rounded-full border-[1px] border-gray-700 dark:border-white/20'
          />
        ) : (
          <Icon
            name='user-circle'
            size={40}
            stroke={1}
            color='dark:text-white text-black'
            className='border-[1px] border-gray-700 dark:border-white/20'
          />
        )}
      </div>

      <div className='flex-grow truncate'>
        <Text variant={'h4'} className='truncate'>
          {itemInfo?.name || 'unknown'}
        </Text>
        <Text variant={'body'} className='truncate'>
          {conversation.last_message?.sender_id === user?.id ? 'You: ' : ''}
          {conversation.last_message?.content || '(empty)'}
        </Text>
      </div>

      <div className='flex flex-shrink-0 flex-col items-end gap-1'>
        {renderTag()}
        <Text variant={'caption'}>{displayLastMessageDate(conversation)}</Text>
      </div>
    </Link>
  );
}
