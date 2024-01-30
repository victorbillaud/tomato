import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { listQRCode } from '@utils/lib/qrcode/services';
import { listProductsWithPrices } from '@utils/lib/stripe/services';
import { cookies } from 'next/headers';
import Product from './Product';

export default async function ShopPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { products, error } = await listProductsWithPrices(supabase);

  const { data: qrCodes, error: listQrCodeError } = await listQRCode(supabase);

  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center gap-5 justify-start px-3'>
      <div className='flex w-full flex-row items-center justify-between gap-2 md:flex-row'>
        <div className='flex flex-col items-start justify-center gap-2'>
          <Text variant='h1'>Shop</Text>
          <Text variant='body'>
            Buy your QR Code and start using it right away.
          </Text>
        </div>
        {!listQrCodeError ? (
          <div className='flex flex-col items-end justify-center'>
            <Text variant='caption' className='text-right opacity-70'>
              Your QR codes left
            </Text>
            <h1 className='text-6xl font-bold text-primary-500'>
              {qrCodes?.length}
            </h1>
          </div>
        ) : (
          <StyledLink
            text='Login to see your QR codes'
            variant='secondary'
            href='/auth/login?next=/shop'
          />
        )}
      </div>
      <div className='flex w-full flex-col items-center justify-between gap-6 md:flex-row-reverse'>
        {products &&
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
