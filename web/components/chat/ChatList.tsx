import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import {
  TConversationWithLastMessage,
  listUserConversations,
} from '@utils/lib/messaging/services';
import { getItem } from '@utils/lib/item/services';
import { ChatListProps } from './types';
import { Text } from '../common/text';
import ChatCard from './ChatCard';

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
    throw new Error("Couldn't fetch conversations");
  }

  let ownedConversations = conversations?.filter(
    (conversation) => conversation.owner_id === user.id
  );

  let foundConversations = conversations?.filter(
    (conversation) => conversation.finder_id === user.id
  );

  // ! For now, the finder can't get the item info
  async function getItemInfo(itemId: string) {
    const { data: item, error } = await getItem(supabase, itemId);
    if (error) {
      console.error(error);
      return null;
    }
    return item;
  }

  const renderConversations = (
    conversationsList: TConversationWithLastMessage[]
  ) => {
    return conversationsList.map(async (conversation) => {
      const itemInfo = await getItemInfo(conversation.item_id);

      return (
        <ChatCard
          key={conversation.id}
          conversation={conversation}
          selectedConversationId={selectedConversationId}
          user={user}
          itemInfo={itemInfo ?? undefined}
        />
      );
    });
  };

  return (
    <div className='flex h-full w-full flex-col'>
      <Text variant={'h2'} className='p-2'>
        Conversations
      </Text>
      {ownedConversations.length > 0 && (
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
      {foundConversations.length > 0 && (
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
