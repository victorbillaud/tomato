'use client';

import useToggle from '@/components/hooks/useToggle';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { IInputTextProps, InputText } from './InputText';

interface IInputTextFormProps extends IInputTextProps {
  defaultComponent: React.ReactNode;
  defaultValue?: string;
  hiddenValues?: Record<string, string>;
  callback?: ((formData: FormData) => void) | string;
}

export function InputTextForm({
  callback,
  defaultComponent,
  defaultValue,
  ...props
}: IInputTextFormProps) {
  const [isEditing, setIsEditing, setIsEdited] = useToggle(false);
  const [value, setValue] = useState(defaultValue || '');

  // bind echap to cancel

  useEffect(() => {
    const handleEsc = (event: { keyCode: number }) => {
      if (event.keyCode === 27) {
        setIsEdited();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [setIsEdited]);

  return (
    <div className='group flex w-full flex-row items-center justify-start gap-1'>
      {isEditing ? (
        <form className='w-full' action={callback} onSubmit={setIsEdited}>
          <InputText
            {...props}
            name='value'
            defaultValue={defaultValue}
            onChange={(e) => setValue(e.target.value)}
          />
          {props.hiddenValues &&
            Object.entries(props.hiddenValues).map(([key, value]) => (
              <input key={key} type='hidden' name={key} value={value} />
            ))}
          <Button
            text='Save'
            type='submit'
            variant='tertiary'
            className='hidden'
          />
        </form>
      ) : (
        defaultComponent
      )}

      <button
        className={classNames(
          'opacity-0 transition-all duration-200 group-hover:opacity-60',
          isEditing ? 'hidden' : 'flex'
        )}
        onClick={isEditing ? setIsEdited : setIsEditing}
      >
        {isEditing ? (
          <Icon name='pencil-off' size={18} color='dark:text-white' />
        ) : (
          <Icon name='pencil' size={18} color='dark:text-white' />
        )}
      </button>
    </div>
  );
}
