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

  return user ? (
    <div className='flex w-full items-center justify-between gap-4'>
      <Text variant={'caption'} className='text-center'>
        Hey, {user.email}!
      </Text>
      <form action={signOut}>
        <Button
          text='Logout'
          variant='secondary'
          type='submit'
          title='Logout'
        />
      </form>
    </div>
  ) : (
    <div className='flex w-full items-center justify-between gap-4'>
      <Link href='/'>
        <Text variant={'caption'} className='text-center'>
          Tomato
        </Text>
      </Link>
      <div className='flex w-full items-center justify-end gap-1'>
        <StyledLink href='/auth/login' text='Login' />
        <StyledLink href='/auth/register' text='Register' variant='secondary' />
      </div>
    </div>
  );
}
