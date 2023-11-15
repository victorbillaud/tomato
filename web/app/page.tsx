import { Button } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { insertQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';

export default async function Index() {
  async function createQRCode() {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.getUser();
    await insertQRCode(supabase, {
      user_id: data.user?.id as string,
    });

    return;
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

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
    </div>
  );
}
