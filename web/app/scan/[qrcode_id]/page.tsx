import { SubmitButton } from '@/components/common/button';
import { CustomImage } from '@/components/common/image';
import { Text } from '@/components/common/text';
import { CookieSetter } from '@/components/scan/CookieSetter';
import GeoLocation from '@/components/scan/GeoLocation';
import { ItemScanView } from '@/components/scan/ItemScanView';
import { fetchLocationByIP } from '@/utils/ip';
import { createClient } from '@/utils/supabase/server';
import { getPublicScanItemView } from '@utils/lib/item/services';
import { getQRCode } from '@utils/lib/qrcode/services';
import { getScan, insertScan } from '@utils/lib/scan/services';
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
  let scan = null;

  // Get the cookie to check if the user has already scanned the QR Code in the last 1 minute
  const lastScanCookie = cookieStore.get('last_scan')
    ? JSON.parse(cookieStore.get('last_scan')?.value || '')
    : null;

  // Check if the cookie exists and the time difference is not less than 1 minute
  if (
    lastScanCookie &&
    new Date().getTime() - lastScanCookie.timestamp < 60000
  ) {
    const { data: pastScan } = await getScan(
      supabase,
      lastScanCookie.item_id,
      lastScanCookie.qrcode_id
    );
    scan = pastScan;
  } else {
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
    scan = insertedScan;
  }

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

  // Fetch item details

  const { data, error: getPublicScanItemViewError } =
    await getPublicScanItemView(supabase, qrCode?.item_id);

  if (getPublicScanItemViewError) {
    throw getPublicScanItemViewError;
  }

  if (!data || data.length === 0) {
    throw new Error('Item not found');
  }

  const item = data[0];

  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center justify-start gap-20 px-3'>
      <CookieSetter itemId={qrCode?.item_id} qrcodeId={params.qrcode_id} />
      {scan && <GeoLocation scanId={scan.id} />}
      <div className='flex h-full w-full flex-col items-center justify-center gap-5'>
        {qrCode?.item_id ? (
          <>
            <Text variant='subtitle' className='text-center opacity-90'>
              How it seems you found an item... let's start a conversation with
              the owner !
            </Text>
            {item?.image_path && (
              <CustomImage
                alt='item'
                src={item?.image_path}
                shadow='md'
                rounded='md'
                height={200}
                width={200}
                cover={true}
              />
            )}
            <ItemScanView item={item} />
            <form action={edgeFinderFlowWithItem}>
              <SubmitButton
                variant='primary'
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
