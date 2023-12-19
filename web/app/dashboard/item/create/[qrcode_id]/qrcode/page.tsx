import { Text } from '@/components/common/text';
import NameSelector from '@/components/qrcode/NameSelector';
import { QrCode } from '@/components/qrcode/QrCode';

import { createClient } from '@/utils/supabase/server';
import { listQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';

export default async function CreateItemForm({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: qrCodes, error } = await listQRCode(supabase);

  if (error || !qrCodes) {
    throw new Error("You don't have any QR Code");
  }

  const qrCode = qrCodes.find((code) => code.id === params.qrcode_id);
  if (!qrCode) {
    throw new Error('This QR Code does not exist');
  }
  if (qrCode.item_id != null) {
    throw new Error('This QR Code is already linked to an item');
  }

  return (
    <div className='flex w-full flex-col items-center justify-center gap-10'>
      <NameSelector
        values={qrCodes.map((code) => ({
          name: code.name,
          id: code.id.toString(),
        }))}
        initialValue={qrCode.id}
        redirectPath='/qrcode'
      />
      {qrCode.barcode_data && <QrCode url={qrCode.barcode_data} />}
      <Text variant='body' className='text-center opacity-50'>
        Scan this QR Code with your phone and follow the instructions
      </Text>
    </div>
  );
}
