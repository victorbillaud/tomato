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
    <div className='mx-3 flex flex-col items-center gap-2 rounded-lg border-orange-300 bg-orange-200/60 p-2 dark:bg-orange-200/20 sm:mx-0 sm:shadow-none'>
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
          className='flex w-full flex-col md:flex-row items-center justify-between gap-2'
        >
          <InputText
            icon='at'
            name='email'
            type='email'
            placeholder='Email'
            className='border-orange-300/20 bg-orange-200/60 dark:bg-orange-200/10'
          />
          <SubmitButton
            variant='tertiary'
            size='small'
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
            Your account has been created, please check your emails.
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
              text='Connect now with OTP'
              onClick={sendOTP}
              className='w-full'
            />
          )}
        </>
      )}
      {searchParams.get('error') && (
        <Text
          variant='caption'
          color='text-red-500'
          className='text-center opacity-90'
        >
          {searchParams.get('error')}
        </Text>
      )}
    </div>
  );
};
