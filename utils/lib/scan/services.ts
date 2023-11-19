import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/supabase_types";

export async function insertScan(
    supabaseInstance: SupabaseClient<Database>,
    scan: Pick<Database["public"]["Tables"]["scan"]["Insert"], "item_id" | "qrcode_id" | "type">
) {

    const {
        data: { user },
    } = await supabaseInstance.auth.getUser();

    const userType: Database["public"]["Enums"]["ScanType"] = user ? "registered_user_scan" : "non_registered_user_scan";

    const scanToInsert: Database["public"]["Tables"]["scan"]["Insert"] = {
        ...scan,
        type: scan.type ? [...scan.type, userType] : [userType],
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

export async function listScans(
    supabaseInstance: SupabaseClient<Database>,
    qrcodeId: string
) {
    const { data, error } = await supabaseInstance
        .from('scan')
        .select('*')
        .eq('qrcode_id', qrcodeId)

    return { data, error }
}