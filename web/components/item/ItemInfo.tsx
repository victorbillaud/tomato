import dateFormat, { masks } from 'dateformat';
import { InputTextForm } from '../common/input';
import { InputFileForm } from '../common/input/InputFileForm';
import { Text } from '../common/text';
import ItemFileButton from './ItemFileButton';
import { handleImageUpdate, handleUpdate } from './actions';
import { IItemInfoProps } from './types';

export function ItemInfo({ item }: IItemInfoProps) {
  const handleImageUpdateBind = handleImageUpdate.bind(
    null,
    item.id,
    item.image_path?.split('/').pop() || '',
    item.user_id
  );

  return (
    <div
      className={`flex w-full flex-row-reverse gap-6 md:flex-row md:justify-start ${
        item.image_path ? 'justify-between' : 'justify-end'
      }`}
    >
      {item.image_path && (
        <InputFileForm
          imgSource={item.image_path}
          iconName='photo-edit'
          callback={handleImageUpdateBind}
        />
      )}
      <div className='flex w-2/3 flex-col items-center justify-start gap-3'>
        <div className='flex w-full flex-row items-center justify-start'>
          <InputTextForm
            defaultValue={item.name}
            callback={handleUpdate}
            hiddenValues={{
              item_id: item.id,
              value_to_change: 'name',
            }}
            defaultComponent={
              <Text
                variant='h3'
                className='first-letter:capitalize'
                weight={600}
              >
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
                  variant='body'
                  weight={400}
                  className='text-start opacity-90'
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
            <Text variant='body' weight={400} className='text-start opacity-90'>
              {dateFormat(item.created_at, masks.default)}
            </Text>
          </div>
        </div>
        {item.image_path === null && (
          <div className='flex w-full'>
            <ItemFileButton callback={handleImageUpdateBind} />
          </div>
        )}
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
    </div>
  );
}
