import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { SubmitButton } from '../../common/button';

interface IVerifyOTPFormProps {
  supabase: SupabaseClient<Database>;
  email: string;
  setMessage: (message: string) => void;
}

const VerifyOTPForm = (props: IVerifyOTPFormProps) => {
  const [otp, setOTP] = useState('');
  const router = useRouter();

  const handleVerifyOTP = async (event: any) => {
    event.preventDefault();
    props.setMessage(''); // reset message

    try {
      const {
        data: { user, session },
        error,
      } = await props.supabase.auth.verifyOtp({
        email: props.email,
        token: otp,
        type: 'email',
      });

      if (error) {
        props.setMessage(error.message);
        throw error;
      }

      if (user && session) {
        router.refresh();
      }
    } catch (err) {
      props.setMessage(err);
      console.error(err);
    }
  };

  return (
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
  );
};

export default VerifyOTPForm;