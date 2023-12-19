'use client';

import { useState } from 'react';
import { Text } from '../text';

interface ISwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onValueChange?: (checked: boolean) => void;
}

export function Switch({
  checked: initialValue,
  disabled,
  onValueChange,
  ...props
}: ISwitchProps) {
  const [checked, setChecked] = useState(initialValue ?? false);
  //   input value can't take a boolean, so we use a string

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setChecked(checked);
    onValueChange?.(checked);
  };

  return (
    <label className='relative inline-flex cursor-pointer items-center gap-2'>
      <input
        type='checkbox'
        onChange={handleChange}
        className='peer sr-only'
        checked={checked}
      />
      <div
        style={{
          outline: 'none',
        }}
        className="peer  h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-lime-700 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 "
      ></div>
      <Text variant='caption'>{props.label}</Text>
    </label>
  );
}
