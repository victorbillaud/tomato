import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';

export default function ItemNotLost({
  params,
}: {
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-1 px-3'>
      <Text variant='body' className='text-center opacity-60'>
        Well done ! You found an item ! Unfortunately...
      </Text>
      <Text
        variant='h2'
        className='text-center opacity-80'
        color=' text-red-700'
      >
        This item is not marked as lost
      </Text>

      <div className='my-5 flex w-full flex-col items-center justify-center gap-2'>
        <Text variant='body' className='text-center opacity-60'>
          If you think this item is lost, please let us know by contacting our
          support
        </Text>
      </div>

      <StyledLink
        variant='tertiary'
        text='Go back to the scan page'
        href={`/scan/${params.qrcode_id}`}
      />
    </div>
  );
}
