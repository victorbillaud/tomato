import { SubmitButton } from '@/components/common/button/SubmitButton';
import { InputText } from '@/components/common/input/InputText';
import NameSelector from '@/components/qrcode/NameSelector';
import { createClient } from '@/utils/supabase/server';
import { insertItem } from '@utils/lib/item/services';
import { listQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const insertItemAction = async (qrCodeId: string, formData: FormData) => {
  'use server';

  const itemToInsert = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    qrcode_id: qrCodeId,
  };

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { insertedItem, error } = await insertItem(supabase, itemToInsert);

  if (error) {
    throw new Error(error.message);
  }

  if (!insertedItem) {
    throw new Error('Item not inserted');
  }

  redirect(`/dashboard`);
};

export default async function CreateItemForm({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: qrCodes, error } = await listQRCode(supabase);

  if (error || !qrCodes) {
    throw new Error("You don't have any QR Code");
  }

  const qrCode = qrCodes.find((code) => code.id === params.qrcode_id);
  if (!qrCode) {
    throw new Error('This QR Code does not exist');
  }
  if (qrCode.item_id != null) {
    throw new Error('This QR Code is already linked to an item');
  }

  const insertActionItemBinded = insertItemAction.bind(null, params.qrcode_id);

  return (
    <div className='flex w-full flex-col items-center justify-center gap-5'>
      <NameSelector
        values={qrCodes.map((code) => ({
          name: code.name,
          id: code.id.toString(),
        }))}
        initialValue={qrCode.id}
        redirectPath='/form'
      />
      <form action={insertActionItemBinded} className='w-full'>
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <InputText
            labelText='Item name'
            name='name'
            placeholder='Phone'
            required
          />
          <InputText
            labelText='Item description'
            name='description'
            placeholder='My phone'
            required
          />
          <SubmitButton
            text='Create item'
            variant='primary'
            color='green'
            type='submit'
            className='my-5 w-full'
          />
        </div>
      </form>
    </div>
  );
}
