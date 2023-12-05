import { User } from '@supabase/supabase-js';
import { TConversationWithLastMessage } from '@utils/lib/messaging/services';
import { Database } from '@utils/lib/supabase/supabase_types';

export type ChatListProps = {
  selectedConversationId?: string;
};

export type ChatCardProps = {
  conversation: TConversationWithLastMessage;
  selectedConversationId?: string;
  user?: User;
  itemInfo?: Database['public']['Tables']['item']['Row'];
};

export type ChatProps = {
  conversationId?: string;
  oldMessages?: Array<DBMessage>;
  currentUser?: User;
};

export type MessageProps = {
  message: DBMessage;
  prevMessage?: DBMessage;
  nextMessage?: DBMessage;
  currentUser?: User;
};

// rename database types to be more readable

export type DBConversation =
  Database['public']['Tables']['conversation']['Row'];

export type DBMessage = Database['public']['Tables']['message']['Row'];

export type DBProfile = Database['public']['Tables']['profiles']['Row'];
