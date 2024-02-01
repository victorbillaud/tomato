import { InputTextForm } from '../common/input';
import { Text } from '../common/text';
import { handleUpdate } from './ItemInfo';
import { IItemScanViewOptionsProps } from './types';

export function ItemScanViewOptions({ item }: IItemScanViewOptionsProps) {
  return (
    <div
      className={`flex w-full flex-row-reverse items-start gap-1 md:flex-col md:justify-start`}
    >
      <Text variant='subtitle'>Customize the scan page</Text>
      <div className='items-top flex w-full flex-col justify-between gap-3 py-1'>
        <div className='flex w-full flex-col items-start justify-center gap-1'>
          <Text
            variant='overline'
            className='text-center capitalize opacity-40'
          >
            Scan Headline
          </Text>

          <InputTextForm
            defaultValue={item.scan_headline || ''}
            callback={handleUpdate}
            width='w-full'
            hiddenValues={{
              item_id: item.id,
              value_to_change: 'scan_headline',
            }}
            defaultComponent={
              item.scan_headline ? (
                <Text
                  variant='body'
                  weight={400}
                  className='text-start opacity-90'
                >
                  {item.scan_headline}
                </Text>
              ) : (
                <Text
                  variant='body'
                  weight={400}
                  className='text-start opacity-60'
                >
                  Write a custom headline for your scan page
                </Text>
              )
            }
            className='w-full'
          />
        </div>
        <div className='flex w-full flex-col items-start justify-center gap-1'>
          <Text
            variant='overline'
            className='text-center capitalize opacity-40'
          >
            Scan Description
          </Text>

          <InputTextForm
            defaultValue={item.scan_description || ''}
            callback={handleUpdate}
            width='w-full'
            hiddenValues={{
              item_id: item.id,
              value_to_change: 'scan_description',
            }}
            defaultComponent={
              item.scan_description ? (
                <Text
                  variant='body'
                  weight={400}
                  className='text-start opacity-90'
                >
                  {item.scan_description}
                </Text>
              ) : (
                <Text
                  variant='body'
                  weight={400}
                  className='text-start opacity-60'
                >
                  Write a custom description for your scan page
                </Text>
              )
            }
            className='w-full'
          />
        </div>
      </div>
    </div>
  );
}
