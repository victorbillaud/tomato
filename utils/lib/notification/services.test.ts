import { describe, test } from '@jest/globals';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { listUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from './services';

const sp = getSupabase();

beforeEach(async () => {
    const data = await signInFakeUser(sp);

    const { error } = await sp
        .from("notification")
        .insert([
            {
                user_id: data.user.id,
                title: "Notification 1",
            },
            {
                user_id: data.user.id,
                title: "test",
                link: "https://google.com",
            }
        ]);

    if (error) {
        throw error;
    }
});

afterEach(() => {
    delete globalThis.notifications;
    sp.auth.signOut();
});


describe('service scan module', () => {
    test('list notifications', async () => {
        await signInFakeUser(sp);
        const { data, error } = await listUserNotifications({
            client: sp,
        });

        if (error) {
            throw error;
        }

        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
    });

    test('mark notification as read', async () => {
        await signInFakeUser(sp);
        const { data, error } = await listUserNotifications({
            client: sp,
        });

        if (error) {
            throw error;
        }

        const notification = data[0];

        const { data: updatedNotification, error: updateNotificationError } = await markNotificationAsRead({
            client: sp,
            notification_id: notification.id,
        });

        if (updateNotificationError) {
            throw updateNotificationError;
        }

        expect(updatedNotification).toHaveProperty('is_read', true);
    });

    test('mark all notifications as read', async () => {
        await signInFakeUser(sp);
        const { error } = await listUserNotifications({
            client: sp,
        });

        if (error) {
            throw error;
        }

        const { error: updateNotificationError } = await markAllNotificationsAsRead({
            client: sp,
            user_id: (await sp.auth.getUser()).data.user.id,
        });

        if (updateNotificationError) {
            throw updateNotificationError;
        }

        const { data, error: error2 } = await listUserNotifications({
            client: sp,
        });
        
        if (error2) {
            throw error2;
        }

        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        data.forEach((notification) => {
            expect(notification).toHaveProperty('is_read', true);
        });
    });
});
