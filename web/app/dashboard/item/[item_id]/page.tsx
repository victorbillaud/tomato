import { Text } from '@/components/common/text';

export default async function ItemPage(props: { params: { item_id: string } }) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-20'>
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        <Text variant='h4' className='text-center opacity-90'>
          How it seems you found an item...
        </Text>
        <Text variant='body' className='text-center opacity-30'>
          This page is not yet implemented
        </Text>
      </div>
    </div>
  );
}
