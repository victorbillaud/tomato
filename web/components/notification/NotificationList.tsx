'use client';

import { Text } from '@/components/common/text/Text';
import { createClient } from '@/utils/supabase/client';
import {
  markNotificationAsRead
} from '@utils/lib/notification/services';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { NotificationCard } from './NotificationCard';
import { useNotificationContext } from './NotificationContext';

export type NotificationListProps = {
  user_id: string;
};

export const NotificationList: React.FC<NotificationListProps> = ({
  user_id,
}) => {
  const router = useRouter();
  const supabase = createClient();
  const { notifications, isNotificationsLoaded } = useNotificationContext();

  const handleMarkNotificationAsRead = useCallback(
    async (notification_id: string) => {
      await markNotificationAsRead({
        // @ts-ignore
        client: supabase,
        notification_id: notification_id,
      });
    },
    [supabase]
  );

  return (
    <div className='flex w-full flex-1 flex-col items-end justify-center gap-2'>
      <div className='flex w-full flex-col overflow-hidden'>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              markNotificationAsRead={handleMarkNotificationAsRead}
              onClick={() => {
                if (notification.link) {
                  router.push(notification.link);
                  !notification.is_read &&
                    handleMarkNotificationAsRead(notification.id);
                }
              }}
            />
          ))
        ) : (
          <div className='flex flex-row items-center justify-center p-4'>
            <Text
              variant='caption'
              weight={400}
              className='text-center opacity-50 first-letter:capitalize'
            >
              No notifications
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
