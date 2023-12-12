'use client';
import { User } from '@supabase/supabase-js';
import { TConversationWithLastMessage } from '@utils/lib/messaging/services';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Text } from '../common/text';
import ChatCard from './ChatCard';
import { ChatListSkeleton } from './Skeletons';
import { ChatListProps } from './types';

export default function ChatList({
  conversations,
  currentUser,
}: ChatListProps) {
  const selectedConversationId = useParams().conversation_id as string;
  const [ownedConversations, setOwnedConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [foundConversations, setFoundConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setOwnedConversations(
      conversations.filter((conv) => conv.owner_id === currentUser?.id)
    );
    setFoundConversations(
      conversations.filter((conv) => conv.finder_id === (currentUser?.id || null))
    );
    setLoading(false);
  }, [conversations, currentUser]);

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

  const mobileStyle = selectedConversationId ? ' hidden sm:block ' : '';

  return (
    <div
      className={`flex h-full w-full flex-col border-gray-700/10 px-3 dark:border-white/20 sm:w-1/3 sm:border-r-[1px] sm:px-0 ${mobileStyle}`}
    >
      <Text variant={'h2'} className='p-2'>
        Conversations
      </Text>

      {!conversations || loading ? (
        <ChatListSkeleton />
      ) : (
        <>
          {ownedConversations && ownedConversations.length > 0 && (
            <>
              <Text
                variant={'h4'}
                className='border-b-[1px] border-gray-700/10 px-2 pb-1 pt-2 dark:border-white/20'
              >
                My items
              </Text>
              {renderConversations(ownedConversations)}
            </>
          )}
          {foundConversations && foundConversations.length > 0 && (
            <>
              <Text
                variant={'h4'}
                className='border-b-[1px] border-gray-700/10 px-2 pb-1 pt-2 dark:border-white/20'
              >
                Items scanned
              </Text>
              {renderConversations(foundConversations)}
            </>
          )}
        </>
      )}
    </div>
  );
}
