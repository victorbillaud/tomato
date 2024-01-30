import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';
import { Button } from '../../common/button';

interface ISendOTPButtonProps {
  supabase: SupabaseClient<Database>;
  email: string;
  setMessage: (message: string) => void;
  setOtpSent: (otpSent: boolean) => void;
}

const SendOTPButton = (props: ISendOTPButtonProps) => {
  const sendOTP = async (email: string) => {
    if (!email) {
      props.setMessage('Email is required');
      return;
    }

    try {
      const { error } = await props.supabase.auth.signInWithOtp({
        email: email,
      });

      console.log(error);

      if (error) {
        props.setMessage(error.message);
      } else {
        props.setMessage('Check your email for the OTP.');
        props.setOtpSent(true);
      }
    } catch (error) {
      props.setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Button
      variant='secondary'
      text='Login or register with OTP'
      onClick={() => sendOTP(props.email)}
    />
  );
};

export default SendOTPButton;
