'use client';

import { getStripe } from '@/utils/stripe/client';
import { listProductsWithPrices } from '@utils/lib/stripe/services';
import { useCallback } from 'react';

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

interface IProductProps {
  product: ArrayElementType<
    Awaited<ReturnType<typeof listProductsWithPrices>>['products']
  >;
}

export default function Product({ product }: IProductProps) {
  const handleCheckout = useCallback(async () => {
    try {
      const res = await fetch('/api/stripe-checkout-session', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({
          price: {
            id: product.price?.id,
            ...product.price,
          },
          quantity: 1,
        }),
      });

      if (!res.ok) {
        console.error(res);
        throw Error(res.statusText);
      }

      const data = await res.json();
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      console.log('done');
    }
  }, [product.price]);

  return (
    <div>
      <h1>Product</h1>
      <ul>
        <li>
          {product.name} - {product.price?.unit_amount}
        </li>
        <button onClick={() => handleCheckout()}>Buy</button>
      </ul>
    </div>
  );
}
