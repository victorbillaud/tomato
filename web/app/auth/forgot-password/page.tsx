import { SubmitButton } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const changePassword = async (formData: FormData) => {
    'use server';

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      return redirect(
        `/auth/forgot-password?message=${encodeURIComponent(
          'Passwords do not match'
        )}`
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      return redirect(
        `/auth/login?message=${encodeURIComponent(
          error.message || 'Unknown error'
        )}`
      );
    }

    await supabase.auth.signOut();
    return redirect('/auth/login');
  };

  return (
    <form
      action={changePassword}
      className='my-5 flex w-full flex-col items-center justify-between'
    >
      <div className='w-full space-y-3 rounded-lg'>
        <InputText
          labelText='New password'
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
        <div className='flex items-center justify-between'>
          <SubmitButton
            variant='primary'
            type='submit'
            text='Change password'
            className='w-full'
          />
        </div>
      </div>
    </form>
  );
}
