import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase_types';
import { getUserDetails } from '../user/services';

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

export type TConversationWithLastMessage = ArrayElementType<
  Database['public']['Functions']['get_user_conversations_with_last_message']['Returns']
> & {
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
};

export async function listUserConversations(
  supabaseInstance: SupabaseClient<Database>
): Promise<{
  data: TConversationWithLastMessage[];
  error: PostgrestError | null;
}> {
  const {
    data: { user },
  } = await supabaseInstance.auth.getUser();

  const { data, error } = await supabaseInstance.rpc(
    'get_user_conversations_with_last_message',
    {
      user_id: user.id,
    }
  );

  const conversations: TConversationWithLastMessage[] =
    data as TConversationWithLastMessage[];

  // sort conversations by last message date & time (newest first) (if there is no last message, use the conversation.created_at)
  conversations.sort((a, b) => {
    const aDate = a.last_message?.created_at || a.created_at;
    const bDate = b.last_message?.created_at || b.created_at;

    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return { data: conversations, error };
}

export async function insertConversation(
  supabaseInstance: SupabaseClient<Database>,
  conversation: Pick<
    Database['public']['Tables']['conversation']['Insert'],
    'finder_id' | 'item_id'
  >
) {
  const {
    data: { user },
  } = await supabaseInstance.auth.getUser();

  const conversationToInsert: Database['public']['Tables']['conversation']['Insert'] =
    {
      ...conversation,
      owner_id: user.id,
    };

  const { data: insertedConversation, error } = await supabaseInstance
    .from('conversation')
    .insert(conversationToInsert)
    .select('*')
    .single();
  return { insertedConversation, error };
}

export async function getConversationUsers(
  supabaseInstance: SupabaseClient<Database>,
  conversationId: string
) {
  const { data, error } = await supabaseInstance
    .from('conversation')
    .select('owner_id, finder_id')
    .eq('id', conversationId);

  if (error) {
    return { users: null, error };
  }

  let users: Database['public']['Tables']['profiles']['Row'][] = [];

  for (const user in data[0]) {
    const userId = data[0][user];

    const { user: userDetails, error: userError } = await getUserDetails(
      supabaseInstance,
      userId
    );

    if (userError) {
      return { users: null, error: userError };
    }

    users.push(userDetails);
  }

  return { users, error };
}

export async function getConversationMessages(
  supabaseInstance: SupabaseClient<Database>,
  conversationId: string
) {
  const { data: messages, error } = await supabaseInstance
    .from('message')
    .select('*')
    .eq('conversation_id', conversationId);

  return { messages, error };
}

export async function insertMessage(
  supabaseInstance: SupabaseClient<Database>,
  message: Database['public']['Tables']['message']['Insert']
) {
  const {
    data: { user: sender },
  } = await supabaseInstance.auth.getUser();

  const messageToInsert: Database['public']['Tables']['message']['Insert'] = {
    ...message,
    sender_id: sender.id,
  };

  const { data: insertedMessage, error } = await supabaseInstance
    .from('message')
    .insert(messageToInsert)
    .select('*')
    .single();

  return { insertedMessage, error };
}
