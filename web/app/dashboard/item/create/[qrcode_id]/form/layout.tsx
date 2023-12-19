import { StyledLink } from '@/components/common/link';

export default function CreateItemForm({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-5'>
      <div className='flex w-full flex-row items-center justify-start gap-5'>
        <StyledLink
          icon='arrow-left'
          text='Go back'
          variant='tertiary'
          href={`/dashboard/item/create/${params.qrcode_id}`}
        />
      </div>
      {children}
    </div>
  );
}
