'use client';

import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { SubmitButton, TButtonVariant } from '../../common/button';

interface IVerifyOTPFormProps {
  email: string;
  setMessage?: (message: string) => void;
  clearConversationTokens?: boolean;
  buttonStyle?: TButtonVariant;
}

const VerifyOTPForm = (props: IVerifyOTPFormProps) => {
  const [otp, setOTP] = useState('');
  const [otpError, setOTPError] = useState(false);
  const [otpResentAt, setOTPResentAt] = useState<Date | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleVerifyOTP = async (event: any) => {
    event.preventDefault();
    props.setMessage && props.setMessage(''); // reset message

    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.verifyOtp({
        email: props.email,
        token: otp,
        type: 'email',
      });

      if (error) {
        props.setMessage && props.setMessage(error.message);
        setOTPError(true);
      }

      if (user && session) {
        props.clearConversationTokens && Cookies.remove('conversation_tokens');
        window.location.reload();
      }
    } catch (err) {
      props.setMessage && props.setMessage(err);
      setOTPError(true);
    }
  };

  const resendOTP = async (event: any) => {
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithOtp({
      email: props.email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (!error) {
      setOTPError(false);
      setOTPResentAt(new Date());
    }
  };

  return (
    <>
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
            variant={props.buttonStyle ?? 'primary'}
            type='submit'
            text='Verify'
            name='verify'
          />
        </div>
      </form>
      {otpError ? (
        <form action={resendOTP} className='flex w-full justify-center'>
          <SubmitButton
            variant='tertiary'
            type='submit'
            text='Resend OTP'
            name='resend'
            onClick={resendOTP}
          />
        </form>
      ) : (
        otpResentAt && (
          <div className='flex w-full justify-center'>
            <Text variant='caption' className='text-center opacity-90'>
              OTP resent at {otpResentAt?.toLocaleTimeString()}
            </Text>
          </div>
        )
      )}
    </>
  );
};

export default VerifyOTPForm;
