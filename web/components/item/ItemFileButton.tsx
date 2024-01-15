'use client';
import { forwardRef, useRef } from 'react';
import { Button } from '../common/button';
// @ts-ignore
import { useFormStatus } from 'react-dom';

const ItemFileButtonContent = ({ ...props }) => {
  const { pending } = useFormStatus();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  return (
    <>
      <label htmlFor='picture' ref={labelRef}>
        <Button
          text='Add Image'
          type='button'
          variant='secondary'
          size='small'
          isLoader={pending}
          disabled={pending}
          onClick={() => labelRef.current?.click()}
          {...props}
        />
      </label>
      <input
        type='file'
        name='picture'
        id='picture'
        onChange={() => buttonRef.current?.click()}
        accept='image/jpeg,image/png,image/webp'
        className='hidden'
      />
      <button type='submit' className='hidden' ref={buttonRef} />
    </>
  );
};

interface ItemFileButtonProps {
  callback: ((formData: FormData) => void) | string;
}

const ItemFileButton = ({ callback, ...props }: ItemFileButtonProps) => {
  return (
    <form action={callback}>
      <ItemFileButtonContent {...props} />
    </form>
  );
};

ItemFileButton.displayName = 'ItemFileButton';

export default ItemFileButton;
