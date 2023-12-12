import { User } from '@supabase/supabase-js';
import { TConversationWithLastMessage } from '@utils/lib/messaging/services';
import { Database } from '@utils/lib/supabase/supabase_types';

export type ChatListProps = {
  conversations: Array<TConversationWithLastMessage>;
  currentUser?: User;
};

export type ChatCardProps = {
  conversation: TConversationWithLastMessage;
  selectedConversationId?: string;
  currentUser: User;
  itemId: string;
};

export type ChatProps = {
  conversationId?: string;
  oldMessages?: Array<DBMessage>;
  currentUser: User;
};

export type MessageProps = {
  message: DBMessage;
  prevMessage?: DBMessage;
  nextMessage?: DBMessage;
  currentUser: User;
};

export type InputChatProps = {
  conversationId: string;
};

export type MobileHeaderProps = {
  currentUser: User;
  item: DBItem;
};

// rename database types to be more readable

export type DBConversation =
  Database['public']['Tables']['conversation']['Row'];

export type DBMessage = Database['public']['Tables']['message']['Row'];

export type DBProfile = Database['public']['Tables']['profiles']['Row'];

export type DBItem = Database['public']['Tables']['item']['Row'];
