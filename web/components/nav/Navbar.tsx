import { createClient } from '@/utils/supabase/server';
import { getUserAvatarUrl } from '@utils/lib/common/user_helper';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { StyledLink } from '../common/link';
import { Text } from '../common/text';
import { NotificationPin } from '../notification/NotificationPin';
import { NavLink } from './NavLink';

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userAvatarUrl = user ? getUserAvatarUrl(user) : null;

  return (
    <div className='flex w-full items-center justify-between gap-4'>
      <Link href='/' className='px-2'>
        <Text variant={'caption'} className='text-center'>
          Tomato
        </Text>
      </Link>
      <div className='flex w-full flex-row items-center justify-end gap-3'>
        <NavLink href='/chat' label='Chat' icon='message' />
        {user ? (
          <>
            <NavLink href='/dashboard' label='Items' icon='layout' />
            <NotificationPin userId={user.id} />
          </>
        ) : (
          <StyledLink href='/auth/login' text='Login' size='small' />
        )}
      </div>
    </div>
  );
}
