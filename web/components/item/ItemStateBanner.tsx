import { Database } from '@utils/lib/supabase/supabase_types';
import { Icon } from '../common/icon';
import { Text } from '../common/text';

interface IItemStateManagerProps {
  item: Database['public']['Tables']['item']['Row'];
}

export async function ItemStateBanner(props: IItemStateManagerProps) {
  return (
    <div className='flex w-full flex-col items-center justify-start gap-3'>
      {props.item.lost ? (
        <ItemLostBanner />
      ) : !props.item.activated ? (
        <ItemNotActivatedBanner />
      ) : null}
    </div>
  );
}

function ItemLostBanner() {
  return (
    <div className='flex w-full flex-col items-center justify-center rounded-lg bg-red-500/20 shadow-sm'>
      <div className='flex w-full flex-row items-center justify-center gap-1 rounded-md bg-primary-600 p-2 shadow-md'>
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
      <div className='flex w-full flex-row items-center justify-center gap-1 p-2'>
        <Text
          variant='caption'
          weight={400}
          color='text-red-500/80'
          className='text-center'
        >
          This item has been declared as lost, once a user scans this item, you
          will be notified
        </Text>
      </div>
    </div>
  );
}

function ItemNotActivatedBanner() {
  return (
    <div className='flex w-full flex-col items-center justify-center rounded-lg bg-orange-500/20 shadow-sm'>
      <div className='flex w-full flex-row items-center justify-center gap-1 rounded-md bg-orange-500 p-2 shadow-md'>
        <Text
          variant='caption'
          weight={400}
          color='text-white/90'
          className='text-center'
        >
          Item not activated
        </Text>
        <Icon
          name='discount-check-outline'
          size={24}
          color='text-white/90'
          stroke={2}
        />
      </div>
      <div className='flex w-full flex-row items-center justify-center gap-1 p-2'>
        <Text
          variant='caption'
          weight={400}
          color='text-orange-500/80'
          className='text-center'
        >
          To activate this item, scan the QR code on the item with your phone
          and follow the instructions
        </Text>
      </div>
    </div>
  );
}
