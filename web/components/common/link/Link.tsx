import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
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

const getLinkClass = (style: LinkVariant) => {
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
