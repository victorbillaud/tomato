import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { getQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Scan({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: qrCode, error } = await getQRCode(supabase, params.qrcode_id);

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-20'>
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        {qrCode?.item_id ? (
          <>
            <Text variant='h4' className='text-center opacity-90'>
              How it seems you found an item...
            </Text>
            <Text variant='body' className='text-center opacity-30'>
              This page is not yet implemented
            </Text>
          </>
        ) : (
          <Text variant='body' className='text-center opacity-90'>
            How it seems you found a QR Code... But it's not linked to an item !
            Try to find another one ! If you don't know <strong>Tomato</strong>{' '}
            yet, you can check it out{' '}
            <Link className='text-primary-600' href='/'>
              here
            </Link>
            .
          </Text>
        )}
      </div>
    </div>
  );
}
