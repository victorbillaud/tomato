import { Text } from '@/components/common/text';
import { QrCode } from '@/components/qrcode/QrCode';
import { createClient } from '@/utils/supabase/server';
import { getQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';

export default async function CreateItem({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const qrCode = await getQRCode(supabase, params.qrcode_id);

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-10'>
      <div className='flex flex-col items-center justify-center gap-5'>
        <Text variant='body' className='text-center opacity-50'>
          This is now the time to create your item, you have 2 possibilities:
        </Text>
      </div>

      <div className='flex w-full flex-col-reverse items-center justify-between gap-10 md:flex-row'>
        <div className='flex w-full flex-col items-center justify-center gap-10'>
          {qrCode.barcode_data && <QrCode url={qrCode.barcode_data} />}
          <Text variant='body' className='text-center opacity-50'>
            Scan this QR Code with your phone and follow the instructions
          </Text>
        </div>

        <div className='h-1 w-2/4 rounded-md bg-stone-300 dark:bg-stone-700 md:h-2/4 md:w-1' />

        <div className='flex w-full flex-col items-center justify-center gap-5'>
          <Text variant='body' className='text-center opacity-50'>
            Associate your item with this QR Code on this page
          </Text>
        </div>
      </div>
    </div>
  );
}
