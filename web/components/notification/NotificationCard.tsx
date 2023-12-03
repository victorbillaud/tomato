'use client';

import { Database } from '@utils/lib/supabase/supabase_types';
import { Button } from '../common/button';
import { Text } from '../common/text/Text';

export const NotificationCard = ({
  notification,
  markNotificationAsRead,
  onClick,
}: {
  notification: Database['public']['Tables']['notification']['Row'];
  markNotificationAsRead: (notification_id: string) => void;
  onClick?: () => void;
}): JSX.Element => {
  return (
    <div
      className={`flex h-14 w-full flex-row items-center justify-between gap-10 border-b ${
        !notification.is_read &&
        'border-l-2 border-l-primary-500 bg-zinc-200/30 dark:bg-zinc-800/30'
      } border-b-zinc-300 px-4 py-2 last:border-b-0 dark:border-b-zinc-700`}
      style={{
        cursor: notification.link ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div className='flex w-full flex-col items-start justify-start gap-1'>
        <Text
          variant='caption'
          weight={500}
          className='text-center first-letter:capitalize'
        >
          {notification.title}
        </Text>
        <Text
          variant='caption'
          weight={400}
          className='text-center opacity-60 first-letter:capitalize'
        >
          {notificationDate(new Date(notification.created_at))}
        </Text>
      </div>
      {!notification.is_read && (
        <Button
          text='Mark as read'
          className='opacity-70'
          variant='tertiary'
          icon='check'
          size='small'
          onClick={(e) => {
            e.stopPropagation();
            markNotificationAsRead(notification.id);
          }}
          iconOnly
        />
      )}
    </div>
  );
};

function notificationDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (minutes < 1) {
    return 'just now';
  } else if (minutes < 60) {
    return `${Math.floor(minutes)} minutes ago`;
  } else if (hours < 24) {
    return `${Math.floor(hours)} hours ago`;
  } else {
    return `${Math.floor(days)} days ago`;
  }
}
