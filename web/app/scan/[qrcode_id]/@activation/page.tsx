import { SubmitButton } from '@/components/common/button';
import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { activateItem, getItemFromQrCodeId } from '@utils/lib/item/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const handleActivation = async (
  itemId: string | undefined,
  formData: FormData
) => {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!itemId) {
    throw new Error('Item not found');
  }

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

  const handleItemActivation = handleActivation.bind(null, item?.id);

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-20'>
      <div className='text-primary-700/20'>
        <Icon name='discount-check' size={120} color='currentColor' />
      </div>
      <Text variant='body' className='text-center opacity-50'>
        This item is <strong>not activated</strong> yet, if you want to activate
        it, click on the button below
      </Text>
      <form action={handleItemActivation}>
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
