'use client';

import { Button } from '@/components/common/button';
import { CustomImage } from '@/components/common/image';
import { Text } from '@/components/common/text';
import { getStripe } from '@/utils/stripe/client';
import { listProductsWithPrices } from '@utils/lib/stripe/services';
import { useCallback, useState } from 'react';

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

interface IProductProps {
  product: ArrayElementType<
    Awaited<ReturnType<typeof listProductsWithPrices>>['products']
  >;
}

const LOOKUP_TABLE_QUANTITY = {
  qrcode_unique: 1,
  qrcode_3_pack: 3,
  qrcode_10_pack: 10,
};

export default function Product({ product }: IProductProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = useCallback(async () => {
    setIsSubmitting(true);
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
        const data = await res.json();
        throw Error(data.error.message);
      }

      const data = await res.json();
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [product.price]);

  const getPrice = useCallback(() => {
    // unit_amount is in cents so we divide by 100 to get the euro price
    return product.price?.unit_amount ? product.price?.unit_amount / 100 : 0;
  }, [product.price]);

  const getQuantity = useCallback(() => {
    const index = product.price?.lookup_key
      ? Object.keys(LOOKUP_TABLE_QUANTITY).indexOf(product.price?.lookup_key)
      : -1;

    if (index === -1) return 0;

    return Object.values(LOOKUP_TABLE_QUANTITY)[index];
  }, [product.price]);

  return (
    <div className='flex w-full flex-col gap-3 rounded-md border border-stone-300 p-4 shadow-md dark:border-stone-700 md:w-auto'>
      <div className='relative'>
        <CustomImage
          src={product.image_url}
          alt={product.name}
          width={250}
          height={250}
          rounded='lg'
        />
        <div className='absolute inset-0 rounded-lg border-none border-stone-300 bg-white/10 backdrop-blur-sm dark:border-stone-700 ' />
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <h1 className='text-right text-6xl font-bold text-primary-500 md:text-left'>
            {getQuantity()}
          </h1>
          <div className='flex flex-col items-end md:items-start'>
            <Text variant='caption' color='md:text-white/80 text-black/80 dark:text-white/80' weight={400}>
              {product.name}
            </Text>
          </div>
        </div>
      </div>
      <div className='flex flex-row items-start'>
        <Text variant='h2' className='text-center' weight={600}>
          €{getPrice()}
        </Text>
      </div>
      <Button
        text='Buy'
        onClick={() => handleCheckout()}
        className='w-full'
        variant='primary'
        isLoader={isSubmitting}
      />
    </div>
  );
}
