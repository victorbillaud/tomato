import { SubmitButton } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { ItemScanHistory, ItemStateBanner } from '@/components/item';
import { QrCode } from '@/components/qrcode/QrCode';
import { createClient } from '@/utils/supabase/server';
import {
  declareItemAsFound,
  declareItemAsLost,
  getItem,
} from '@utils/lib/item/services';
import dateFormat, { masks } from 'dateformat';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function handleDeclareLost(formData: FormData) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const itemId = formData.get('item_id') as string;

  const { data: item, error } = await declareItemAsLost(supabase, itemId);

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

  const { data: item, error } = await declareItemAsFound(supabase, itemId);

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
        <div className='flex w-full flex-col items-center justify-center gap-1 md:flex-row'>
          <div className='flex w-full flex-col items-center justify-start gap-3'>
            <div className={`flex w-full flex-row items-center justify-start`}>
              <Text
                variant='h3'
                className='first-letter:capitalize'
                weight={600}
              >
                {item.name}
              </Text>
            </div>
            <div className='items-top flex w-full flex-row justify-between py-1'>
              <div className='flex flex-col items-start justify-center'>
                <Text
                  variant='overline'
                  className='text-center capitalize opacity-40'
                >
                  Description
                </Text>
                <Text
                  variant='caption'
                  weight={500}
                  className='text-start opacity-70'
                >
                  {item.description}
                </Text>
              </div>
            </div>
            <div className='items-top flex w-full flex-row justify-between py-1'>
              <div className='flex flex-col items-start justify-center'>
                <Text
                  variant='overline'
                  className='text-center capitalize opacity-40'
                >
                  created at
                </Text>
                <Text
                  variant='caption'
                  weight={500}
                  className='text-center opacity-70'
                >
                  {dateFormat(item.created_at, masks.default)}
                </Text>
              </div>
            </div>
            {item.lost_at && (
              <div className='items-top flex w-full flex-row justify-between py-1'>
                <div className='flex flex-col items-start justify-center'>
                  <Text
                    variant='overline'
                    className='text-center capitalize opacity-40'
                    color='text-red-500'
                  >
                    lost at
                  </Text>
                  <Text
                    variant='caption'
                    weight={500}
                    className='text-center opacity-70'
                    color='text-red-500'
                  >
                    {dateFormat(item.lost_at, masks.default)}
                  </Text>
                </div>
              </div>
            )}
          </div>
          {item.qrcode[0].barcode_data && (
            <QrCode url={item.qrcode[0].barcode_data} download />
          )}
        </div>

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
