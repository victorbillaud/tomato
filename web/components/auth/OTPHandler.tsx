'use client';

import { SubmitButton } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { InputText } from '@/components/common/input';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const OTPHandler = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loginButtonTrigger, setLoginButtonTrigger] = useState(false);
  const [userExist, setUserExist] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const userAlreadyExists = async (email: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: 'example-password',
    });

    if (error) {
      console.error(error);
      return true;
    }

    if (data.user) {
      return true;
    }

    return false;
  };

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

    if (!userExist) {
      sendOTP(email);
    }

    setLoginButtonTrigger(true);
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
    <div className='flex w-full flex-col items-center justify-start space-y-5'>
      {!loginButtonTrigger ? (
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
      ) : null}
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

// <form onSubmit={handleVerifyOTP} className='my-5 flex w-full'>
//           <div className='flex w-full flex-col items-center justify-center space-y-3 rounded-lg'>
//             <div className='flex w-full justify-center'>
//               <OtpInput
//                 value={otp}
//                 onChange={setOTP}
//                 numInputs={6}
//                 renderSeparator={<div className='mx-1'></div>}
//                 inputType='number'
//                 shouldAutoFocus={true}
//                 renderInput={(props, index) => {
//                   return (
//                     <input
//                       {...props}
//                       className='rounded-lg border border-zinc-200 bg-transparent bg-zinc-100 p-2 text-gray-700 shadow-sm outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200'
//                       maxLength={1}
//                       style={{
//                         width: '2em',
//                         textAlign: 'center',
//                         fontSize: '1.5em',
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </div>
//             <SubmitButton
//               variant='primary'
//               type='submit'
//               text='Verify'
//               name='verify'
//             />
//           </div>
//         </form>
