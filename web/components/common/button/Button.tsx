import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { Icon } from '../icon';
import { IButtonProps, TButtonVariant } from './types';

export const Button: FunctionComponent<IButtonProps> = ({
  size = 'medium',
  isLoader = false,
  variant = 'primary',
  icon,
  iconOnly,
  className,
  ...props
}) => {
  const sizeDict = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const heightDict = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
  };

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const iconColor = {
    primary: 'text-white-100',
    secondary: 'text-gray-100',
    tertiary: 'text-gray-100',
  };

  const buttonClasses = getButtonClass(variant);
  const buttonClassName = classNames(
    buttonClasses.base,
    'py-1 min-w-max',
    props.disabled ? 'opacity-50 cursor-default' : buttonClasses.interact,
    icon
      ? `flex items-center justify-center ${!isLoader ? 'py-0 pl-1' : 'py-0'}`
      : '',
    heightDict[size],
    'transition-all',
    className
  );

  return (
    <button
      className={buttonClassName}
      disabled={props.disabled || isLoader}
      {...props}
    >
      {isLoader ? (
        <div className='flex h-full w-full items-center justify-center pr-1'>
          <div className='animate-spin'>
            <Icon
              name='loader'
              size={iconSize[size]}
              color={iconColor[variant]}
            />
          </div>
        </div>
      ) : (
        <>
          {icon && (
            <div className='pr-2'>
              <Icon
                name={icon}
                size={iconSize[size]}
                color={iconColor[variant]}
              />
            </div>
          )}
          {!iconOnly && (
            <p className={classNames(sizeDict[size], icon ? 'pr-2' : 'px-4')}>
              {props.text}
            </p>
          )}
        </>
      )}
      {props.children}
    </button>
  );
};

const getButtonClass = (style: TButtonVariant) => {
  switch (style) {
    case 'primary':
      return {
        base: 'rounded-md border border-transparent bg-primary-900 font-medium text-gray-100 shadow-sm',
        interact:
          'hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:ring-offset-2',
      };
    case 'secondary':
      return {
        base: 'rounded-md border dark:border-gray-100 bg-gray-100 dark:bg-transparent font-medium text-gray-700 dark:text-gray-100 shadow-sm',
        interact:
          'hover:bg-gray-200 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200',
      };
    case 'tertiary':
      return {
        base: 'rounded-md border border-transparent bg-transparent font-medium text-gray-700 dark:text-gray-200',
        interact:
          'hover:text-gray-500 dark:hover:text-gray-500 focus:outline-none',
      };
  }
};
