import { StyledLink } from '@/components/common/link';

export default async function CreateItem({
  params,
}: {
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-10'>
      <div className='flex flex-row items-center justify-center gap-5'>
        <StyledLink
          text=' Create item from QR Code'
          variant='secondary'
          href={`/dashboard/item/create/${params.qrcode_id}/qrcode`}
        />

        <StyledLink
          text='Create item from form'
          variant='secondary'
          href={`/dashboard/item/create/${params.qrcode_id}/form`}
        />
      </div>
    </div>
  );
}
