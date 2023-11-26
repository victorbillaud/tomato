import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase_types';

export async function getUserDetails(
  supabaseInstance: SupabaseClient<Database>,
  userId: string
) {
  const { data: user, error } = await supabaseInstance
    .from('user')
    .select('*')
    .eq('id', userId)
    .single();

  return { user, error };
}
