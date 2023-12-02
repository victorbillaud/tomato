'use client';

import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text/Text';
import * as Popover from '@/components/radix/PopOver';
import { useNotifications } from '@/utils/hooks/useNotifications';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@utils/lib/supabase/supabase_types';
import dateFormat, { masks } from 'dateformat';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Button } from '../common/button';

export type NotificationPinProps = {
  user_id: string;
};

export const NotificationPin = ({ user_id }: NotificationPinProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const supabase = createClient();
  const [notifications, notificationsLoaded] = useNotifications({
    client: supabase,
    user_id: user_id,
  });

  const markNotificationAsRead = useCallback(
    async (notification_id: string) => {
      await supabase
        .from('notification')
        .update({ is_read: true })
        .eq('id', notification_id);
    },
    [supabase]
  );

  const markAllNotificationsAsRead = useCallback(async () => {
    await supabase
      .from('notification')
      .update({ is_read: true })
      .eq('user_id', user_id);
  }, [supabase, user_id]);

  // TODO: Create services for notifications

  return (
    notificationsLoaded && (
      <Popover.Root>
        <Popover.Trigger asChild ref={triggerRef}>
          <button
            className={`flex cursor-pointer flex-row items-center justify-center gap-1 rounded-lg border border-stone-500 p-1 px-2 opacity-100 dark:border-stone-700 ${
              notifications.filter((notification) => !notification.is_read)
                .length == 0 && 'opacity-50'
            }`}
            aria-label='Notifications'
          >
            <Icon
              name='bell'
              size={18}
              color='text-stone-500 dark:text-stone-300'
            />
            <Text
              variant='caption'
              weight={400}
              color='text-stone-500 dark:text-stone-300'
              className='text-center uppercase'
            >
              {
                notifications.filter((notification) => !notification.is_read)
                  .length
              }
            </Text>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='overflow-hidden rounded-lg border border-stone-300 bg-zinc-100 dark:border-stone-700 dark:bg-zinc-900'
            sideOffset={5}
            align='end'
          >
            <div className='flex flex-row items-center justify-between gap-44 px-4 py-3'>
              <Text
                variant='caption'
                weight={400}
                className='text-center first-letter:capitalize'
              >
                Notifications
              </Text>
              <Button
                text='See All'
                variant='tertiary'
                size='small'
                onClick={() => {
                  router.replace('/user/notifications');
                  triggerRef.current && triggerRef.current.setAttribute('data-state', 'closed');
                }}
              />
            </div>
            <div className='flex flex-col border-y border-stone-300 dark:border-stone-700'>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    markNotificationAsRead={markNotificationAsRead}
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
            <div className='flex flex-row items-center justify-end p-2'>
              <Button
                text='Mark all as read'
                className='opacity-80'
                variant='tertiary'
                icon='checks'
                size='small'
                onClick={markAllNotificationsAsRead}
              />
            </div>
            <Popover.Arrow className='fill-stone-300 dark:fill-stone-700' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  );
};

const NotificationCard = ({
  notification,
  markNotificationAsRead,
}: {
  notification: Database['public']['Tables']['notification']['Row'];
  markNotificationAsRead: (notification_id: string) => void;
}): JSX.Element => {
  const router = useRouter();

  return (
    <div
      className={`flex h-14 flex-row items-center justify-between border-b ${
        !notification.is_read &&
        'border-l-2 border-l-primary-500 bg-zinc-200/30 dark:bg-zinc-800/30'
      } border-b-zinc-300 px-4 py-2 last:border-b-0 dark:border-b-zinc-700`}
      style={{
        cursor: notification.link ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (notification.link) {
          router.push(notification.link);
          markNotificationAsRead(notification.id);
        }
      }}
    >
      <div className='flex flex-col items-start justify-start gap-1'>
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
          onClick={() => markNotificationAsRead(notification.id)}
          iconOnly
        />
      )}
    </div>
  );
};
