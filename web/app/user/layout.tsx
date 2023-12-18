import { NotificationList } from '@/components/notification/NotificationList';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function UserLayout({ children }: { children: any }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='flex w-full flex-1 flex-col items-start justify-between gap-2 px-3 md:flex-row'>
      {children}
      <NotificationList user_id={user?.id as string} />
    </div>
  );
}
