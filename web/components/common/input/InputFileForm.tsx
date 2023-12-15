'use client';

import { FormEvent, forwardRef, useRef } from 'react';
import { Icon, IconNames } from '../icon';
import { CustomImage } from '../image';
import { Button } from '../button';

interface InputFileFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  callback: ((formData: FormData) => void) | string;
  iconName?: IconNames;
  imgSource: string;
}

export const InputFileForm = forwardRef<HTMLInputElement, InputFileFormProps>(
  ({ callback, iconName, imgSource, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    if (!iconName) {
      iconName = 'modify';
    }

    return (
      <form className='group relative mt-2' action={callback}>
        <input
          type='file'
          name='picture'
          onChange={() => buttonRef.current?.click()}
          accept='image/jpeg,image/png,image/webp'
          className='absolute z-20 h-full w-full cursor-pointer bg-transparent opacity-0'
          ref={ref}
          {...props}
        />
        <button type='submit' className='hidden' ref={buttonRef} />
        <Icon
          name={iconName}
          size={30}
          className='absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 group-hover:block'
          color='text-stone-900 dark:text-white'
        />
        <CustomImage
          alt='item'
          className='group-hover:opacity-70'
          src={imgSource}
          shadow='md'
          rounded='md'
          height={150}
          width={150}
          cover={true}
        />
      </form>
    );
  }
);

InputFileForm.displayName = 'InputFileForm';
