import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/supabase_types";

export type TListUserNotificationsParams = {
    client: SupabaseClient<Database>;
    onlyUnread?: boolean;
};

export async function listUserNotifications({
    client,
    onlyUnread,
}: TListUserNotificationsParams) {

    let query = client
        .from('notification')
        .select('*')
        .order('created_at', { ascending: false });

    if (onlyUnread) {
        query = query.eq('is_read', false);
    }

    const { data, error } = await query

    return { data, error };
}

export type TMarkNotificationAsReadParams = {
    client: SupabaseClient<Database>;
    notification_id: string;
};

export async function markNotificationAsRead({
    client,
    notification_id,
}: TMarkNotificationAsReadParams) {

    const { data, error } = await client
        .from('notification')
        .update({ is_read: true })
        .eq('id', notification_id);

    return { data, error };
}


export type TMarkAllNotificationsAsReadParams = {
    client: SupabaseClient<Database>;
    user_id: string;
};

export async function markAllNotificationsAsRead({
    client,
    user_id,
}: TMarkAllNotificationsAsReadParams) {

    const { data, error } = await client
        .from('notification')
        .update({ is_read: true })
        .eq('user_id', user_id);

    return { data, error };
}