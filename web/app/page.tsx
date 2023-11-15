import { Button } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { insertQRCode, listQRCode } from '@utils/lib/qrcode/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function Index() {
  async function createQRCode() {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.getUser();
    await insertQRCode(supabase, {
      user_id: data.user?.id as string,
    });

    revalidatePath('/');
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  const qrCodes = await listQRCode(supabase);

  return (
    <div className='animate-in flex w-full flex-col gap-5 px-3 opacity-0'>
      <Text variant={'h1'} className='text-center'>
        Tomato
      </Text>

      {data.user && (
        <form action={createQRCode}>
          <Button type='submit' text='Create QR Code' variant='primary' />
        </form>
      )}

      {qrCodes.map((qrCode) => (
        <div key={qrCode.id} className='flex flex-col gap-2'>
          <Text variant='h2'>{qrCode.id}</Text>
          <Text variant='h3'>{qrCode.barcode_data}</Text>
          <Text variant='h3'>{qrCode.created_at}</Text>
        </div>
      ))}
    </div>
  );
}
