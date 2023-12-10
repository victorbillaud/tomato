'use client';
import { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import { Tag } from '../common/tag';
import { ChatCardProps, DBMessage, DBProfile } from './types';
import { createClient } from '@/utils/supabase/client';
import { getItem } from '@utils/lib/item/services';
import { getUserDetails } from '@utils/lib/user/services';
import { useChatContext } from './ChatContext';

export default function ChatCard({
  conversation,
  selectedConversationId,
  user,
  itemId,
}: ChatCardProps) {
  const supabase = createClient();
  const [lastMessage, setLastMessage] = useState<DBMessage | null>(
    (conversation?.last_message as DBMessage) || null
  );
  const { newMessages } = useChatContext();
  let isOwner = conversation.owner_id === user?.id;
  const [userDetails, setUserDetails] = useState<DBProfile>();
  const [itemInfo, setItemInfo] = useState<any>();

  useEffect(() => {
    async function fetchUserDetails() {
      const { user: userDetailsFetched, error: avatarError } =
        await getUserDetails(
          supabase,
          isOwner ? conversation.finder_id : conversation.owner_id
        );

      if (avatarError) {
        console.error(avatarError);
        return null;
      }

      setUserDetails(userDetailsFetched as DBProfile);
    }

    // ! For now, the finder can't get the item info
    async function getItemInfo() {
      const { data: item, error: itemError } = await getItem(supabase, itemId);

      if (itemError) {
        console.error(itemError);
        return null;
      }

      setItemInfo(item);
    }

    fetchUserDetails();
    getItemInfo();
  }, [isOwner, conversation, supabase, itemId]);

  const avatarUrl = userDetails?.avatar_url;

  useEffect(() => {
    // get messages of this conversation only
    if (
      newMessages[conversation.id] &&
      newMessages[conversation.id].length > 0
    ) {
      // set last message with the most recent one
      setLastMessage(
        newMessages[conversation.id].reduce((prev, current) =>
          prev.created_at > current.created_at ? prev : current
        )
      );
    }
  }, [newMessages, conversation, selectedConversationId, lastMessage, user]);

  function displayLastMessageDate() {
    const today = new Date();
    const lastMsgDate = new Date(
      lastMessage?.created_at || conversation.created_at
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
  }

  const selectedStyle =
    selectedConversationId === conversation?.id
      ? ' bg-gray-700/10 dark:bg-white/20 '
      : '';

  // ! Same here, we can't get the item info when we are the finder
  const renderTag = () => {
    if (itemInfo && itemInfo.lost) {
      return <Tag text='lost' color='red' size='small' />;
    } else if (itemInfo && !itemInfo.lost) {
      return <Tag text='found' color='green' size='small' />;
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
          />
        )}
      </div>

      <div className='flex-grow truncate'>
        <Text variant={'h4'} className='truncate'>
          {itemInfo?.name || 'unknown'}
        </Text>
        <div className='flex items-center'>
          <Text variant={'body'} className='truncate'>
            {lastMessage?.sender_id === user?.id ? 'You: ' : ''}
            {lastMessage?.content || 'No messages yet'}
          </Text>
        </div>
      </div>

      <div className='flex flex-shrink-0 flex-col items-end gap-1'>
        {renderTag()}
        <Text variant={'caption'}>{displayLastMessageDate()}</Text>
      </div>
    </Link>
  );
}
