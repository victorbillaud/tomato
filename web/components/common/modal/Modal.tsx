import * as Dialog from '@/components/radix/Dialog';
import { Button } from '../button';
import { Text } from '../text';

interface ModalProps {
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export const Modal = ({
  trigger,
  title,
  description,
  children,
}: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button text='Open Modal' variant='primary' icon={'check'} iconOnly />
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 bg-stone-200/50 transition-colors dark:bg-stone-700/50' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none md:max-w-[60%]'>
          {title && (
            <Dialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
              <Text variant='title' weight={600}>
                {title}
              </Text>
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className='text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal'>
              <Text variant='body' weight={300}>
                {description}
              </Text>
            </Dialog.Description>
          )}
          {children}
          <Dialog.Close asChild>
            <Button
              text='Cancel'
              variant='tertiary'
              icon='x'
              iconOnly
              className='absolute right-0 top-0 mr-3 mt-3'
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
