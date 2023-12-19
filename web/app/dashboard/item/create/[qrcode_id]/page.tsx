import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import Link from 'next/link';

export default async function CreateItem({
  params,
}: {
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-start justify-start gap-10 pt-10 md:pt-20'>
      <Text variant='h1' weight={500}>
        Let's create your new <strong className='text-primary-600'>item</strong>{' '}
        together !
      </Text>
      <Text variant='h3' weight={300} className='opacity-70'>
        Here, you can choose how to create your new item. Select one of the
        methods below to get started.
      </Text>
      <div className='relative flex w-full flex-col items-center justify-center gap-10 pt-10'>
        <div className='flex w-full text-center flex-col items-center justify-center gap-5 px-5 md:w-2/3'>
          <Text variant='h1'>Creation using your mobile</Text>
          <Text variant='h3' weight={300} className='text-center opacity-80'>
            Prefer using your phone? Simply scan the QR code and complete the
            item creation process on your mobile device. Tomato{' '}
            <strong>recommends</strong> this method.
          </Text>

          <Link
            className='text-primary-600 text-s'
            href={`/dashboard/item/create/${params.qrcode_id}/qrcode`}
          >
            Continue on your mobile
          </Link>
        </div>
        <div className='flex w-full flex-col items-center justify-center gap-5 px-5'>
          <div className='h-1 w-1/2 rounded-md bg-stone-300 opacity-30 dark:bg-stone-700 md:w-1/2' />
        </div>

        <div className='flex w-full flex-col items-center justify-center gap-4 px-5 opacity-80 md:w-2/3'>
          <Text variant='h4'>Creation using the form</Text>
          <Text variant='caption' weight={300} className='text-center'>
            Use our online form to enter details about your item quickly and
            easily. Ideal for those who prefer typing and have all the
            information ready.
          </Text>
          <Text
            variant='none'
            className='rounded-md border border-stone-300 bg-stone-200/60 px-3 py-2 text-center text-xs opacity-50 shadow-sm dark:border-stone-700 dark:bg-stone-900'
          >
            When you select to create a new item from here, the created item
            will be automatically set as deactivated.
          </Text>
          <StyledLink
            text='Use the form to create'
            variant='tertiary'
            href={`/dashboard/item/create/${params.qrcode_id}/form`}
          />
        </div>
      </div>
    </div>
  );
}
