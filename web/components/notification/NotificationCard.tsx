'use client';

import { Database } from '@utils/lib/supabase/supabase_types';
import dateFormat, { masks } from 'dateformat';
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
          {dateFormat(notification.created_at, masks.shortTime)}
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
