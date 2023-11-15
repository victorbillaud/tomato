import { Text } from '@/components/common/text';

export default async function Dashboard() {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center'>
      <div className='flex w-full flex-row items-center justify-center gap-1'>
        <Text variant='body' className='opacity-40'>
          If you want to add a new item, click on the
        </Text>
        <Text variant='body' className='opacity-90'>
          add item
        </Text>
        <Text variant='body' className='opacity-40'>
          button.
        </Text>
      </div>
    </div>
  );
}
