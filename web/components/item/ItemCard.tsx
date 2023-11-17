import dateFormat, { masks } from 'dateformat';
import Link from 'next/link';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import { IItemCardProps } from './types';

export const ItemCard: React.FC<IItemCardProps> = ({ item }) => {
  return (
    <div
      key={item.id}
      className={`flex flex-col items-center justify-center divide-y divide-stone-300 rounded-lg border border-stone-300 bg-stone-100 shadow-sm dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-900`}
    >
      {item.lost ? (
        <div className='-mb-2 flex w-full animate-ping flex-row items-center justify-center gap-1 rounded-t-md bg-primary-600 p-2 pb-3'>
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
        <div className='-mb-2 flex w-full animate-ping flex-row items-center justify-center gap-1 rounded-t-md bg-orange-500/80 p-2 pb-3'>
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
      <div
        className={`flex w-full flex-row items-center justify-between ${
          item.lost || !item.activated ? 'rounded-t-lg' : 'rounded-t-lg'
        } bg-stone-200/70 p-2 py-3 backdrop-blur-md dark:bg-stone-800/90`}
      >
        <Text variant='body' weight={600}>
          {item.name}
        </Text>
      </div>

      <div className='flex h-full w-full flex-col items-center justify-start p-2 pb-0'>
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
              {dateFormat(item.created_at, masks.longDate)}
            </Text>
          </div>
        </div>
        <div className='mt-auto flex w-full flex-row items-center justify-center py-1 pt-3'>
          <Link href={`/dashboard/item/${item.id}`}>
            <Text
              variant='caption'
              className='text-center capitalize opacity-40'
            >
              See details
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};
