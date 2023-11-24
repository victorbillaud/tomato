import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitButton } from '../common/button';
import { InputText } from '../common/input';
import { Text } from '../common/text';

interface ILoginWithPasswordFormProps {
  supabase: SupabaseClient<Database>;
  email: string;
  setEmail: (email: string) => void;
  setMessage: (message: string) => void;
}

const LoginWithPasswordForm = (props: ILoginWithPasswordFormProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loginWithPasswordError, setLoginWithPasswordError] = useState<
    undefined | string
  >(undefined);

  const handleLoginWithPassword = async (event: any) => {
    event.preventDefault();
    props.setMessage('');

    try {
      const {
        data: { user },
        error,
      } = await props.supabase.auth.signInWithPassword({
        email: props.email,
        password: password,
      });

      if (error) {
        setLoginWithPasswordError(error.message);
      }

      if (user) {
        router.refresh();
      }
    } catch (error) {
      props.setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLoginWithPassword} className='my-5 flex w-full'>
      <div className='w-full space-y-3 rounded-lg'>
        <InputText
          icon='at'
          labelText='Email'
          type='email'
          placeholder='Enter your email'
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
          required
        />
        <InputText
          icon='lock'
          labelText='Password'
          type='password'
          placeholder='Enter your password'
          value={password}
          error={loginWithPasswordError !== undefined}
          errorMessage={loginWithPasswordError}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordResetButton {...props} />
        <div className='w-full rounded-lg pt-3'>
          <SubmitButton
            variant='primary'
            type='submit'
            text='Login'
            name='login'
            className='w-full'
          />
        </div>
      </div>
    </form>
  );
};

interface IPasswordResetButtonProps {
  supabase: SupabaseClient<Database>;
  email: string;
  setMessage: (message: string) => void;
}

const PasswordResetButton = (props: IPasswordResetButtonProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleResetPassword = async (event: any) => {
    const { error } = await props.supabase.auth.resetPasswordForEmail(
      props.email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/forgot-password`,
      }
    );

    if (error) {
      const redirectUrl = new URL(window.location.href);
      redirectUrl.searchParams.set('message', error.message || 'Unknown error');
      return router.push(redirectUrl.href);
    }

    const redirectUrl = new URL(window.location.href);
    redirectUrl.searchParams.set(
      'message',
      'Check email to continue reset password process'
    );
    return router.push(redirectUrl.href);
  };

  useEffect(() => {
    const message = params.get('message');
    if (message) {
      props.setMessage(message);
    }
  }, [params]);

  return (
    <div className='flex items-center justify-end'>
      <button
        name='reset-password'
        value='Reset password'
        onClick={handleResetPassword}
      >
        <Text variant='overline' className='opacity-80'>
          Forgot Password?
        </Text>
      </button>
    </div>
  );
};

export default LoginWithPasswordForm;
