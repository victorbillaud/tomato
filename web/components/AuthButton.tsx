import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
      Hey, {user.email}!
      <form action={signOut}>
        <button className='flex justify-center rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'>
          Logout
        </button>
      </form>
    </div>
  ) : (
    <div className='flex w-full items-center justify-between gap-4'>
      <Link href='/'>Tomato</Link>
      <div className='flex w-full items-center justify-end gap-4'>
        <Link
          href='/auth/login'
          className='flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        >
          Sign in
        </Link>
        <Link
          href='/auth/register'
          className='flex justify-center rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        >
          Register
        </Link>
      </div>
    </div>
  );
}
