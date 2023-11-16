import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { ILinkProps, LinkVariant } from './types';

export const StyledLink: FunctionComponent<ILinkProps> = ({
  variant = 'primary',
  ...props
}) => {
  const linkClassName = classNames(
    getLinkClass(variant),
    props.disabled ? 'opacity-50' : '',
    'flex min-w-max items-center justify-center h-10 py-1 m-1 px-4',
    'transition-all'
  );
  return (
    <Link passHref {...props} className={linkClassName}>
      {props.text}
    </Link>
  );
};

const getLinkClass = (style: LinkVariant) => {
  switch (style) {
    case 'primary':
      return 'rounded-md border border-transparent bg-primary-900 font-medium text-gray-100 shadow-sm hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:ring-offset-2';
    case 'secondary':
      return 'rounded-md border dark:border-gray-100 bg-gray-100 dark:bg-transparent font-medium text-gray-700 dark:text-gray-100 shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200';
    case 'tertiary':
      return 'rounded-md border border-transparent bg-transparent font-medium text-gray-700 dark:text-gray-200 hover:text-gray-700 focus:outline-none';
  }
};
