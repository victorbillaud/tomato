import { SubmitButton } from '@/components/common/button/SubmitButton';
import { Card } from '@/components/common/card';
import { InputText } from '@/components/common/input/InputText';
import { Text } from '@/components/common/text';
import NameSelector from '@/components/qrcode/NameSelector';
import { QrCode } from '@/components/qrcode/QrCode';
import { createClient } from '@/utils/supabase/server';
import { insertItem } from '@utils/lib/item/services';
import { listQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const insertItemAction = async (formData: FormData) => {
  'use server';

  const itemToInsert = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    qrcode_id: formData.get('qrcode_id') as string,
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

export default async function CreateItem({
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

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-10'>
      <div className='flex flex-col items-center justify-center py-5'>
        <Text variant='body' className='text-center opacity-50'>
          This is now the time to create your item, you have 2 possibilities:
        </Text>
      </div>

      <div className='flex w-full flex-col-reverse items-center justify-between gap-10 md:flex-row'>
        <div className='flex w-full flex-col items-center justify-center gap-10'>
          <NameSelector
            values={qrCodes.map((code) => ({
              name: code.name,
              id: code.id.toString(),
            }))}
            selectedValue={qrCode.id}
          />
          {qrCode.barcode_data && <QrCode url={qrCode.barcode_data} />}
          <Text variant='body' className='text-center opacity-50'>
            Scan this QR Code with your phone and follow the instructions
          </Text>
        </div>

        <div className='h-1 w-2/4 rounded-md bg-stone-300 dark:bg-stone-700 md:h-2/4 md:w-1' />

        <div className='flex w-full flex-col items-center justify-center gap-5'>
          <form action={insertItemAction} className='w-full'>
            <div className='flex w-full flex-col items-center justify-center gap-2'>
              <input type='hidden' name='qrcode_id' value={qrCode.id} />
              <InputText
                labelText='Item name'
                name='name'
                placeholder='Phone'
                className='w-full md:w-2/4'
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
      </div>

      <div className='flex w-full flex-col items-center justify-center gap-5'>
        <Card className='px-5 py-3'>
          <Text variant='caption' className='text-center opacity-50'>
            When you select to create a new item from here without scanning the
            QR Code, your item will be deactivated and you will have to scan the
            QR Code to activate it.
          </Text>
        </Card>
      </div>
    </div>
  );
}
