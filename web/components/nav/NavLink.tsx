'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Icon, IconNames } from '../common/icon';
import { Text } from '../common/text';

interface INavLinkProps {
  href: string;
  label: string;
  icon: IconNames;
}

export const NavLink = ({ href, label, icon }: INavLinkProps) => {
  const selectedSegment = useSelectedLayoutSegment();

  return (
    <Link
      href={href}
      className={`relative ${
        `/${selectedSegment}` === href
          ? 'opacity-100'
          : 'opacity-60'
      } flex cursor-pointer flex-row items-center justify-center gap-1 rounded-lg border-stone-500 p-1  dark:border-stone-700`}
      aria-label='Notifications'
    >
      <Icon
        name={icon}
        size={22}
        color={`text-stone-500 dark:text-stone-300`}
      />
      <Text
        variant={'caption'}
        className='text-center'
        weight={`/${selectedSegment}` === href ? 400 : 300}
        color='text-stone-500 dark:text-stone-300'
      >
        {label}
      </Text>
    </Link>
  );
};
