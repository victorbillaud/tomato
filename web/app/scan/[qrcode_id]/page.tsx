import { SubmitButton } from '@/components/common/button';
import { Text } from '@/components/common/text';
import GeoLocation from '@/components/scan/GeoLocation';
import { fetchLocationByIP } from '@/utils/ip';
import { createClient } from '@/utils/supabase/server';
import { getQRCode } from '@utils/lib/qrcode/services';
import { insertScan } from '@utils/lib/scan/services';
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

  const ipMetadata = await fetchLocationByIP();
  const { data: insertedScan, error: scanInsertionError } = await insertScan(
    supabase,
    {
      item_id: qrCode?.item_id,
      qrcode_id: params.qrcode_id,
      type: [],
      ip_metadata: {
        ip: ipMetadata?.ip,
        hostname: ipMetadata?.hostname,
        city: ipMetadata?.city,
        region: ipMetadata?.region,
        country: ipMetadata?.country,
        loc: ipMetadata?.loc,
        org: ipMetadata?.org,
        postal: ipMetadata?.postal,
        timezone: ipMetadata?.timezone,
      },
    }
  );

  if (!qrCode || error) {
    throw new Error('QR Code not found');
  }

  if (!qrCode?.item_id) {
    throw new Error('QR Code not linked to an item');
  }

  const edgeFinderFlowWithItem = edgeFinderFlow.bind(
    null,
    qrCode?.item_id,
    params.qrcode_id
  );

  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center justify-start gap-20 px-3'>
      {insertedScan && <GeoLocation scanId={insertedScan.id} />}
      <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
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
