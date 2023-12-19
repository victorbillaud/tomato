'use client';
import * as Select from '@/components/radix/Select';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Icon } from '../common/icon';

interface NameSelectorProps {
  values: { name: string; id: string }[];
  initialValue: string;
  redirectPath?: string;
}

const NameSelector = ({
  values,
  initialValue,
  redirectPath,
}: NameSelectorProps) => {
  const router = useRouter();

  const changeQrCode = (newValue: string) => {
    router.push(
      `/dashboard/item/create/${newValue}${redirectPath ? redirectPath : ''}`
    );
  };

  return (
    <Select.Root onValueChange={changeQrCode} defaultValue={initialValue}>
      <Select.Trigger
        className='inline-flex h-[35px] w-44 items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] capitalize leading-none text-red-800 shadow-sm shadow-black/10 outline-none hover:opacity-80 focus:shadow-[0_0_0_2px] focus:shadow-black dark:bg-neutral-900 dark:text-red-600 dark:hover:opacity-90'
        aria-label='QrCodes'
      >
        <Select.Value />
        <Select.Icon>
          <Icon name='chevron-down' size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className='overflow-hidden rounded-md bg-white shadow-md dark:bg-neutral-900'>
          <Select.ScrollUpButton className='flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-neutral-900 dark:text-white'>
            <Icon name='chevron-up' size={16} />
          </Select.ScrollUpButton>
          <Select.Viewport className='p-[5px]'>
            <Select.Group>
              <Select.Label className='px-[25px] text-xs leading-[25px] text-slate-800 dark:text-slate-200'>
                Your QR codes
              </Select.Label>
              {values.map((value) => {
                return (
                  <SelectItem
                    key={value.id}
                    value={value.id}
                    className='capitalize'
                  >
                    {value.name}
                  </SelectItem>
                );
              })}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className='flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-neutral-900 dark:text-white'>
            <Icon name='chevron-down' size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

interface ISelectItemProps {
  className?: string;
  children?: React.ReactNode;
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, value, ...props }, ref) => {
    return (
      <Select.Item
        className={classNames(
          'relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-red-800 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-600 data-[highlighted]:text-white data-[highlighted]:outline-none dark:text-red-600',
          className
        )}
        {...props}
        ref={ref}
        value={value}
      >
        <Select.ItemText className='first-letter:capitalize'>
          {children}
        </Select.ItemText>
        <Select.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
          <Icon name='check' size={16} />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = 'SelectItem';

export default NameSelector;
