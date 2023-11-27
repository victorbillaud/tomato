import { createClient } from '@/utils/supabase/server';
import {
  getUserAvatarUrl
} from '@utils/lib/common/user_helper';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { StyledLink } from '../common/link';
import { Text } from '../common/text';

export default async function AuthButton() {
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
      <div className='flex w-full items-center justify-end gap-1'>
        {user ? (
          <Link href='/user' className='flex flex-row items-center gap-1 px-2'>
            {userAvatarUrl ? (
              <Image
                src={userAvatarUrl}
                alt='avatar'
                width={30}
                height={30}
                className='rounded-full'
              />
            ) : (
              <div className='h-8 w-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center'>
                <Text variant='caption' weight={600} className='text-center uppercase opacity-60'>
                  {user.email ? user.email[0] : 'A'}
                </Text>
              </div>
            )}
          </Link>
        ) : (
          <StyledLink href='/auth/login' text='Login' size='small' />
        )}
      </div>
    </div>
  );
}
