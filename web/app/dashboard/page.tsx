import { SubmitButton } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { ItemCard } from '@/components/item';
import { createClient } from '@/utils/supabase/server';
import { listItems } from '@utils/lib/item/services';
import { insertQRCode, listQRCode } from '@utils/lib/qrcode/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: items, error } = await listItems(supabase);

  if (error) {
    throw error;
  }

  return (
    <>
      <DashboardNavBar />
      <div className='flex w-full flex-1 flex-col items-center justify-start gap-3 py-3'>
        {items && items.length > 0 ? (
          <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
            {items.map((item) => (
              <ItemCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <Text variant='body' className='text-center opacity-40'>
              If you want to add a new item, click on the add item button.
            </Text>
          </div>
        )}
      </div>
    </>
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
