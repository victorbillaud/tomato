import { User } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';

// ! A supprimer !
// export interface IUser {
//   id: string;
//   updated_at: Date;
//   username: string;
//   full_name: string;
//   avatar_url: string;
//   website: string;
// }

export interface IConversation {
  id: string;
  updated_at: Date;
  created_at: Date;
  item_owner: Database['public']['Tables']['profiles']['Row'];
  item_id: string;
  participants: Array<Database['public']['Tables']['profiles']['Row']>; // autres personnes dans la conversation (minimum 1)
  last_message: IMessage; // TODO : Supabase function
}

export interface IMessage {
  id: string;
  conversation_id: string;
  content: string;
  created_at: Date | string; // supprimer le string
  user_id: string; // sender id
}

export interface IChatProps {
  conversation: IConversation | null;
  currentUser: User | null;
}

export interface IMessageProps {
  message: IMessage;
  isSent?: boolean;
  firstMessage?: boolean;
  lastMessage?: boolean;
}
