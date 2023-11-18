import { Button } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { StyledLink } from '@/components/common/link';
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
    <form
      action={signUp}
      method='post'
      className='my-5 flex w-full flex-col items-center justify-between'
    >
      <div className='w-full max-w-lg space-y-2 rounded-lg'>
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
        <InputText
          labelText='Confirm password'
          name='confirm-password'
          type='password'
          placeholder='••••••••'
          icon='lock'
        />
        {searchParams?.message && (
          <div
            className='relative rounded border border-red-400 bg-red-600/20 px-4 py-3 text-sm text-red-700'
            role='alert'
          >
            <span className='block sm:inline'> {searchParams?.message}</span>
          </div>
        )}
        <div className='flex items-center justify-between pt-3'>
          <Button
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
  );
}
