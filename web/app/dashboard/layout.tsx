import { Button } from '@/components/common/button';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { insertQRCode, listQRCode } from '@utils/lib/qrcode/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const qrCodes = await listQRCode(supabase);

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-start'>
      <div className='flex w-full flex-row items-center justify-between gap-3'>
        <StyledLink
          text='Add item'
          href={`/dashboard/item/create/${qrCodes[0].id}`}
          target='_self'
        />
        <div className='flex w-full flex-row items-center justify-end gap-3'>
          <Text variant='body'>
            <strong>{qrCodes.length}</strong> left
          </Text>
          <form action={createQRCode}>
            <Button
              text='Buy new qr code'
              variant='secondary'
              color='red'
              type='submit'
            />
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}