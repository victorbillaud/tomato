import { Button } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; redirectTo: string };
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

    return redirect(searchParams.redirectTo || '/');
  };

  return (
    <form
      action={signIn}
      method='post'
      className='my-5 flex w-full flex-col items-center justify-between'
    >
      <div className='w-full space-y-2 rounded-lg'>
        <InputText
          labelText='Email'
          name='email'
          placeholder='you@example.com'
          icon='at'
        />
        <InputText
          labelText='Password'
          name='password'
          type='password'
          placeholder='••••••••'
          icon='lock'
        />
        <div className='flex items-center justify-end py-1'>
          <Link href={`/auth/forgot-password`} className='text-sm'>
            <Text variant='overline' className='text-gray-600'>
              Forgot Password?
            </Text>
          </Link>
        </div>
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
        <StyledLink
          href={`/auth/register`}
          text='Need an account? Sign Up'
          variant='tertiary'
          className='text-sm opacity-75'
        />
      </div>
    </form>
  );
}
