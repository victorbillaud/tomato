import { SubmitButton } from '@/components/common/button';
import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { activateItem, getItemFromQrCodeId } from '@utils/lib/item/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Tomato - Activate',
};

const handleActivation = async (itemId: string, formData: FormData) => {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: activatedItem, error: activatedItemError } = await activateItem(
    supabase,
    itemId
  );

  if (!activatedItem || activatedItemError) {
    console.error(activatedItemError);
    throw new Error("Couldn't activate Item");
  }

  return redirect(`/dashboard/item/${itemId}`);
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

  if (error) {
    console.error(error);
    throw new Error("Couldn't fetch Item");
  }

  if (!item) {
    throw new Error("Couldn't find Item");
  }

  const handleItemActivation = handleActivation.bind(null, item.id);

  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-20 px-0 sm:px-3'>
      <div className='text-primary-700/20'>
        <Icon name='discount-check' size={120} color='currentColor' />
      </div>
      <Text variant='body' className='text-center opacity-50'>
        This item is <strong>not activated</strong> yet, if you want to activate
        it, click on the button below
      </Text>
      <form action={handleItemActivation}>
        <input type='hidden' name='itemId' value={item.id} />
        <SubmitButton
          type='submit'
          variant='primary'
          text='Activate'
          className='w-full'
        />
      </form>
    </div>
  );
}
