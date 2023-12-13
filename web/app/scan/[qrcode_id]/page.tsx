import { SubmitButton } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { getQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import { edgeFinderFlow } from './action';

export default async function Scan({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: qrCode, error } = await getQRCode(supabase, params.qrcode_id);

  if (!qrCode || error) {
    throw new Error('QR Code not found');
  }

  if (!qrCode?.item_id) {
    throw new Error('QR Code not linked to an item');
  }

  const edgeFinderFlowWithItem = edgeFinderFlow.bind(null, qrCode?.item_id);

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-20 px-3'>
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        {qrCode?.item_id ? (
          <>
            <Text variant='h4' className='text-center opacity-90'>
              How it seems you found an item... let's start a conversation with
              the owner !
            </Text>
            <form action={edgeFinderFlowWithItem}>
              <SubmitButton
                variant='secondary'
                type='submit'
                text='Start a conversation'
                className='w-full'
              />
            </form>
          </>
        ) : (
          <>
            <Text variant='body' className='text-center opacity-90'>
              How it seems you found a QR Code... But it's not linked to an item
              ! Try to find another one ! If you don't know{' '}
              <strong>Tomato</strong> yet, you can check it out .
            </Text>
          </>
        )}
      </div>
    </div>
  );
}
