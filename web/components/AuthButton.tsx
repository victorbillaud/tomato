import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from './common/button';
import { StyledLink } from './common/link';
import { Text } from './common/text';

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect('/auth/login');
  };

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
          <form action={signOut}>
            <Button
              text='Logout'
              variant='tertiary'
              color='red'
              type='submit'
              title='Logout'
            />
          </form>
        ) : (
          <>
            <StyledLink
              href='/auth/register'
              text='Register'
              variant='tertiary'
              size='small'
            />
            <StyledLink href='/auth/login' text='Login' size='small' />
          </>
        )}
      </div>
    </div>
  );
}
