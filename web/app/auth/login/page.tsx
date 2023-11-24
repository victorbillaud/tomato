import AuthProviders from '@/components/auth/AuthProviders';
import { Login } from '@/components/auth/Login';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page(props: {
  children: React.ReactNode;
  searchParams: { message: string; next: string };
}) {

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/user');
  }


  return (
    <>
      <AuthProviders />
      <div className='my-5 h-0.5 w-2/3 rounded-full border border-stone-200 opacity-50 dark:border-stone-700'></div>{' '}
      <Login />
    </>
  );
}
