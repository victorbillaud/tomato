import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase_types';

export async function listProducts(supabaseInstance: SupabaseClient<Database>) {
  const { data: products, error } = await supabaseInstance
    .from('product_prices_view')
    .select('*');

  return { products, error };
}
