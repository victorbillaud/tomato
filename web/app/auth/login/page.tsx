import { OTPHandler } from '@/components/auth/OTPHandler';
import AuthProviders from '@/components/AuthProviders';

export default async function Login(props: {
  children: React.ReactNode;
  searchParams: { message: string; next: string };
}) {
  return (
    <>
      <AuthProviders />
      <div className='my-5 h-0.5 w-2/3 rounded-full border border-stone-200 opacity-50 dark:border-stone-700'></div>{' '}
      <OTPHandler />
    </>
  );
}
