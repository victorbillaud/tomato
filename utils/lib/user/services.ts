import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase_types';

export async function getUserDetails(
  supabaseInstance: SupabaseClient<Database>,
  userId: string
) {
  const { data: user, error } = await supabaseInstance
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { user, error };
}

export async function getUserAvatarUrlById(
  supabaseInstance: SupabaseClient<Database>,
  userId: string
) {
  const { data: user, error } = await supabaseInstance
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .single();

  const avatarUrl = user?.avatar_url;

  return { avatarUrl, error };
}
