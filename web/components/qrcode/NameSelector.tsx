import React from 'react';
import * as Select from '@/components/radix/Select';
import classNames from 'classnames';
import { Icon } from '../common/icon';

// TODO: finish colors and dark mode colors + choose better colors
// TODO: make a mutualize color palette to change it easily
// TODO: actually change the QR code based on the selected QR code
// TODO: set the first QR code as the default selected QR code

interface NameSelectorProps {
  values: { name: string; id: string }[];
}

const NameSelector = ({ values }: NameSelectorProps) => {
  return (
    <Select.Root>
      <Select.Trigger
        className='inline-flex h-[35px] w-44 items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-slate-900 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-red-100 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-red-400 dark:bg-neutral-900 dark:text-white dark:hover:bg-red-950'
        aria-label='Food'
      >
        <Select.Value placeholder='Select a QR code' />
        <Select.Icon>
          <Icon name='chevron-down' size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className='overflow-hidden rounded-md bg-white dark:bg-neutral-900 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'>
          <Select.Viewport className='p-[5px]'>
            <Select.Group>
              <Select.Label className='px-[25px] text-xs leading-[25px] text-slate-800 dark:text-slate-200'>
                Your QR codes
              </Select.Label>
              {values.map((value) => {
                return (
                  <SelectItem key={value.id} value={value.name}>
                    {value.name}
                  </SelectItem>
                );
              })}
            </Select.Group>
          </Select.Viewport>
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
          'relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-red-400 dark:text-red-800 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-400 data-[disabled]:text-red-100 data-[highlighted]:text-white data-[highlighted]:outline-none',
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
