import { SupabaseClient } from "@supabase/supabase-js";
import { getEnvVariable } from "../../lib/common/envService";
import { Database } from "../supabase/supabase_types";

export async function insertQRCode(
    supabaseInstance: SupabaseClient<Database>,
    qrCode: Database["public"]["Tables"]["qrcode"]["Insert"]
): Promise<ReturnType<typeof createQrCodeImage>> {
    const qrCodeObject: Database["public"]["Tables"]["qrcode"]["Insert"] = {
        user_id: qrCode.user_id,
    };

    const { data, error } = await supabaseInstance
        .from('qrcode')
        .insert(qrCodeObject)
        .select('*')
        .single();

    if (error) {
        return { data, error }
    }

    return await createQrCodeImage(supabaseInstance, data);
}

async function createQrCodeImage(supabaseInstance: SupabaseClient<Database>, qrCode: Database["public"]["Tables"]["qrcode"]["Row"]) {

    const qrCodeURL = buildQRCodeURL(qrCode.id);

    const qrCodeObject: Database["public"]["Tables"]["qrcode"]["Update"] = {
        barcode_data: qrCodeURL,
    };

    const { data, error } = await supabaseInstance
        .from('qrcode')
        .update(qrCodeObject)
        .eq('id', qrCode.id)
        .select()
        .single();

    return { data, error }
}

export async function listQRCode(supabaseInstance: SupabaseClient<Database>) {
    const { data, error } = await supabaseInstance
        .from('qrcode')
        .select('*')
        .is('item_id', null);

    return { data, error }
}

export async function getQRCode(supabaseInstance: SupabaseClient<Database>, qrCodeId: string) {
    const { data, error } = await supabaseInstance
        .from('qrcode')
        .select('*')
        .eq('id', qrCodeId)
        .single();

    return { data, error }
}

export async function associateQRCodeToItem(supabaseInstance: SupabaseClient<Database>, qrCodeId: string, itemId: string) {
    const { data, error } = await supabaseInstance
        .from('qrcode')
        .update({ item_id: itemId })
        .eq('id', qrCodeId)
        .select('*')
        .single();

    return { data, error }
}

function buildQRCodeURL(qrCodeId: string): string {
    let baseURL =
        getEnvVariable('NEXT_PUBLIC_SITE_URL') ?? // Set this to your site URL in production env.
        getEnvVariable('NEXT_PUBLIC_VERCEL_URL') ?? // Automatically set by Vercel.
        'http://localhost:3000/';

    // Make sure to include `https://` when not localhost.
    baseURL = baseURL.includes('http') ? baseURL : `https://${baseURL}`;

    const qrCodeURL = `${baseURL}/scan/${qrCodeId}`;

    return qrCodeURL;
}
