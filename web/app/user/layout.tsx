import { Button } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { getUserAvatarUrl } from '@utils/lib/common/user_helper';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function UserLayout({ children }: { children: any }) {
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

  const userAvatarUrl = user ? getUserAvatarUrl(user) : null;

  return (
    <>
      <div className='flex w-full flex-row items-center justify-center gap-20'>
        {userAvatarUrl && (
          <Image
            src={userAvatarUrl}
            alt='avatar'
            width={60}
            height={100}
            className='rounded-full'
          />
        )}
        <Text variant='h4' className='text-center'>
          {user?.email}
        </Text>
        <form action={signOut}>
          <Button
            text='Logout'
            variant='secondary'
            color='red'
            type='submit'
            title='Logout'
          />
        </form>
      </div>
      {children}
    </>
  );
}
