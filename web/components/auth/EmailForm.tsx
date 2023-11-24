import { SubmitButton } from '../common/button';
import { InputText } from '../common/input';

interface IEmailInputFormProps {
  email: string;
  setEmail: (email: string) => void;
  onEmailSubmit: (event: any) => void;
}

const EmailForm = ({
  email,
  setEmail,
  onEmailSubmit
}: IEmailInputFormProps) => {
  return (
    <form
      onSubmit={onEmailSubmit}
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
    </form>
  );
};

export default EmailForm;
