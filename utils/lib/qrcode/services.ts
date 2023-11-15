import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase_types";
import { getEnvVariable } from "../../lib/common/envService";

export async function insertQRCode(supabaseInstance: SupabaseClient<Database>, qrCode: Database["public"]["Tables"]["qrcode"]["Insert"]) {
    const qrCodeObject: Database["public"]["Tables"]["qrcode"]["Insert"] = {
        user_id: qrCode.user_id,
    };

    const { data, error } = await supabaseInstance
        .from('qrcode')
        .insert(qrCodeObject)
        .select('*')
        .single();

    if (error) {
        throw error;
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

    if (error) {
        throw error;
    }

    return data;
}

function buildQRCodeURL(qrCodeId: string): string {
    let baseURL =
        getEnvVariable('NEXT_PUBLIC_SITE_URL') ?? // Set this to your site URL in production env.
        getEnvVariable('NEXT_PUBLIC_VERCEL_URL') ?? // Automatically set by Vercel.
        'http://localhost:3000/';

    // Make sure to include `https://` when not localhost.
    baseURL = baseURL.includes('http') ? baseURL : `https://${baseURL}`;

    const qrCodeURL = `${baseURL}/qrcode/${qrCodeId}`;

    return qrCodeURL;
}
