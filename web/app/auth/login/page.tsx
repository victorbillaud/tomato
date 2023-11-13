import { Button } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
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
    <form
      action={signIn}
      method='post'
      className='my-5 flex flex-col items-center justify-between'
    >
      <div className='w-full max-w-lg space-y-6 rounded-lg'>
        <InputText
          labelText='Email'
          name='email'
          placeholder='you@example.com'
        />
        <InputText
          labelText='Password'
          name='password'
          type='password'
          placeholder='••••••••'
        />
        {searchParams.message && (
          <div
            className='relative rounded border border-red-400 bg-red-600/20 px-4 py-3 text-sm text-red-700'
            role='alert'
          >
            <span className='block sm:inline'> {searchParams.message}</span>
          </div>
        )}
        <div className='flex items-center justify-between'>
          <Button
            variant='primary'
            type='submit'
            text='Login'
            className='w-full'
          />
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
  );
}
