import { Button, SubmitButton } from '@/components/common/button';
import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { activateItem, getItemFromQrCodeId } from '@utils/lib/item/services';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Tomato - Activate',
};

export default async function Scan({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: item, error } = await getItemFromQrCodeId(
    supabase,
    params.qrcode_id
  );

  if (error) throw error;

  if (!item?.id) throw new Error('Item not found');

  if (item.activated) redirect(`/dashboard/item/${item.id}`);

  const { data: activatedItem, error: activatedItemError } = await activateItem(
    supabase,
    item.id
  );

  if (!activatedItem || activatedItemError) {
    console.error(activatedItemError);
    throw new Error("Couldn't activate Item");
  }

  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-20 px-0 sm:px-3'>
      <div className='text-green-400/70'>
        <Icon name='discount-check' size={220} color='text-tomato-green/70' />
      </div>
      <Text variant='body' className='text-center text-xl opacity-80'>
        Well done ! Your item <strong>{item.name}</strong> is now activated.
      </Text>
      <Link href={`/dashboard/item/${item?.id}`}>
        <Button text='Go to item page' variant='secondary' />
      </Link>
    </div>
  );
}
