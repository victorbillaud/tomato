'use client';
import { User } from '@supabase/supabase-js';
import { TConversationWithLastMessage } from '@utils/lib/messaging/services';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import ChatCard from './ChatCard';
import { ChatListSkeleton } from './Skeletons';
import { ChatListProps } from './types';

export default function ChatList({
  conversations,
  currentUser,
}: ChatListProps) {
  const router = useRouter();
  const selectedConversationId = useParams().conversation_id as string;
  const [ownedConversations, setOwnedConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [foundConversations, setFoundConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  useLayoutEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, [setIsMobile]);

  useEffect(() => {
    setOwnedConversations(
      conversations.filter((conv) => conv.owner_id === currentUser?.id)
    );
    setFoundConversations(
      conversations.filter(
        (conv) => conv.finder_id === (currentUser?.id || null)
      )
    );
    setLoading(false);
  }, [conversations, currentUser]);

  // display the last conversation when loading chat page (if exist)
  if (
    !selectedConversationId &&
    conversations.length > 0 &&
    conversations[0].id &&
    !isMobile
  ) {
    router.push(`/chat/${conversations[0].id}`);
  }

  const renderConversations = (
    conversationsList: TConversationWithLastMessage[]
  ) => {
    return conversationsList.map((conversation) => {
      return (
        <ChatCard
          key={conversation.id}
          conversation={conversation}
          selectedConversationId={selectedConversationId}
          currentUser={currentUser as User}
          itemId={conversation.item_id}
        />
      );
    });
  };

  const mobileStyle = selectedConversationId ? ' hidden sm:flex ' : '';

  return (
    <div
      className={`${mobileStyle} flex w-full flex-1 flex-col gap-3 px-5 sm:w-1/3 sm:px-2`}
    >
      <div className='my-5 ml-3 flex justify-start'>
        <Text variant={'h2'}>Conversations</Text>
      </div>

      <div className='flex h-full w-full flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-200 bg-white py-4 dark:border-zinc-700 dark:bg-zinc-900'>
        {!conversations || loading ? (
          <ChatListSkeleton />
        ) : (
          <>
            {ownedConversations && ownedConversations.length > 0 && (
              <div className='flex flex-col gap-1'>
                <Text
                  variant={'subtitle'}
                  className='flex items-center gap-2 py-2 pl-3'
                >
                  <Icon name='user' size={20} />
                  My items
                </Text>
                {renderConversations(ownedConversations)}
              </div>
            )}
            {foundConversations && foundConversations.length > 0 && (
              <div className='flex flex-col gap-1'>
                <Text
                  variant={'subtitle'}
                  className='flex items-center gap-2 py-2 pl-3'
                >
                  <Icon name='qrcode' size={20} />
                  Items scanned
                </Text>
                {renderConversations(foundConversations)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
