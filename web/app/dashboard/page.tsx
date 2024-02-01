import { Text } from '@/components/common/text';
import { ItemCard } from '@/components/item';
import { CreationModal } from '@/components/item/CreationModal';
import { createClient } from '@/utils/supabase/server';
import { listItems } from '@utils/lib/item/services';
import { listQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: items, error } = await listItems(supabase);
  const { data: qrCodes, error: qrCodesError } = await listQRCode(supabase);

  const qrCodeId = searchParams.qrcode_id as string | undefined;

  if (error) throw error;

  if (qrCodesError) throw qrCodesError;

  return (
    <>
      <DashboardNavBar qrcodeId={qrCodeId} />
      <div className='flex w-full flex-1 flex-col items-center justify-start gap-3 py-3'>
        {items && items.length > 0 ? (
          <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
            {items.map((item) => (
              <ItemCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            {qrCodes.length > 0 ? (
              <Text variant='body' className='text-center opacity-40'>
                If you want to add a new item, click on the add item button.
              </Text>
            ) : (
              <Text variant='body' className='text-center opacity-40'>
                You can{"'"}t add a new item because you don{"'"}t have any QR
                codes, go buy some in the{' '}
                <Link href='/shop' className='text-primary-600'>
                  shop
                </Link>
              </Text>
            )}
          </div>
        )}
      </div>
    </>
  );
}

interface DashboardNavBarProps {
  qrcodeId?: string | undefined;
}

async function DashboardNavBar({ qrcodeId }: DashboardNavBarProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: qrCodes, error } = await listQRCode(supabase);

  if (error) throw error;
  if (qrCodes.length === 0) qrcodeId = undefined;

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <div className='flex w-full flex-row items-center justify-end gap-3'>
        <Text variant='caption'>
          <strong>{qrCodes ? qrCodes.length : 0}</strong> left
        </Text>
        <CreationModal
          qrcodeId={qrcodeId ?? qrCodes.at(0)?.id.toString() ?? null}
        />
      </div>
    </div>
  );
}
