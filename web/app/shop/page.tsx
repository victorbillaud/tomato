import { createClient } from '@/utils/supabase/server';
import { listProductsWithPrices } from '@utils/lib/stripe/services';
import { cookies } from 'next/headers';

export default async function ShopPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { products, error } = await listProductsWithPrices(supabase);

  console.log(products);

  if (error) {
    console.log(error);
  }

  return (
    <div>
      <h1>Shop</h1>
      <ul>
        {products &&
          products.map((product) => (
            <li key={product.id}>
              {product.name} - {product.price?.unit_amount}
            </li>
          ))}
      </ul>
    </div>
  );
}
