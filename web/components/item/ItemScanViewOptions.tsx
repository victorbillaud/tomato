import { createClient } from '@/utils/supabase/server';
import { getPublicScanItemView } from '@utils/lib/item/services';
import { cookies } from 'next/headers';
import { Button } from '../common/button';
import { InputTextForm } from '../common/input';
import { Modal } from '../common/modal';
import { Text } from '../common/text';
import { ItemScanView } from '../scan/ItemScanView';
import { handleUpdate } from './actions';
import { IItemScanViewOptionsProps } from './types';

export const ItemScanViewOptions = async ({
  item,
}: IItemScanViewOptionsProps) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: previewItem } = await getPublicScanItemView(supabase, item.id);

  if (!previewItem) {
    return null;
  }

  return (
    <div className={`flex w-full flex-col items-start gap-1`}>
      <div className='flex w-full flex-row items-center justify-between gap-1'>
        <Text variant='subtitle'>Customize the scan page</Text>
        <Modal
          maxWidth='md:max-w-[20%]'
          trigger={
            <Button
              size='small'
              text='Show preview'
              variant='primary'
              icon={'circle-plus'}
            />
          }
        >
          <div className='p-5'>
            <ItemScanView item={previewItem[0]} />
          </div>
        </Modal>
      </div>
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
};
