'use client';

import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/client';
import { markAllNotificationsAsRead } from '@utils/lib/notification/services';
import { useCallback } from 'react';
import { Button } from '../common/button';
import { NotificationList } from '../notification/NotificationList';

interface NotificationListProps {
  user_id: string;
}

export function NotificationsContainer({ user_id }: NotificationListProps) {
  const supabase = createClient();

  const handleMarkAllNotificationsAsRead = useCallback(async () => {
    await markAllNotificationsAsRead({
      client: supabase,
      user_id: user_id,
    });
  }, [supabase, user_id]);

  return (
    <div className='flex w-full flex-col rounded-md border border-stone-300 dark:border-stone-700 shadow-sm'>
      <div className='flex w-full flex-row items-center justify-between border-b border-stone-300 dark:border-stone-700 px-4 py-4'>
        <Text variant='subtitle'>Notifications</Text>
        <Button
          text='Mark all as read'
          className='opacity-80'
          variant='tertiary'
          icon='checks'
          size='small'
          onClick={handleMarkAllNotificationsAsRead}
        />
      </div>
      <div className='flex w-full flex-col'>
        <NotificationList user_id={user_id} />
      </div>
    </div>
  );
}
