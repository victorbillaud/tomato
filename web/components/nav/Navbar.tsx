import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { StyledLink } from '../common/link';
import { NotificationPin } from '../notification/NotificationPin';
import { NavLink } from './NavLink';

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <nav className='flex w-full max-w-6xl items-center justify-between gap-4 p-3 text-sm'>
      <Link
        href='/'
        className='transform px-2 transition-all duration-200 ease-in-out active:scale-[0.9]'
      >
        <Image
          src={'/tomato_green.png'}
          alt='logo'
          width={40}
          height={40}
          className='rounded-full'
        />
      </Link>
      <div className='flex w-full flex-row items-center justify-end gap-3'>
        <NavLink href='/chat' label='Chat' icon='message' />
        <NavLink href='/shop' label='Shop' icon="shopping-bag" />
        {user ? (
          <>
            <NavLink href='/dashboard' label='Items' icon='layout' />
            <NotificationPin userId={user.id} />
          </>
        ) : (
          <StyledLink href='/auth/login' text='Login' size='small' />
        )}
      </div>
    </nav>
  );
}
