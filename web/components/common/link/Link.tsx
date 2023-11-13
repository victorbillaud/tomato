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
    'flex items-center justify-center h-10 py-1 m-1 px-4'
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
      return 'rounded-md border border-transparent bg-primary-600 font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    case 'secondary':
      return 'rounded-md border border-gray-300 bg-gray-200 font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
  }
};
