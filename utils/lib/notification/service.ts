import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/supabase_types";

export type TListUserNotificationsParams = {
    client: SupabaseClient<Database>;
};

export async function listUserNotifications({
    client,
}: TListUserNotificationsParams) {
    const { data, error } = await client
        .from('notification')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

    return { data, error };
}
