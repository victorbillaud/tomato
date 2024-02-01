import { SubmitButton } from '@/components/common/button/SubmitButton';
import { InputText } from '@/components/common/input/InputText';
import { Text } from '@/components/common/text';
import NameSelector from '@/components/qrcode/NameSelector';
import { createClient } from '@/utils/supabase/server';
import { insertItem } from '@utils/lib/item/services';
import { listQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '../common/button';
import { Modal } from '../common/modal';

const insertItemAction = async (
  qrCodeId: string | null,
  formData: FormData
) => {
  'use server';

  if (!qrCodeId) {
    throw new Error('No QR Code ID');
  }

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

interface DashboardNavBarProps {
  qrcodeId: string | null;
}

export async function CreationModal({ qrcodeId }: DashboardNavBarProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: qrCodes, error } = await listQRCode(supabase);

  if (error || !qrCodes) {
    throw new Error("You don't have any QR Code");
  }

  const insertActionItemBinded = insertItemAction.bind(null, qrcodeId);

  const button = (
    <Button
      disabled={!qrcodeId}
      size='small'
      text={'Add item'}
      variant='primary'
      icon={'circle-plus'}
    />
  );

  if (!qrcodeId) {
    return button;
  }

  return (
    <Modal
      trigger={button}
      title='Create an item'
      description=' To facilitate the identification of your different items, Tomato
      automatically generates a name for each QR Code. You can select one
      of the names below for your new item.'
    >
      <div className='flex w-full flex-col items-center justify-center gap-5'>
        <form action={insertActionItemBinded} className='w-full'>
          <div className='flex w-full flex-col items-center justify-center gap-4'>
            <NameSelector
              values={qrCodes.map((code) => ({
                name: code.name,
                id: code.id.toString(),
              }))}
              initialValue={qrcodeId ?? qrCodes[0].id.toString()}
            />
            <InputText
              name='name'
              labelText='Item name'
              icon='chevron-right'
              placeholder='Your item name'
              required
            />
            <InputText
              labelText='Item description'
              name='description'
              icon='chevron-right'
              placeholder='Your item description'
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
              Using this process to create an item will automatically set the
              item as deactivated to prevent any misuse. You can activate it
              later by scanning the QR Code with your phone.
            </Text>
          </div>
        </form>
      </div>
    </Modal>
  );
}
