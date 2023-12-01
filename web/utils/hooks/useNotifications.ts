"use client";

import { SupabaseClient } from '@supabase/supabase-js';
import { listUserNotifications } from '@utils/lib/notification/service';
import { Database } from '@utils/lib/supabase/supabase_types';
import { useEffect, useState } from 'react';

export type TUseNotificationParams = {
    client: SupabaseClient<Database>;
    user_id: string;
};

type NotificationRecord = Database['public']['Tables']['notification']['Row'];

export function useNotifications({
    client,
    user_id,
}: TUseNotificationParams): [NonNullable<NotificationRecord>[], boolean] {
    const [notifications, setNotifications] = useState<NotificationRecord[]>(
        []
    );
    const [notificationsLoaded, setNotificationsLoaded] = useState(false);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await listUserNotifications({
                client: client,
            });

            if (error || !data) {
                console.error('Error fetching messages:', error);
            } else {
                setNotifications(data);
                setNotificationsLoaded(true); // Update messagesLoaded state to true
            }
        };

        // Set up real-time message subscription
        const notificatonChannel = client
            .channel(`notification-inserts`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notification',
                    filter: `user_id=eq.${user_id}`,
                },
                async (payload) => {
                    const notification = payload.new;

                    if (!notification) {
                        console.error('Error fetching messages');
                    } else {
                        setNotifications((notifications) => [...notifications, notification as NotificationRecord]);
                    }
                }
            )
            .subscribe();

        fetchMessages();

        return () => {
            notificatonChannel.unsubscribe();
        };
    }, [user_id]);

    return [notifications, notificationsLoaded];
}