'use client';

import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import { listUserNotifications } from '@utils/lib/notification/service';
import { Database } from '@utils/lib/supabase/supabase_types';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

export type NotificationRecord =
  Database['public']['Tables']['notification']['Row'];

const NotificationContext = createContext({
  notifications: [] as NotificationRecord[],
  isNotificationsLoaded: false,
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isNotificationsLoaded, setIsNotificationsLoaded] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    let notificationsChannel: RealtimeChannel;

    const fetchNotifications = async () => {
      const { data, error } = await listUserNotifications({
        client: supabase,
      });

      if (error || !data) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data);
        setIsNotificationsLoaded(true);
      }
    };

    if (user && user.id) {
      // Set up real-time message subscription
      notificationsChannel = supabase
        .channel(`notification:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notification',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            const notification = payload.new as NotificationRecord;
            if (payload.eventType === 'INSERT') {
              setNotifications((prev) => [notification, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setNotifications((prev) => {
                const existingNotificationIndex = prev.findIndex(
                  (n) => n.id === notification.id
                );
                if (existingNotificationIndex !== -1) {
                  // If the notification exists, update it
                  return prev.map((n, index) =>
                    index === existingNotificationIndex ? notification : n
                  );
                } else {
                  // If the notification does not exist, add it to the list
                  return [notification, ...prev];
                }
              });
            } else if (payload.eventType === 'DELETE') {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              );
            }
          }
        )
        .subscribe();

      fetchNotifications();
    }

    return () => {
      if (notificationsChannel) {
        notificationsChannel.unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, [supabase]);

  return (
    <NotificationContext.Provider
      value={{ notifications, isNotificationsLoaded }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
