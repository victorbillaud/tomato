import { User } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';

export type ChatProps = {
  messages: Array<Database['public']['Tables']['message']['Row']> | null;
  currentUser: User;
};

export type MessageProps = {
  message: Database['public']['Tables']['message']['Row'];
  isSent?: boolean;
  firstMessage?: boolean;
  lastMessage?: boolean;
};
