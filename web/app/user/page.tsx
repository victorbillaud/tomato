import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function UserPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className='flex w-full max-w-lg flex-1 flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold text-stone-900 dark:text-stone-100'>
        Welcome {user?.email}
      </h1>
    </main>
  );
}
