import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/supabase_types";

export async function insertScan(
    supabaseInstance: SupabaseClient<Database>,
    scan: Pick<Database["public"]["Tables"]["scan"]["Insert"], "item_id" | "qrcode_id" | "location">
) {

    const { data: { user } } = await supabaseInstance.auth.getUser();

    const scanToInsert: Database["public"]["Tables"]["scan"]["Insert"] = {
        user_id: user?.id || null,
        ...scan,
    };

    const { data, error } = await supabaseInstance
        .from('scan')
        .insert(scanToInsert)
        .select('*')
        .single();

    return { data, error }
}

export async function deleteScan(
    supabaseInstance: SupabaseClient<Database>,
    scanId: string
) {
    const { error } = await supabaseInstance
        .from('scan')
        .delete()
        .eq('id', scanId)

    return { error }
}
