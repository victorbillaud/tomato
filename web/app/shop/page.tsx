import { createClient } from '@/utils/supabase/server';
import { listProductsWithPrices } from '@utils/lib/stripe/services';
import { cookies } from 'next/headers';
import Product from './Product';

export default async function ShopPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { products, error } = await listProductsWithPrices(supabase);

  return (
    <div className='flex w-full flex-col items-center justify-center gap-5 px-3'>
      <h1>Shop</h1>
      <div className='flex flex-row-reverse items-center justify-between gap-6'>
        {products &&
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
