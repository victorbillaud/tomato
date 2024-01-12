'use client';

import { forwardRef, useRef } from 'react';
import { Icon, IconNames } from '../icon';
import { CustomImage } from '../image';
// @ts-ignore
import { useFormStatus } from 'react-dom';

interface InputFileFormProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  callback: ((formData: FormData) => void) | string;
  iconName?: IconNames;
  imgSource: string;
}

interface InputFileFormContentProps
  extends Omit<InputFileFormProps, 'callback'> {}

const InputFileFormContent = forwardRef<
  HTMLInputElement,
  InputFileFormContentProps
>(({ iconName, imgSource, ...props }, ref) => {
  const { pending } = useFormStatus();
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!iconName) {
    iconName = 'photo-edit';
  }

  return (
    <>
      <input
        type='file'
        name='picture'
        onChange={() => buttonRef.current?.click()}
        accept='image/jpeg,image/png,image/webp'
        className='absolute z-20 h-full w-full cursor-pointer bg-transparent opacity-0'
        disabled={pending}
        ref={ref}
        {...props}
      />
      <button type='submit' className='hidden' ref={buttonRef} />
      {pending ? (
        <div className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'>
          <div className='animate-spin'>
            <Icon
              name='loader'
              size={40}
              color='text-stone-900 dark:text-white'
            />
          </div>
        </div>
      ) : (
        <Icon
          name={iconName}
          size={30}
          className='absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 group-hover:block'
          color='text-stone-900 dark:text-white'
        />
      )}
      <CustomImage
        alt='item'
        className={`${pending ? 'opacity-70' : 'group-hover:opacity-70'}`}
        src={imgSource}
        shadow='md'
        rounded='md'
        height={150}
        width={150}
        cover={true}
      />
    </>
  );
});

InputFileFormContent.displayName = 'InputFileFormContent';

export const InputFileForm = forwardRef<HTMLInputElement, InputFileFormProps>(
  ({ callback, ...props }, ref) => {
    return (
      <form className='group relative mt-2' action={callback}>
        <InputFileFormContent {...props} ref={ref} />
      </form>
    );
  }
);

InputFileForm.displayName = 'InputFileForm';
