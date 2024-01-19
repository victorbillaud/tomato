'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { getItem } from '@utils/lib/item/services';
import { useState } from 'react';
import { Button, SubmitButton } from '../common/button';
import { Text } from '../common/text';
import { handleDeleteItem } from './actions';

interface IDeleteItemAlertProps {
  item: NonNullable<Awaited<ReturnType<typeof getItem>>['data']>;
}

const DeleteItemAlert = (props: IDeleteItemAlertProps) => {
  const handleDeleteItemBind = handleDeleteItem.bind(null, props.item.id);
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <Button text='Delete item' variant='tertiary' icon='trash' />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 bg-stone-200/30 transition-colors dark:bg-stone-700/30' />
        <AlertDialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-stone-300 bg-zinc-100/80 p-5 backdrop-blur-lg dark:border-stone-700 dark:bg-zinc-900/70'>
          <AlertDialog.Title className='m-0'>
            <Text variant='h3' weight={600}>
              Are you absolutely sure?
            </Text>
          </AlertDialog.Title>
          <AlertDialog.Description className='mb-5 mt-4 text-[15px] leading-normal'>
            <Text variant='body' weight={300}>
              Your item{' '}
              <strong className='text-primary-600'>{props.item.name}</strong>{' '}
              will be permanently deleted. This action cannot be undone.
            </Text>
          </AlertDialog.Description>
          <div className='flex justify-end gap-3'>
            <AlertDialog.Cancel asChild>
              <Button text='Cancel' variant='tertiary' />
            </AlertDialog.Cancel>
            <form action={handleDeleteItemBind}>
              <SubmitButton
                text='Delete item'
                type='submit'
                variant='primary'
                icon='trash'
              />
            </form>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteItemAlert;
