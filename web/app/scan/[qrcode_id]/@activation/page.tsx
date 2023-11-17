import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { getQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';

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
      <Text variant='body' className='text-center opacity-50'>
        This is the <strong>Activation</strong> page
      </Text>
      <Text variant='body' className='text-center opacity-80'>
        {qrCode?.item_id != null
          ? 'This QR Code is already linked to an item'
          : 'This QR Code is not linked to an item'}
      </Text>
    </div>
  );
}
