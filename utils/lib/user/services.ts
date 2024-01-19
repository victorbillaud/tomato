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

export async function updateUserDetails(
  supabaseInstance: SupabaseClient<Database>,
  userId: string,
  updates: Record<string, unknown>
) {
  const { data: user, error } = await supabaseInstance
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  return { user, error };
}
