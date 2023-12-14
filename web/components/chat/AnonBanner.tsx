'use client';

import { handleFinderRegistration } from '@/app/chat/[conversation_id]/action';
import { createClient } from '@/utils/supabase/client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import VerifyOTPForm from '../auth/otp/VerifyOTPForm';
import { Button, SubmitButton } from '../common/button';
import { InputText } from '../common/input';
import { Text } from '../common/text';

export const AnonBanner: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [otpSend, setOtpSend] = useState(false);

  const handleFinderRegistrationBindRedirection = handleFinderRegistration.bind(
    null,
    `/chat/${params.conversation_id}`
  );

  const sendOTP = async (event: any) => {
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithOtp({
      email: searchParams.get('email') as string,
    });

    if (!error) {
      setOtpSend(true);
    }
  };

  return (
    <div className='flex w-full flex-col gap-2 rounded-md border border-orange-300 bg-orange-200/60 p-2 shadow-sm dark:bg-orange-200/20'>
      <Text
        variant='caption'
        color='text-orange-500'
        className='text-center opacity-90'
      >
        {!searchParams.get('success') && (
          <>
            You are currently seeing this conversation as a guest. To help the
            owner to find his item faster you can give us your email address so
            we can create an account for you and save your conversations.
          </>
        )}
      </Text>
      {!searchParams.get('success') ? (
        <form
          action={handleFinderRegistrationBindRedirection}
          className='flex w-full flex-row gap-2'
        >
          <InputText
            icon='at'
            name='email'
            type='email'
            placeholder='Email'
            className='border-orange-300 bg-orange-200/60 dark:bg-orange-200/10'
          />
          <SubmitButton
            variant='tertiary'
            type='submit'
            text='Create an account'
            className='flex-1 text-orange-500'
          />
        </form>
      ) : (
        <>
          <Text
            variant='caption'
            color='text-orange-500'
            className='text-center opacity-90'
          >
            We sent you an email with a code to verify your email address.
          </Text>
          {otpSend ? (
            <VerifyOTPForm
              email={searchParams.get('email') as string}
              clearConversationTokens
              buttonStyle='secondary'
            />
          ) : (
            <Button
              variant='secondary'
              text='Send OTP code'
              onClick={sendOTP}
              className='w-full'
            />
          )}
        </>
      )}
    </div>
  );
};
