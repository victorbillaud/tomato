import { User } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';

export type ChatProps = {
  messages: Array<TMessage> | null;
  users: Array<TProfile> | null;
  currentUser: User | null;
};

export type MessageProps = {
  message: TMessage;
  prevMessage: TMessage | null;
  nextMessage: TMessage | null;
  currentUser: User | null;
};

export type TConversation = Database['public']['Tables']['conversation']['Row'];

export type TMessage = Database['public']['Tables']['message']['Row'];

export type TProfile = Database['public']['Tables']['profiles']['Row'];
