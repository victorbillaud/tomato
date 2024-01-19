import { Text } from '@/components/common/text';
import { NotificationsContainer } from '@/components/notification/NotificationsContainer';
import { ProfileCard } from '@/components/user/ProfileCard';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails } from '@utils/lib/user/services';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UserPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { user: profile } = await getUserDetails(supabase, user?.id);

  return (
    <div className='flex w-full flex-1 flex-col items-start justify-start gap-10 px-3'>
      <Text variant='h3' className=''>
        <span className='font-normal opacity-70'>Welcome, </span>
        <span className='font-bold'> {user?.email}</span>
      </Text>
      <div className='flex w-full flex-col md:flex-row items-start justify-start gap-4'>
        <div className='w-full flex flex-1 flex-col gap-4'>
          <ProfileCard user={user} profile={profile} />
          <Card
            title='Security'
            details='Manage your password and two-factor authentication.'
            rightButtonHref='/user/security'
            rightButtonText='Edit'
          >
            <div className='flex w-full flex-col'>
              <div className='flex w-full flex-row items-center justify-between'>
                <Text variant='body'>Password</Text>
                <Text variant='body'>********</Text>
              </div>
              <div className='flex w-full flex-row items-center justify-between'>
                <Text variant='body'>Two-factor authentication</Text>
                <Text variant='body'>Disabled</Text>
              </div>
            </div>
          </Card>
        </div>
        <div className='flex w-full md:w-1/3 flex-col gap-4'>
          <NotificationsContainer user_id={user?.id} />
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  children: React.ReactNode;
  details?: string;
  rightButtonHref?: string;
  rightButtonText?: string;
}

function Card({
  title,
  children,
  details,
  rightButtonHref,
  rightButtonText,
}: CardProps) {
  return (
    <div className='flex w-full flex-col rounded-md border border-gray-200 shadow-md'>
      <div className='flex w-full flex-row items-center justify-between border-b border-gray-200 px-4 py-5'>
        <Text variant='h4'>{title}</Text>
        {rightButtonHref && (
          <Link href={rightButtonHref}>
            <Text variant='body'>{rightButtonText}</Text>
          </Link>
        )}
      </div>
      <div className='flex w-full flex-col p-4'>{children}</div>
      {details && (
        <div className='flex w-full flex-row items-center justify-between border-t border-gray-200 p-4'>
          <Text variant='body' className='opacity-70'>
            {details}
          </Text>
        </div>
      )}
    </div>
  );
}
