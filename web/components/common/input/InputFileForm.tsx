'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { Icon, IconNames } from '../icon';
import { CustomImage } from '../image';
// @ts-ignore
import { useFormStatus } from 'react-dom';
import Compressor from 'compressorjs';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pending && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [pending]);

  if (!iconName) {
    iconName = 'photo-edit';
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) || null;

    if (file) {
      new Compressor(file, {
        quality: 0.6,
        convertSize: 700000,

        success(result) {
          const list = new DataTransfer();
          list.items.add(new File([result], file.name, { type: file.type }) as any);
          e.target.files = list.files;
          buttonRef.current?.click();
        },
        error(err) {
          console.log('Cannot upload the image:', err.message);
        },
      });
    }
  };

  return (
    <>
      <input
        type='file'
        name='picture'
        onChange={handleImageChange}
        accept='image/jpeg,image/png,image/webp'
        className='absolute z-20 h-full w-full cursor-pointer bg-transparent opacity-0'
        disabled={pending}
        ref={fileInputRef}
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
        <>
          <Icon
            name={iconName}
            size={30}
            className='absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 group-hover:block'
            color='text-stone-900 dark:text-white'
          />
          <button className='absolute right-0 top-0 z-30 hidden p-1 group-hover:block'>
            <Icon
              name='x'
              size={26}
              className='hover:text-primary-600'
              color='text-stone-900 dark:text-white'
            />
          </button>
        </>
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
      <form className='group relative mt-2 w-fit h-fit' action={callback}>
        <InputFileFormContent {...props} ref={ref} />
      </form>
    );
  }
);

InputFileForm.displayName = 'InputFileForm';
