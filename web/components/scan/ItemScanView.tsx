import { getPublicScanItemView } from '@utils/lib/item/services';
import { Icon } from '../common/icon';
import { CustomImage } from '../common/image';
import { Text } from '../common/text';

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

interface IItemScanViewProps {
  item: ArrayElementType<
    Awaited<ReturnType<typeof getPublicScanItemView>>['data']
  >;
}

export async function ItemScanView({ item }: IItemScanViewProps) {
  return (
    <div className='flex w-full flex-col items-center justify-between gap-5 rounded-md border border-stone-300 p-4 dark:border-stone-700 md:flex-row'>
      <div className='flex w-full flex-col items-start justify-start gap-1'>
        {!item?.name && !item?.scan_headline && !item?.scan_description && (
          <Text variant='subtitle' className='text-left opacity-80'>
            User did not provide any information about this item, start a\
            conversation to know more about it.
          </Text>
        )}
        {item?.name && (
          <Text variant='title' className='text-left'>
            {item?.name}
          </Text>
        )}
        {item?.scan_headline && (
          <Text variant='subtitle' className='text-left opacity-90'>
            {item?.scan_headline}
          </Text>
        )}
        {item?.scan_description && (
          <Text variant='body' className='text-left opacity-80'>
            {item?.scan_description}
          </Text>
        )}
      </div>

      <div className='flex w-full flex-row-reverse items-center justify-end gap-2 md:flex-row'>
        <div className='flex flex-col items-end justify-center gap-1'>
          {item?.owner_full_name && (
            <Text variant='subtitle' className='text-left opacity-90'>
              {item?.owner_full_name}
            </Text>
          )}
          {item?.owner_phone && (
            <div className='flex flex-row items-center justify-start gap-1'>
              <Icon
                name='phone'
                size={20}
                color='text-stone-900 dark:text-white'
              />
              <Text variant='body' className='text-left opacity-80'>
                {item?.owner_phone}
              </Text>
            </div>
          )}
        </div>
        {item?.owner_avatar_url ? (
          <CustomImage
            alt='item'
            src={item?.owner_avatar_url}
            shadow='md'
            rounded='full'
            height={70}
            width={70}
            cover={true}
          />
        ) : (
          <div className='h-20 w-20 rounded-full bg-stone-300 dark:bg-stone-700'></div>
        )}
      </div>
    </div>
  );
}
