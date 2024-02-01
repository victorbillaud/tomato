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
    <div className='flex w-full flex-col items-start justify-between gap-5'>
      <div className='flex w-full flex-col items-center justify-start gap-1'>
        {!item?.name && !item?.scan_headline && !item?.scan_description && (
          <Text variant='subtitle' className='text-center opacity-90'>
            How it seems you found an item... let&apos;s start a conversation
            with the owner !
          </Text>
        )}

        {item?.scan_headline && (
          <Text variant='title' className='text-left opacity-90'>
            {item?.scan_headline}
          </Text>
        )}
        {item?.scan_description && (
          <Text variant='body' className='text-left opacity-80'>
            {item?.scan_description}
          </Text>
        )}
      </div>
      <div className='flex w-full flex-col items-center justify-center gap-1'>
        {item?.name && (
          <Text variant='title' className='text-left'>
            {item?.name}
          </Text>
        )}
        {item?.image_path && (
          <CustomImage
            alt='item'
            src={item?.image_path}
            shadow='md'
            rounded='md'
            height={200}
            width={200}
            cover={true}
          />
        )}
      </div>
      <div className='flex w-full flex-col items-center justify-end gap-2'>
        <CustomImage
          alt='item'
          src={
            item?.owner_avatar_url ??
            'https://nqhtfnmtcjxybsvxhqrh.supabase.co/storage/v1/object/sign/avatars/default_avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2RlZmF1bHRfYXZhdGFyLnBuZyIsImlhdCI6MTcwNTY3MzU0NCwiZXhwIjoxNzM3MjA5NTQ0fQ.rKZUN5KL56xJt3F0yr8AwOvW5NW-gNt8Kps5kWGSpNI&t=2024-01-19T14%3A12%3A24.180Z'
          }
          shadow='md'
          rounded='full'
          height={70}
          width={70}
          cover={true}
        />
        <div className='flex flex-col items-end justify-center gap-1'>
          {item?.owner_full_name && (
            <Text variant='title' className='text-left opacity-90'>
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
      </div>
    </div>
  );
}
