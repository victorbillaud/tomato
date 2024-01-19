import { SubmitButton } from '@/components/common/button';
import { Tag } from '@/components/common/tag';
import { Text } from '@/components/common/text';
import { ItemInfo, ItemScanHistory, ItemStateBanner } from '@/components/item';
import { ItemSettings } from '@/components/item/ItemSettings';
import { QrCode } from '@/components/qrcode/QrCode';
import { createClient } from '@/utils/supabase/server';
import { deleteItem, getItem, updateItem } from '@utils/lib/item/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function handleDeclareLost(itemId: string) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

async function handleDeclareFound(itemId: string) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

async function handleDeleteItem(itemId: string) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: item, error } = await deleteItem(supabase, itemId);

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  revalidatePath(`/dashboard`);
  redirect(`/dashboard`);
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

  const handleDeclareLostItem = handleDeclareLost.bind(null, item.id);
  const handleDeclareFoundItem = handleDeclareFound.bind(null, item.id);
  const handleDeleteItemItem = handleDeleteItem.bind(null, item.id);

  return (
    <div className='flex h-full w-full flex-col items-center justify-between gap-5'>
      <div className='flex w-full flex-col items-center justify-start gap-5'>
        <ItemStateBanner item={item} />
        <div className='flex w-full flex-col items-center justify-center gap-5 md:flex-row'>
          <ItemInfo item={item} />
          {item.qrcode[0].barcode_data && (
            <div className='flex flex-col items-center gap-2'>
              <Tag
                className='text-center'
                text={item.qrcode[0].name}
                color='blue'
              />
              <QrCode url={item.qrcode[0].barcode_data} size={200} download />
            </div>
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
      <div className='flex w-full flex-row items-center justify-center gap-5'>
        {!item.lost ? (
          <form action={handleDeclareLostItem}>
            <SubmitButton
              text='Declare item as lost'
              type='submit'
              variant='tertiary'
              className='text-red-600 dark:text-red-500'
            />
          </form>
        ) : (
          <form action={handleDeclareFoundItem}>
            <SubmitButton
              text='Declare item as found'
              type='submit'
              variant='secondary'
              icon='discount-check'
            />
          </form>
        )}

        <form action={handleDeleteItemItem}>
          <SubmitButton
            text='Delete item'
            type='submit'
            variant='tertiary'
            icon='trash'
          />
        </form>
      </div>
    </div>
  );
}
