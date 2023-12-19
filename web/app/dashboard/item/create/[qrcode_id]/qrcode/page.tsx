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
    <div className='flex w-full flex-col items-center justify-center gap-5'>
      <div className='flex w-full flex-col items-start justify-start gap-5 text-left'>
        <Text variant='h1' weight={400} className='opacity-90'>
          <strong className='text-primary-600'>1.</strong> Choose a qrcode to
          link to your new item
        </Text>
        <Text variant='h4' weight={300} className='opacity-70'>
          To facilitate the identification of your different items, Tomato
          automatically generates a name for each QR Code. You can select one of
          the names below for your new item.
        </Text>
      </div>
      <NameSelector
        values={qrCodes.map((code) => ({
          name: code.name,
          id: code.id.toString(),
        }))}
        initialValue={qrCode.id}
        redirectPath='/qrcode'
      />
      <div className='flex w-full flex-col items-start justify-start gap-5 text-left'>
        <Text variant='h1' weight={400} className='opacity-90'>
          <strong className='text-primary-600'>2.</strong> Scan the QR Code with
          your phone
        </Text>
        <Text variant='h4' weight={400} className='opacity-80'>
          Open the Tomato app on your phone and scan the QR Code below. <br />
          You can either download the app or use the web version. You must be
          login to Tomato to continue the process.
        </Text>
      </div>

      {qrCode.barcode_data && <QrCode size={300} url={qrCode.barcode_data} />}
    </div>
  );
}
