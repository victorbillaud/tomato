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

  let ownedConversations = conversations?.filter(
    (conversation) => conversation.owner_id === user.id
  );

  let foundConversations = conversations?.filter(
    (conversation) => conversation.finder_id === user.id
  );

  // ! Pour l'instant on ne peut pas récupérer les infos de l'item lorsque l'on est finder
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
          itemInfo={itemInfo}
        />
      );
    });
  };

  return (
    <div className='flex h-full w-full flex-col'>
      <Text variant={'h2'} className='p-2'>
        Conversations
      </Text>
      {ownedConversations && (
        <>
          <Text
            variant={'h4'}
            className='border-b-[1px] border-gray-700/10 px-2 pb-1 pt-2'
          >
            My items
          </Text>
          {renderConversations(ownedConversations)}
        </>
      )}
      {foundConversations && (
        <>
          <Text
            variant={'h4'}
            className='border-b-[1px] border-gray-700/10 px-2 pb-1 pt-2'
          >
            Items scanned
          </Text>
          {renderConversations(foundConversations)}
        </>
      )}
    </div>
  );
}
