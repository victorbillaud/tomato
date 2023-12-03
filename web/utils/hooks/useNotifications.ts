"use client";

import { SupabaseClient } from '@supabase/supabase-js';
import { listUserNotifications } from '@utils/lib/notification/service';
import { Database } from '@utils/lib/supabase/supabase_types';
import { useEffect, useState } from 'react';

export type TUseNotificationParams = {
    client: SupabaseClient<Database>;
    user_id: string;
    onlyUnread?: boolean;
};

type NotificationRecord = Database['public']['Tables']['notification']['Row'];

export function useNotifications({
    client,
    user_id,
    onlyUnread = true,
}: TUseNotificationParams): [NotificationRecord[], boolean] {
    const [notifications, setNotifications] = useState<NotificationRecord[]>(
        []
    );
    const [notificationsLoaded, setNotificationsLoaded] = useState(false);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await listUserNotifications({
                // @ts-ignore
                client: client,
                onlyUnread: onlyUnread,
            });

            if (error || !data) {
                console.error('Error fetching messages:', error);
            } else {
                setNotifications(data);
                setNotificationsLoaded(true); // Update messagesLoaded state to true
            }
        };

        // Set up real-time message subscription
        const notificationsChannel = client
            .channel(`notification:${user_id}`)
            .on(
                'postgres_changes',
                {
                    event: "*",
                    schema: 'public',
                    table: 'notification',
                    filter: `user_id=eq.${user_id}`,
                },
                async (payload) => {
                    const notification = payload.new as NotificationRecord;
                    console.log(payload);
                    if (payload.eventType === "INSERT") {
                        setNotifications((prevNotifications) => [...prevNotifications, notification as NotificationRecord]);
                    } else if (payload.eventType === "UPDATE") {
                        setNotifications((prevNotifications) => prevNotifications.map(n => n.id === notification.id ? notification as NotificationRecord : n));
                    } else if (payload.eventType === "DELETE") {
                        setNotifications((prevNotifications) => prevNotifications.filter(n => n.id !== notification.id));
                    }
                }
            )
            .subscribe();

        fetchMessages();

        return () => {
            notificationsChannel.unsubscribe();
        };
    }, [user_id]);

    return [notifications, notificationsLoaded];
}