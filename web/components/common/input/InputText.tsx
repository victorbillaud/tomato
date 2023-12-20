import classNames from 'classnames';
import React from 'react';
import { Icon, IconNames } from '../icon';
import { Text } from '../text';
export interface IInputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  error?: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
  icon?: IconNames;
}

export const InputText = React.forwardRef<HTMLInputElement, IInputTextProps>(
  (
    {
      className,
      children,
      labelText,
      type = 'text',
      error,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const inputContainerClass = classNames(
      'group flex items-center gap-2 border shadow-sm',
      className,
      error
        ? 'animate-shake border border-red-500 bg-red-700/10'
        : className ??
            'border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100',
      'text-s text-black-100 dark:text-white-100 w-full px-2 py-2 outline-none transition-all lg:text-sm xl:text-base',
      children ? 'rounded-r-md' : 'rounded-md'
    );

    return (
      <div className='flex w-full flex-col gap-1'>
        {labelText && (
          <div className='flex flex-row items-center justify-between gap-3'>
            <label className='text-left' htmlFor='txt'>
              <Text
                variant='caption'
                className='py-0 pl-1 font-medium capitalize'
                weight={500}
              >
                {labelText}
              </Text>
            </label>
            {errorMessage && (
              <Text variant='overline' color='text-red-600'>
                {errorMessage}
              </Text>
            )}
          </div>
        )}
        <div className={inputContainerClass}>
          {props.icon && (
            <Icon
              name={props.icon}
              size={20}
              color={`opacity-50 ${
                error ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'
              }`}
            />
          )}
          <input
            id='txt'
            autoComplete='off'
            className='w-full border-none bg-transparent text-gray-700 outline-none placeholder:opacity-40 group-focus:border-transparent group-focus:outline-none group-focus:ring-2 group-focus:ring-gray-200 dark:text-gray-200'
            {...props}
            ref={ref}
            type={type}
          />
          <div className='flex'>{children}</div>
        </div>
      </div>
    );
  }
);

InputText.displayName = 'InputText';
