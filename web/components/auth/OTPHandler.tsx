'use client';

import { Button, SubmitButton } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { InputText } from '@/components/common/input';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OtpInput from 'react-otp-input';

export const OTPHandler = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loginButtonTrigger, setLoginButtonTrigger] = useState(false);
  const [userExist, setUserExist] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const sendOTP = async (email: string) => {
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
        throw error;
      }

      if (!user && !session) {
        setMessage('Check your email for the OTP.');
        setOtpSent(true);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setMessage('');

    setUserExist(await userAlreadyExists(email));

    if (userExist) {
      sendOTP(email);
    }

    setLoginButtonTrigger(true);
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
        setMessage(error.message);
        throw error;
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

  return (
    <div className='flex w-full flex-col items-center justify-start space-y-3'>
      {!loginButtonTrigger && !otpSent ? (
        <form onSubmit={handleLogin} className='my-5 flex w-full'>
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
              text='Login'
              name='login'
              className='w-full'
            />
          </div>
        </form>
      ) : userExist && !otpSent ? (
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
    </div>
  );
};
