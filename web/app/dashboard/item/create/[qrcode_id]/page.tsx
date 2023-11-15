// path web/app/dashboard/item/create/[qrcode_id]

import { Text } from '@/components/common/text';

export default function CreateItem({
  params,
}: {
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <Text variant='body'>{params.qrcode_id}</Text>
    </div>
  );
}
