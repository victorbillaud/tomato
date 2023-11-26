import { User } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';

export type ChatProps = {
  messages: Array<TMessage> | null;
  currentUser: User | null;
};

export type MessageProps = {
  message: TMessage;
  isSent?: boolean;
  firstMessage?: boolean;
  lastMessage?: boolean;
};

export type TConversation = Database['public']['Tables']['conversation']['Row'];

export type TMessage = Database['public']['Tables']['message']['Row'];
