import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Icon } from '../icon';
import { ILinkProps, LinkVariant } from './types';

export const StyledLink: FunctionComponent<ILinkProps> = ({
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  const buttonClasses = getLinkClass(variant);
  const sizeClasses = getLinkSize(size);
  const linkClassName = classNames(
    buttonClasses.base,
    sizeClasses,
    props.disabled ? 'opacity-50 cursor-default' : buttonClasses.interact,
    'flex min-w-max items-center justify-center',
    'transition-all',
    props.className
  );
  return (
    <Link
      passHref
      {...props}
      href={props.disabled ? '#' : props.href}
      className={linkClassName}
    >
      {props.icon && (
        <Icon name={props.icon} size={getIconSize(size)} className='mr-2' />
      )}
      {props.text}
    </Link>
  );
};

const getLinkSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 'h-8 px-2 text-xs';
    case 'medium':
      return 'h-10 px-4 text-sm';
    case 'large':
      return 'h-12 px-6 text-base';
  }
};

const getIconSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 18;
    case 'medium':
      return 20;
    case 'large':
      return 22;
  }
};

const getLinkClass = (style: LinkVariant) => {
  switch (style) {
    case 'primary':
      return {
        base: 'rounded-md border border-transparent bg-primary-600 font-medium text-gray-100 shadow-sm',
        interact:
          'hover:bg-primary-650 focus:outline-none focus:ring-2 focus:ring-primary-650 focus:ring-offset-2',
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
