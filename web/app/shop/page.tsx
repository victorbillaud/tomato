import { createClient } from '@/utils/supabase/server';
import { listProductsWithPrices } from '@utils/lib/stripe/services';
import { cookies } from 'next/headers';
import Product from './Product';

export default async function ShopPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { products, error } = await listProductsWithPrices(supabase);

  return (
    <div>
      <h1>Shop</h1>
      <ul>
        {products &&
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
      </ul>
    </div>
  );
}
