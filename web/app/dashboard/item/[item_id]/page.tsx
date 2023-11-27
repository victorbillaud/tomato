import { SubmitButton } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { ItemInfo, ItemScanHistory, ItemStateBanner } from '@/components/item';
import { ItemSettings } from '@/components/item/ItemSettings';
import { QrCode } from '@/components/qrcode/QrCode';
import { createClient } from '@/utils/supabase/server';
import { getItem, updateItem } from '@utils/lib/item/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function handleDeclareLost(formData: FormData) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const itemId = formData.get('item_id') as string;

  const { data: item, error } = await updateItem(supabase, itemId, {
    lost: true,
    lost_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  revalidatePath(`/dashboard/item/${item.id}`);
  redirect(`/dashboard/item/${item.id}`);
}

async function handleDeclareFound(formData: FormData) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const itemId = formData.get('item_id') as string;

  const { data: item, error } = await updateItem(supabase, itemId, {
    lost: false,
    lost_at: null,
  });

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  revalidatePath(`/dashboard/item/${item.id}`);
  redirect(`/dashboard/item/${item.id}`);
}

export default async function ItemPage(props: { params: { item_id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: item, error } = await getItem(supabase, props.params.item_id);

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-between gap-5'>
      <div className='flex w-full flex-col items-center justify-start gap-5'>
        <ItemStateBanner item={item} />
        <div className='flex w-full flex-col items-center justify-center gap-5 md:flex-row'>
          <ItemInfo item={item} />
          {item.qrcode[0].barcode_data && (
            <QrCode url={item.qrcode[0].barcode_data} download />
          )}
        </div>
        <ItemSettings item={item} />
        {item.qrcode_id ? (
          <ItemScanHistory item={item} />
        ) : (
          <Text variant='caption' className='opacity-50'>
            No scan history
          </Text>
        )}
      </div>
      {!item.lost ? (
        <form action={handleDeclareLost}>
          <input type='hidden' name='item_id' value={item.id} />
          <SubmitButton
            text='Declare item as lost'
            type='submit'
            variant='tertiary'
            className='text-red-600 dark:text-red-500'
          />
        </form>
      ) : (
        <form action={handleDeclareFound}>
          <input type='hidden' name='item_id' value={item.id} />
          <SubmitButton
            text='Declare item as found'
            type='submit'
            variant='secondary'
            icon='discount-check'
          />
        </form>
      )}
    </div>
  );
}
