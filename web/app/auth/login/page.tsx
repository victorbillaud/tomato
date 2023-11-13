import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(
        `/auth/login?message=${encodeURIComponent(
          error.message || 'Unknown error'
        )}`
      );
    }

    return redirect('/');
  };

  return (
    <div className='flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md'>
      <Link
        href='/'
        className='group absolute left-8 top-8 flex items-center rounded-md bg-btn-background px-4 py-2 text-sm text-foreground no-underline hover:bg-btn-background-hover'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
        >
          <polyline points='15 18 9 12 15 6' />
        </svg>{' '}
        Back
      </Link>

      <form
        action={signIn}
        method='post'
        className='flex min-h-screen flex-col items-center justify-center bg-gray-50'
      >
        <div className='w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              name='email'
              placeholder='you@example.com'
              className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              name='password'
              placeholder='••••••••'
              className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500'
            />
          </div>
          {searchParams.message && (
            <div
              className='relative rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700'
              role='alert'
            >
              <span className='block sm:inline'> {searchParams.message}</span>
            </div>
          )}
          <div className='flex items-center justify-between'>
            <button
              className='flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              type='submit'
            >
              Sign In
            </button>
          </div>
          <div className='text-center text-sm'>
            <a
              href='/auth/register'
              className='font-medium text-primary-600 hover:text-primary-500'
            >
              Need an account? Sign Up
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
