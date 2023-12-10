'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Text } from '../common/text';
import ChatCard from './ChatCard';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  TConversationWithLastMessage,
  listUserConversations,
} from '@utils/lib/messaging/services';

export default function ChatList() {
  const supabase = createClient();
  const selectedConversationId = useParams().conversation_id as string;
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [ownedConversations, setOwnedConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [foundConversations, setFoundConversations] = useState<
    TConversationWithLastMessage[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser(supabase: any) {
      const {
        data: { user: userFetched },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        throw new Error('User not found');
      }
      setUser(userFetched);
      await fetchConversation(supabase, userFetched);
    }

    async function fetchConversation(supabase: any, userFetched: User) {
      const { data: conversationsFetched, error: conversationsError } =
        await listUserConversations(supabase);

      if (conversationsError) {
        throw new Error("Couldn't fetch conversations");
      }
      setConversations(conversationsFetched);
      setOwnedConversations(
        conversationsFetched.filter((conv) => conv.owner_id === userFetched.id)
      );
      setFoundConversations(
        conversationsFetched.filter((conv) => conv.finder_id === userFetched.id)
      );
      setLoading(false);
    }

    fetchUser(supabase);
  }, [supabase]);

  const renderConversations = (
    conversationsList: TConversationWithLastMessage[]
  ) => {
    return conversationsList.map((conversation) => {
      return (
        <ChatCard
          key={conversation.id}
          conversation={conversation}
          selectedConversationId={selectedConversationId}
          user={user as User}
          itemId={conversation.item_id}
        />
      );
    });
  };

  if (!conversations || loading) {
    return (
      <div className='flex h-full w-full flex-col gap-6 p-4'>
        <div className='h-8 w-1/2 animate-pulse rounded-lg bg-gray-300/20'></div>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className='h-16 w-full animate-pulse rounded-lg bg-gray-300/20'
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <Text variant={'h2'} className='p-2'>
        Conversations
      </Text>
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
    </div>
  );
}
