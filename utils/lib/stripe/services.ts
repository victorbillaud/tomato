import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase_types';

export async function listProducts(supabaseInstance: SupabaseClient<Database>) {
  const { data: products, error } = await supabaseInstance.rpc(
    'list_stripe_products'
  );

  return { products, error };
}

export async function listPrices(supabaseInstance: SupabaseClient<Database>) {
  const { data: prices, error } =
    await supabaseInstance.rpc('list_stripe_prices');

  return { prices, error };
}

export async function listProductsWithPrices(
  supabaseInstance: SupabaseClient<Database>
) {
  const { products, error: productsError } =
    await listProducts(supabaseInstance);
  const { prices, error: pricesError } = await listPrices(supabaseInstance);

  if (productsError || pricesError) {
    return { error: productsError || pricesError };
  }

  const productsWithPrices = products.map((product) => {
    const price = prices.find((price) => price.id === product.price_id);
    return { ...product, price };
  });

  return { products: productsWithPrices };
}

export async function getCustomerId(
  supabaseInstance: SupabaseClient<Database>,
  uuid: string
) {
  const { data: stripe_customer_id, error } = await supabaseInstance.rpc(
    'get_customer_id',
    {
      p_id: uuid,
    }
  );

  if (error) {
    return { error };
  }

  console.log('customers', stripe_customer_id);

  return { stripe_customer_id };
}
