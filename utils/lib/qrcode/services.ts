import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/supabase_types";
import { generateQRCodeName } from "../common";

export async function insertQRCode(
    supabaseInstance: SupabaseClient<Database>,
    qrCode: Database["public"]["Tables"]["qrcode"]["Insert"]
): Promise<ReturnType<typeof createQrCodeImage>> {
    const qrCodeObject: Database["public"]["Tables"]["qrcode"]["Insert"] = {
        user_id: qrCode.user_id,
        name: qrCode.name || generateQRCodeName()
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

    const { data: { user } } = await supabaseInstance.auth.getUser();

    const { data, error } = await supabaseInstance
        .from('qrcode')
        .select('*')
        .is('item_id', null)
        .eq('user_id', user.id);

    return { data, error }
}

export async function getQRCode(supabaseInstance: SupabaseClient<Database>, qrCodeId: string) {
    const { data, error } = await supabaseInstance
        .from('qrcode')
        .select('*')
        .eq('id', qrCodeId)
        .limit(1)
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


    let baseURL = process.env.VERCEL_URL || 'http://localhost:3000';

    if (process.env.NODE_ENV === 'production') {
        baseURL = "tomato.victorbillaud.fr"
    }

    // Add protocol if not present
    if (!baseURL.startsWith('http')) {
        baseURL = `https://${baseURL}`;
    }

    const qrCodeURL = `${baseURL}/scan/${qrCodeId}`;

    return qrCodeURL;
}
