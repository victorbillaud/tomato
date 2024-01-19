'use client';
import { useRef } from 'react';
import { Button } from '../common/button';
// @ts-ignore
import { useFormStatus } from 'react-dom';
import Compressor from 'compressorjs';

const ItemFileButtonContent = ({ ...props }) => {
  const { pending } = useFormStatus();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) || null;

    if (file) {
      new Compressor(file, {
        quality: 0.6,
        convertSize: 700000,

        success(result) {
          const list = new DataTransfer();
          list.items.add(
            new File([result], file.name, { type: file.type }) as any
          );
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
        onChange={handleImageChange}
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
