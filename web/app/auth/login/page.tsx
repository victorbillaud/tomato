import AuthProviders from '@/components/AuthProviders';
import { SubmitButton } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; next: string };
}) {
  const handleFormPost = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const resetPassword = formData.get('reset-password') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (resetPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/auth/forgot-password`,
      });

      if (error) {
        const redirectUrl = new URL(headers().get('referer') as string);
        redirectUrl.searchParams.set(
          'message',
          error.message || 'Unknown error'
        );
        return redirect(redirectUrl.href);
      }

      const redirectUrl = new URL(headers().get('referer') as string);
      redirectUrl.searchParams.set(
        'message',
        'Check email to continue reset password process'
      );
      return redirect(redirectUrl.href);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const redirectUrl = new URL(headers().get('referer') as string);
        redirectUrl.searchParams.set(
          'message',
          error.message || 'Unknown error'
        );

        return redirect(redirectUrl.href);
      }

      return redirect(searchParams.next || '/');
    }
  };

  return (
    <>
      <AuthProviders />
      <div className='my-5 h-0.5 w-2/3 rounded-full border border-stone-200 opacity-50 dark:border-stone-700'></div>{' '}
      <form
        action={handleFormPost}
        className='my-5 flex w-full flex-col items-center justify-between'
      >
        <div className='w-full space-y-3 rounded-lg'>
          <InputText
            labelText='Email'
            name='email'
            placeholder='you@example.com'
            icon='at'
            error={searchParams.message !== undefined}
          />
          <InputText
            labelText='Password'
            name='password'
            type='password'
            placeholder='••••••••'
            error={searchParams.message !== undefined}
            icon='lock'
          />

          {searchParams.message !== '' && (
            <div className='flex items-center justify-center'>
              <Text variant='caption' color='text-red-500/70'>
                {searchParams.message}
              </Text>
            </div>
          )}

          <div className='flex items-center justify-between'>
            <SubmitButton
              variant='primary'
              type='submit'
              text='Login'
              name='login'
              className='w-full'
            />
          </div>
          <div className='flex items-center justify-end'>
            <button name='reset-password' value='Reset password' type='submit'>
              <Text variant='overline' className='opacity-80'>
                Forgot Password?
              </Text>
            </button>
          </div>
          <StyledLink
            href={`/auth/register`}
            text='Need an account? Sign Up'
            variant='tertiary'
            className='text-sm opacity-75'
          />
        </div>
      </form>
    </>
  );
}
