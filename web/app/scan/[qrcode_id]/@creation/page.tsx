import { SubmitButton } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { insertItem } from '@utils/lib/item/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const insertItemAction = async (formData: FormData) => {
  'use server';

  const itemToInsert = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    qrcode_id: formData.get('qrcode_id') as string,
    activated: true,
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

  redirect(`/dashboard/item/${insertedItem.id}`);
};

export default async function Scan({
  params,
}: {
  params: { qrcode_id: string };
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-20'>
      <Text variant='body' className='text-center opacity-50'>
        Well done ! You have successfully scanned the QR Code, this is now the
        time to <strong>create your item</strong>.
      </Text>

      <form className='w-full' action={insertItemAction}>
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <input type='hidden' name='qrcode_id' value={params.qrcode_id} />
          <InputText labelText='Item name' name='name' placeholder='Phone' />
          <InputText
            labelText='Item description'
            name='description'
            placeholder='My phone'
          />
          <SubmitButton
            text='Create item'
            variant='secondary'
            color='green'
            type='submit'
            className='my-5 w-full'
          />
        </div>
      </form>
    </div>
  );
}
