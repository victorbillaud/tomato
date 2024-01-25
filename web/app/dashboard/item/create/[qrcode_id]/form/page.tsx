import { SubmitButton } from '@/components/common/button/SubmitButton';
import { InputText } from '@/components/common/input/InputText';
import { Text } from '@/components/common/text';
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

  redirect(`/dashboard/item/${insertedItem.id}`);
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
      <div className='flex w-full flex-col items-start justify-start gap-5 text-left'>
        <Text variant='h1' weight={400} className='opacity-90'>
          <strong className='text-primary-600'>1.</strong> Choose a QR Code to
          link to your new item
        </Text>
        <Text variant='h4' weight={300} className='opacity-70'>
          To facilitate the identification of your different items, Tomato
          automatically generates a name for each QR Code. You can select one of
          the names below for your new item.
        </Text>
      </div>
      <NameSelector
        values={qrCodes.map((code) => ({
          name: code.name,
          id: code.id.toString(),
        }))}
        initialValue={qrCode.id}
        redirectPath='/form'
      />
      <form action={insertActionItemBinded} className='w-full'>
        <div className='flex w-full flex-col items-center justify-center gap-4'>
          <div className='flex w-full flex-col items-start justify-start gap-5 text-left'>
            <Text variant='h1' weight={400} className='opacity-90'>
              <strong className='text-primary-600'>2.</strong> Choose a name for
              your item
            </Text>
            <Text variant='h4' weight={300} className='opacity-70'>
              The name of your item will be used to identify it in the future.
              You should choose a name that is easy to remember and that allows
              you to quickly identify the item.
            </Text>
          </div>
          <InputText
            name='name'
            icon='chevron-right'
            placeholder='Your item name'
            className='border-0 shadow-none'
            required
          />

          <div className='flex w-full flex-col items-start justify-start gap-5 text-left'>
            <Text variant='h4' weight={300} className='opacity-70'>
              To help you identify your item, you can add a description. The
              name and description can be changed later.
            </Text>
          </div>
          <InputText
            name='description'
            icon='chevron-right'
            placeholder='Your item description'
            className='border-0 shadow-none'
            required
          />

          <SubmitButton
            text='Create item'
            variant='primary'
            color='green'
            type='submit'
            className='w-full'
          />
          <Text
            variant='none'
            className='w-full rounded-md border border-stone-300 bg-stone-200/60 px-3 py-2 text-center text-xs opacity-50 shadow-sm dark:border-stone-700 dark:bg-stone-900'
          >
            Using this process to create an item will automatically set the item
            as deactivated to prevent any misuse. You can activate it later by
            scanning the QR Code with your phone.
          </Text>
        </div>
      </form>
    </div>
  );
}
