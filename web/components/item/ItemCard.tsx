import dateFormat, { masks } from 'dateformat';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import { IItemCardProps } from './types';

export const ItemCard: React.FC<IItemCardProps> = ({ item }) => {
  return (
    <div
      key={item.id}
      className='flex flex-col items-center justify-center divide-y divide-stone-300 rounded-md border border-stone-300 bg-stone-100 shadow-sm dark:border-stone-700 dark:bg-stone-900'
    >
      {/* Header */}
      <div className='flex w-full flex-row items-center justify-between p-2'>
        <Text variant='body' weight={600} className='text-center opacity-60'>
          {item.name}
        </Text>
        <div className='flex flex-row items-center justify-center gap-2'>
          {item.activated ? (
            <Icon
              name='discount-check'
              size={24}
              color='text-lime-500/50'
              stroke={2}
              className='rounded-md border-2 border-lime-500/20'
            />
          ) : (
            <>
              <Icon
                name='discount-check-outline'
                size={24}
                color='text-orange-500/50'
                stroke={2}
                className='rounded-md border-2 border-orange-500/20'
              />
            </>
          )}
        </div>
      </div>

      {/* Details */}
      <div className='flex w-full flex-col items-center justify-between p-2'>
        <div className='items-top flex w-full flex-row justify-between py-1'>
          <div className='flex flex-col items-start justify-center'>
            <Text variant='body' className='text-center opacity-40'>
              created at
            </Text>
            <Text
              variant='body'
              weight={500}
              className='text-center opacity-80'
            >
              {dateFormat(item.created_at, masks.longDate)}
            </Text>
          </div>
          <div>
            <Text variant='body' className='text-center opacity-40'>
              right
            </Text>
          </div>
        </div>
        <div className='flex w-full flex-row items-center justify-between py-3'>
          <div>
            <Text variant='body' className='text-center opacity-40'>
              left
            </Text>
          </div>
          <div>
            <Text variant='body' className='text-center opacity-40'>
              right
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

// {
// id: '2cbfbe7a-ba88-4441-96b2-e1bfacee8093',
// created_at: '2023-11-17T12:07:44.405467+00:00',
// name: 'Arthur la reines des putes',
// description: 'Thomas son esclave',
// activated: true,
// found: false,
// found_at: null,
// lost: false,
// lost_at: null,
// user_id: 'b0c6833a-e5b2-4eee-981b-b2e1573f169b',
// qrcode_id: 'b8265456-c8fa-4a81-b9f8-5f9faf1a54e2',
// qrcode: [
//     {
//     id: 'b8265456-c8fa-4a81-b9f8-5f9faf1a54e2',
//     created_at: '2023-11-17T12:07:14.847456+00:00',
//     barcode_data: 'http://localhost:3000/scan/b8265456-c8fa-4a81-b9f8-5f9faf1a54e2',
//     item_id: '2cbfbe7a-ba88-4441-96b2-e1bfacee8093',
//     user_id: 'b0c6833a-e5b2-4eee-981b-b2e1573f169b'
//     }
// ]
// }
