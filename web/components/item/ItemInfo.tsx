import { createClient } from '@/utils/supabase/server';
import { updateItem } from '@utils/lib/item/services';
import { Database } from '@utils/lib/supabase/supabase_types';
import dateFormat, { masks } from 'dateformat';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InputTextForm } from '../common/input';
import { Text } from '../common/text';

async function handleUpdate(formData: FormData) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const itemId = formData.get('item_id') as string;
  const valueToChange = formData.get('value_to_change') as string;
  const value = formData.get('value') as string;

  const { data: item, error } = await updateItem(supabase, itemId, {
    [valueToChange]: value,
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

interface IItemInfoProps {
  item: Database['public']['Tables']['item']['Row'];
}

export function ItemInfo({ item }: IItemInfoProps) {
  return (
    <div className='flex w-full flex-col items-center justify-start gap-3'>
      <div className={`flex w-full flex-row items-center justify-start`}>
        <InputTextForm
          defaultValue={item.name}
          callback={handleUpdate}
          hiddenValues={{
            item_id: item.id,
            value_to_change: 'name',
          }}
          defaultComponent={
            <Text variant='h3' className='first-letter:capitalize' weight={600}>
              {item.name}
            </Text>
          }
          className='w-full'
        />
      </div>
      <div className='items-top flex w-full flex-row justify-between py-1'>
        <div className='flex w-full flex-col items-start justify-center'>
          <Text
            variant='overline'
            className='text-center capitalize opacity-40'
          >
            Description
          </Text>

          <InputTextForm
            defaultValue={item.description || ''}
            callback={handleUpdate}
            hiddenValues={{
              item_id: item.id,
              value_to_change: 'description',
            }}
            defaultComponent={
              <Text
                variant='caption'
                weight={500}
                className='text-start opacity-70'
              >
                {item.description}
              </Text>
            }
            className='w-full'
          />
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
  );
}
