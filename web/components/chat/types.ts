import { User } from '@supabase/supabase-js';
import { TConversationWithLastMessage } from '@utils/lib/messaging/services';
import { Database } from '@utils/lib/supabase/supabase_types';

export type ChatListProps = {
  selectedConversationId: string | null;
};

export type ChatCardProps = {
  conversation: TConversationWithLastMessage;
  selectedConversationId: string | null;
  user: User | null;
  itemInfo: Database['public']['Tables']['item']['Row'] | null;
};

export type ChatProps = {
  conversationId: string | null;
  messages: Array<DBMessage> | null;
  currentUser: User | null;
};

export type MessageProps = {
  message: DBMessage;
  prevMessage: DBMessage | null;
  nextMessage: DBMessage | null;
  currentUser: User | null;
};

// rename database types to be more readable

export type DBConversation =
  Database['public']['Tables']['conversation']['Row'];

export type DBMessage = Database['public']['Tables']['message']['Row'];

export type DBProfile = Database['public']['Tables']['profiles']['Row'];
