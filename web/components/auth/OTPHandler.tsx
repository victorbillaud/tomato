'use client';

import { Button, SubmitButton } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { InputText } from '@/components/common/input';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

export const OTPHandler = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loginWithPassword, setLoginWithPassword] = useState(false);
  const [loginWithPasswordError, setLoginWithPasswordError] = useState<
    undefined | string
  >(undefined);
  const [userExist, setUserExist] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();

  const sendOTP = async (email: string) => {

    if (!email) {
      setMessage('Email is required');
      return;
    }

    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setMessage(error.message);
      }

      if (!user && !session) {
        setMessage('Check your email for the OTP.');
        setOtpSent(true);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleLoginWithPassword = async (event: any) => {
    event.preventDefault();
    setMessage('');

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setLoginWithPasswordError(error.message);
      }

      if (user) {
        router.refresh();
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleVerifyOTP = async (event: any) => {
    event.preventDefault();
    setMessage(''); // reset message

    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });

      if (error) {
        setMessage(error.message);
        throw error;
      }

      if (user && session) {
        router.refresh();
      }
    } catch (err) {
      setMessage(err);
      console.error(err);
    }
  };

  const handleResetPassword = async (event: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/forgot-password`,
    });

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
      setMessage(message);
    }

  }, [params]);

  return (
    <div className='flex w-full flex-col items-center justify-start space-y-3'>
      {!loginWithPassword && !otpSent ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMessage('');
              setLoginWithPassword(true);
            }}
            className='my-5 flex w-full flex-col items-center justify-center gap-3'
          >
            <div className='w-full space-y-3 rounded-lg'>
              <InputText
                icon='at'
                labelText='Email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <SubmitButton
                variant='primary'
                type='submit'
                text='Connect with password'
                name='login'
                className='w-full'
              />
            </div>
            <div>
              <Text variant='caption' className='text-center opacity-50'>
                Or
              </Text>
            </div>
            <Button
              variant='secondary'
              text='Login with OTP'
              onClick={() => sendOTP(email)}
            />
          </form>
        </>
      ) : loginWithPassword && !otpSent ? (
        <>
          <form onSubmit={handleLoginWithPassword} className='my-5 flex w-full'>
            <div className='w-full space-y-3 rounded-lg'>
              <InputText
                icon='at'
                labelText='Email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
        </>
      ) : (
        <form onSubmit={handleVerifyOTP} className='my-5 flex w-full'>
          <div className='flex w-full flex-col items-center justify-center space-y-3 rounded-lg'>
            <div className='flex w-full justify-center'>
              <OtpInput
                value={otp}
                onChange={setOTP}
                numInputs={6}
                renderSeparator={<div className='mx-1'></div>}
                inputType='number'
                shouldAutoFocus={true}
                renderInput={(props, index) => {
                  return (
                    <input
                      {...props}
                      className='rounded-lg border border-zinc-200 bg-transparent bg-zinc-100 p-2 text-gray-700 shadow-sm outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200'
                      maxLength={1}
                      style={{
                        width: '2em',
                        textAlign: 'center',
                        fontSize: '1.5em',
                      }}
                    />
                  );
                }}
              />
            </div>
            <SubmitButton
              variant='primary'
              type='submit'
              text='Verify'
              name='verify'
            />
          </div>
        </form>
      )}
      {message && (
        <Card className='px-5 py-3'>
          <Text variant='caption' className='text-center opacity-50'>
            {message}
          </Text>
        </Card>
      )}
      {/* {params.message && (
        <Card className='px-5 py-3'>
          <Text variant='caption' className='text-center opacity-50'>
            {params.message}
          </Text>
        </Card>
      )} */}
    </div>
  );
};
