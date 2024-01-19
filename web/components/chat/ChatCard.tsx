'use client';
import { createClient } from '@/utils/supabase/client';
import { getItem } from '@utils/lib/item/services';
import { getPublicUserDetails } from '@utils/lib/user/services';
import dateFormat from 'dateformat';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '../common/icon';
import { Tag } from '../common/tag';
import { Text } from '../common/text';
import { useChatContext } from './ChatContext';
import { ChatCardSkeleton } from './Skeletons';
import { ChatCardProps, DBItem, DBMessage, DBProfile } from './types';

export default function ChatCard({
  conversation,
  selectedConversationId,
  currentUser,
  itemId,
}: ChatCardProps) {
  const supabase = createClient();
  const [lastMessage, setLastMessage] = useState<DBMessage | null>(
    (conversation?.last_message as DBMessage) || null
  );
  const { newMessages } = useChatContext();
  let isOwner = conversation.owner_id === currentUser?.id;
  const [userDetails, setUserDetails] = useState<DBProfile>();
  const [itemInfo, setItemInfo] = useState<DBItem>();
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingItem, setLoadingItem] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      const { user: userDetailsFetched, error: avatarError } =
        await getPublicUserDetails(
          supabase,
          isOwner ? conversation.finder_id : conversation.owner_id
        );

      setLoadingUser(false);

      if (avatarError) {
        console.error(avatarError);
        return null;
      }

      setUserDetails(userDetailsFetched as DBProfile);
    }

    // ! For now, the finder can't get the item info
    async function getItemInfo() {
      const { data: item, error: itemError } = await getItem(supabase, itemId);

      setLoadingItem(false);

      if (itemError) {
        console.error(itemError);
        return null;
      }

      setItemInfo(item as DBItem);
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
  }, [
    newMessages,
    conversation,
    selectedConversationId,
    lastMessage,
    currentUser,
  ]);

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
      ? ' bg-zinc-100 dark:bg-zinc-800/70'
      : '';

  // ! Same here, we can't get the item info when we are the finder
  const renderTag = () => {
    if (itemInfo && itemInfo.lost) {
      return <Tag text='lost' color='red' size='small' />;
    } else if (itemInfo && !itemInfo.lost) {
      return <Tag text='found' color='green' size='small' />;
    }
  };

  if (loadingUser || loadingItem) {
    return <ChatCardSkeleton />;
  }

  return (
    <Link
      href={/chat/ + conversation.id}
      key={conversation.id}
      className={`flex items-center gap-2 rounded-br-lg rounded-tr-lg px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 ${selectedStyle} `}
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
          {itemInfo?.name || 'Item found'}
        </Text>
        <div className='flex items-center'>
          <Text
            variant={'body'}
            className='truncate'
            color='text-black dark:text-stone-100'
          >
            {lastMessage?.sender_id === currentUser?.id ? 'You: ' : ''}
            {lastMessage?.content || 'No messages yet'}
          </Text>
        </div>
      </div>

      <div className='flex flex-shrink-0 flex-col items-end gap-1'>
        {renderTag()}
        <Text variant={'caption'} color='text-black/90 dark:text-stone-100/70'>
          {displayLastMessageDate()}
        </Text>
      </div>
    </Link>
  );
}
