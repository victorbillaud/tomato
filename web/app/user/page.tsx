import { Text } from '@/components/common/text';
import { NotificationsContainer } from '@/components/user/NotificationsContainer';
import { NotificationSettingsSwitch } from '@/components/user/NotificationSettingsSwitch';
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

  if (!profile) {
    return notFound();
  }

  return (
    <div className='flex w-full flex-1 flex-col items-start justify-start gap-10 px-3'>
      <Text variant='h3' className=''>
        <span className='font-normal opacity-70'>Welcome, </span>
        <span className='font-bold'> {user?.email}</span>
      </Text>
      <div className='flex w-full flex-col items-start justify-start gap-4 md:flex-row'>
        <div className='flex w-full flex-1 flex-col gap-4'>
          <ProfileCard user={user} profile={profile} />
          <Card title='Notifications'>
            <div className='flex w-full flex-col gap-3'>
              <NotificationSettingsSwitch
                user_id={user?.id}
                label='Receive email notifications'
                field='email_notifications'
                value={profile?.email_notifications}
              />
              <NotificationSettingsSwitch
                user_id={user?.id}
                label='Receive notifications for new messages'
                field='message_notifications'
                value={profile?.message_notifications}
              />
            </div>
          </Card>
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
        <div className='flex w-full flex-col gap-4 md:w-1/3'>
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
    <div className='flex w-full flex-col rounded-md border border-stone-300 dark:border-stone-700 shadow-sm'>
      <div className='flex w-full flex-row items-center justify-between border-b border-stone-300 dark:border-stone-700 px-4 py-5'>
        <Text variant='h4'>{title}</Text>
        {rightButtonHref && (
          <Link href={rightButtonHref}>
            <Text variant='body'>{rightButtonText}</Text>
          </Link>
        )}
      </div>
      <div className='flex w-full flex-col p-4'>{children}</div>
      {details && (
        <div className='flex w-full flex-row items-center justify-between border-t border-stone-300 dark:border-stone-700 p-4'>
          <Text variant='body' className='opacity-70'>
            {details}
          </Text>
        </div>
      )}
    </div>
  );
}
