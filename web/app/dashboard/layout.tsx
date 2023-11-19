import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { insertQRCode, listQRCode } from '@utils/lib/qrcode/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { SubmitButton } from '../../components/common/button/SubmitButton';
import { AddItemLink } from './AddItemButton';

async function createQRCode() {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await insertQRCode(supabase, {
    user_id: user?.id as string,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('QR Code not inserted');
  }

  revalidatePath('/');
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-start'>
      <DashboardNavBar />
      {/* <div className='mt-3 h-0.5 w-[95%] rounded-full border border-stone-200 opacity-50 dark:border-stone-700' /> */}
      {children}
    </div>
  );
}

async function DashboardNavBar() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: qrCodes, error } = await listQRCode(supabase);

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <div className='flex w-full flex-row items-center justify-end gap-3'>
        <Text variant='caption'>
          <strong>{qrCodes ? qrCodes.length : 0}</strong> left
        </Text>
        <form action={createQRCode}>
          <SubmitButton
            text='Buy new qr code'
            variant='secondary'
            color='red'
            type='submit'
            size='small'
          />
        </form>
        <AddItemLink
          text='Add item'
          href={`/dashboard/item/create/${
            qrCodes && qrCodes.length ? qrCodes[0].id : ''
          }`}
          target='_self'
          size='small'
          disabled={qrCodes && qrCodes.length > 0 ? false : true}
        />
      </div>
    </div>
  );
}
