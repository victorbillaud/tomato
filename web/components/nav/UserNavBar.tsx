import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Text } from '../common/text';

interface UserNavBarProps {
  items: NavItem[];
  user: User | null;
}

interface NavItem {
  href: string;
  label: string;
}

export function UserNavBar({ items, user }: UserNavBarProps) {
  return (
    <div className='flex w-full flex-1 flex-col items-start justify-between gap-2'>
      <Text variant='h3'>User preferences</Text>
      {items.map((item) => (
        <Link href={item.href} key={item.label}>
          <Text className='cursor-pointer' variant='subtitle'>
            {item.label}
          </Text>
        </Link>
      ))}
    </div>
  );
}
