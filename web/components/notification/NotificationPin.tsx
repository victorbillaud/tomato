'use client';

import { Text } from '@/components/common/text/Text';
import * as Popover from '@/components/radix/PopOver';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { getUserAvatarUrl } from '@utils/lib/common/user_helper';
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@utils/lib/notification/services';
import dateFormat, { masks } from 'dateformat';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { signOut } from '../auth/actions';
import { Button } from '../common/button';
import { Icon } from '../common/icon';
import { NotificationCard } from './NotificationCard';
import { useNotificationContext } from './NotificationContext';

export type NotificationPinProps = {
  userId: string;
};

export const NotificationPin = ({ userId }: NotificationPinProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();

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

  const handleMarkAllNotificationsAsRead = useCallback(async () => {
    await markAllNotificationsAsRead({
      // @ts-ignore
      client: supabase,
      user_id: userId,
    });
  }, [supabase, userId]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => !notification.is_read);
  }, [notifications]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      user && setUser(user);
    };
    fetchUser();
  }, [userId]);

  const userAvatarUrl = useMemo(() => {
    return user ? getUserAvatarUrl(user) : null;
  }, [user]);

  return (
    isNotificationsLoaded && (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div className='relative flex cursor-pointer flex-row items-center justify-center'>
            {userAvatarUrl ? (
              <>
                <Image
                  src={userAvatarUrl}
                  alt='avatar'
                  width={30}
                  height={30}
                  className='rounded-full'
                />
                {filteredNotifications.length > 0 && (
                  <div className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-1 font-semibold text-white'>
                    {filteredNotifications.length}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-700'>
                  <Text
                    variant='caption'
                    weight={600}
                    className='text-center uppercase opacity-60'
                  >
                    {user && user.email ? user.email[0] : 'A'}
                  </Text>
                </div>
                {filteredNotifications.length > 0 && (
                  <div className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-1 font-semibold text-white'>
                    {filteredNotifications.length}
                  </div>
                )}
              </>
            )}
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='overflow-hidden rounded-lg border border-stone-300 bg-zinc-100/80 backdrop-blur-lg dark:border-stone-700 dark:bg-zinc-900/70'
            sideOffset={5}
            align='end'
          >
            <div className='flex flex-row items-center justify-between gap-20 px-3 py-3'>
              <button
                className='flex flex-row items-center justify-start gap-2 focus:outline-none'
                onClick={() => {
                  router.replace('/user');
                  setOpen(false);
                }}
              >
                <Image
                  src={userAvatarUrl}
                  alt='avatar'
                  width={50}
                  height={50}
                  className='rounded-full'
                />
                <div className='flex flex-col items-start justify-center'>
                  <Text variant='body' weight={400} className='text-center'>
                    {user?.email}
                  </Text>
                  <Text
                    variant='caption'
                    weight={300}
                    className='text-center opacity-50'
                  >
                    Member since {dateFormat(user?.created_at, masks.shortDate)}
                  </Text>
                </div>
              </button>
              <form
                action={signOut}
                className='flex items-center justify-center'
              >
                <button type='submit'>
                  <Icon name='logout' size={20} color='text-red-500' />
                </button>
              </form>
            </div>
            <div className='flex flex-col border-y border-stone-300 dark:border-stone-700'>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    markNotificationAsRead={handleMarkNotificationAsRead}
                    onClick={() => {
                      if (notification.link) {
                        router.push(notification.link);
                        handleMarkNotificationAsRead(notification.id);
                        setOpen(false);
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
                    No new notifications
                  </Text>
                </div>
              )}
            </div>
            <div className='flex flex-row items-center justify-between p-2'>
              <Button
                text='See All'
                variant='tertiary'
                size='small'
                onClick={() => {
                  router.replace('/user');
                  setOpen(false);
                }}
              />
              <Button
                text='Mark all as read'
                className='opacity-80'
                variant='tertiary'
                icon='checks'
                size='small'
                onClick={handleMarkAllNotificationsAsRead}
              />
            </div>
            <Popover.Arrow className='fill-stone-300 dark:fill-stone-700' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  );
};
