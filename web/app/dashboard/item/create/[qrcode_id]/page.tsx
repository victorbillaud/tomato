import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';

export default async function CreateItem({
  params,
}: {
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-start justify-center gap-10'>
      <Text variant='h1'>Welcome to the Item Creation page!</Text>
      <Text variant='h3' weight={300} className='opacity-70'>
        Here, you can choose how to create your new item. Select one of the
        methods below to get started.
      </Text>
      <div className='flex flex-col items-center justify-center divide-y-2 divide-gray-200/20'>
        <div className='flex flex-col items-center justify-center gap-5 px-5'>
          <Text variant='h3'>Creation using the form</Text>
          <Text variant='body'>
            Use our online form to enter details about your item quickly and
            easily. Ideal for those who prefer typing and have all the
            information ready.
          </Text>
          <StyledLink
            text='Create with your mobile'
            variant='tertiary'
            href={`/dashboard/item/create/${params.qrcode_id}/form`}
          />
        </div>
        <div className='flex flex-col items-center justify-center gap-5 px-5'>
          <Text variant='h3'>Creation using your mobile</Text>
          <Text variant='body'>
            Prefer using your phone? Simply scan the QR code and complete the
            item creation process on your mobile device. Perfect for on-the-go
            creation.
          </Text>
          <StyledLink
            text=' Create item from QR Code'
            variant='tertiary'
            href={`/dashboard/item/create/${params.qrcode_id}/qrcode`}
          />
        </div>
      </div>
    </div>
  );
}
