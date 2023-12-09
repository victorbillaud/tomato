import { createClient } from '@/utils/supabase/server';
import { getUserAvatarUrl } from '@utils/lib/common/user_helper';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { StyledLink } from '../common/link';
import { Text } from '../common/text';
import { NotificationPin } from '../notification/NotificationPin';

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
      <Link href='/dashboard'>
        <Text variant={'caption'} className='text-center'>
          Dashboard
        </Text>
      </Link>
      <Link href='/chat'>
        <Text variant={'caption'} className='text-center'>
          Chat
        </Text>
      </Link>
      <div className='flex w-full flex-row items-center justify-end gap-1'>
        {user ? (
          <>
            <Link
              href='/user'
              className='flex flex-row items-center gap-1 px-2'
            >
              {userAvatarUrl ? (
                <Image
                  src={userAvatarUrl}
                  alt='avatar'
                  width={30}
                  height={30}
                  className='rounded-full'
                />
              ) : (
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-700'>
                  <Text
                    variant='caption'
                    weight={600}
                    className='text-center uppercase opacity-60'
                  >
                    {user.email ? user.email[0] : 'A'}
                  </Text>
                </div>
              )}
            </Link>
            <NotificationPin user_id={user.id} />
          </>
        ) : (
          <StyledLink href='/auth/login' text='Login' size='small' />
        )}
      </div>
    </div>
  );
}
