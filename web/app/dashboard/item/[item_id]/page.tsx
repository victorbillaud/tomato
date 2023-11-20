import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';
import { ItemScanHistory } from '@/components/item';
import { createClient } from '@/utils/supabase/server';
import { getItem } from '@utils/lib/item/services';
import dateFormat, { masks } from 'dateformat';
import { cookies } from 'next/headers';

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
    <div className='flex w-full flex-col items-center justify-start gap-5 p-2'>
      <div className='flex w-full flex-col items-center justify-start gap-3'>
        <div className={`flex w-full flex-row items-center justify-start`}>
          <Text variant='h3' weight={600}>
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
        {item.lost ? (
          <div className='-mb-2 flex w-full flex-row items-center justify-center gap-1 rounded-md bg-primary-600/80 p-2'>
            <Text
              variant='caption'
              weight={400}
              color='text-white/90'
              className='text-center'
            >
              Item lost
            </Text>
            <Icon name='alert' size={24} color='text-white/90' stroke={2} />
          </div>
        ) : !item.activated ? (
          <div className='-mb-2 flex w-full flex-row items-center justify-center gap-1 rounded-md bg-orange-500/80 p-2'>
            <Text
              variant='caption'
              weight={400}
              color='text-white/90'
              className='text-center'
            >
              Not activated
            </Text>
            <Icon
              name='discount-check-outline'
              size={24}
              color='text-white/90'
              stroke={2}
            />
          </div>
        ) : null}
      </div>
      {item.qrcode_id ? (
        <ItemScanHistory item={item} />
      ) : (
        <Text variant='caption' className='opacity-50'>
          No scan history
        </Text>
      )}
    </div>
  );
}
