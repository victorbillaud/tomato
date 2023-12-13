import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className='flex w-full max-w-lg flex-1 flex-col items-center justify-center px-3'>
      {children}
    </main>
  );
}
