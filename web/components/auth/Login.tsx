'use client';

import { Card } from '@/components/common/card';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import EmailForm from './EmailForm';
import LoginWithPasswordForm from './LoginWithPasswordForm';
import SendOTPButton from './otp/SendOTPButton';
import VerifyOTPForm from './otp/VerifyOTPForm';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const [loginWithPassword, setLoginWithPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const supabase = createClient();

  return (
    <div className='flex w-full flex-col items-center justify-start space-y-3'>
      {!loginWithPassword && !otpSent && (
        <EmailForm
          email={email}
          setEmail={setEmail}
          onEmailSubmit={async (event: any) => {
            setLoginWithPassword(true);
          }}
        />
      )}

      {loginWithPassword && (
        <LoginWithPasswordForm
          email={email}
          setEmail={setEmail}
          supabase={supabase}
          setMessage={setInfoMessage}
        />
      )}

      {!loginWithPassword && !otpSent && (
        <>
          <div>
            <Text variant='caption' className='text-center opacity-50'>
              Or
            </Text>
          </div>
          <SendOTPButton
            email={email}
            setMessage={setInfoMessage}
            supabase={supabase}
            setOtpSent={setOtpSent}
          />
        </>
      )}

      {!loginWithPassword && otpSent && (
        <VerifyOTPForm
          email={email}
          setMessage={setInfoMessage}
          supabase={supabase}
        />
      )}

      {infoMessage && (
        <Card className='px-5 py-3'>
          <Text variant='caption' className='text-center opacity-50'>
            {infoMessage}
          </Text>
        </Card>
      )}
    </div>
  );
};
