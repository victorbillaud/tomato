import AuthProviders from '@/components/AuthProviders';
import { SubmitButton } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Register({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      return redirect(
        `/auth/register?message=${encodeURIComponent('Passwords do not match')}`
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect(
        `/auth/register?message=${encodeURIComponent(
          error.message || 'Unknown error'
        )}`
      );
    }

    return redirect(
      '/auth/register?message=Check email to continue sign in process'
    );
  };

  return (
    <>
      <AuthProviders />
      <div className='my-5 h-0.5 w-2/3 rounded-full border border-stone-200 opacity-50 dark:border-stone-700'></div>{' '}
      <form
        action={signUp}
        className='my-5 flex w-full flex-col items-center justify-between'
      >
        <div className='w-full max-w-lg space-y-3 rounded-lg'>
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
            error={searchParams.message !== undefined}
          />
          <InputText
            labelText='Confirm password'
            name='confirm-password'
            type='password'
            placeholder='••••••••'
            icon='lock'
            error={searchParams.message !== undefined}
          />
          {searchParams.message !== '' && (
            <div className='flex items-center justify-center'>
              <Text variant='caption' color='text-red-500/80'>
                {searchParams.message}
              </Text>
            </div>
          )}
          <div className='flex items-center justify-between pt-3'>
            <SubmitButton
              variant='primary'
              type='submit'
              text='Register'
              className='w-full'
            />
          </div>
          <StyledLink
            href={`/auth/login`}
            text='Already have an account? Login'
            variant='tertiary'
            className='text-sm opacity-75'
          />
        </div>
      </form>
    </>
  );
}
