import { SupabaseClient } from "@supabase/supabase-js";
import { associateQRCodeToItem } from "../qrcode/services";
import { Database } from "../supabase/supabase_types";

export async function insertItem(
    supabaseInstance: SupabaseClient<Database>,
    item: Pick<Database["public"]["Tables"]["item"]["Insert"], "name" | "description" | "qrcode_id">
) {

    const { data: { user } } = await supabaseInstance.auth.getUser();

    const itemToInsert: Database["public"]["Tables"]["item"]["Insert"] = {
        user_id: user.id,
        ...item,
    };

    const { data: insertedItem, error: itemInsertionError } = await supabaseInstance
        .from('item')
        .insert(itemToInsert)
        .select('*')
        .single();

    if (itemInsertionError) {
        return { insertedItem, error: itemInsertionError }
    }

    const { error: qrCodeUpdateError } = await associateQRCodeToItem(supabaseInstance, insertedItem.qrcode_id, insertedItem.id);

    if (qrCodeUpdateError) {
        return { insertedItem, error: qrCodeUpdateError }
    }

    return { insertedItem, error: null };
}

export async function listItems(supabaseInstance: SupabaseClient<Database>) {
    const { data, error } = await supabaseInstance
        .from('item')
        .select(`
            *,
            qrcode!qrcode_item_id_fkey (
                *
            )
        `);

    return { data, error }
}


// TODO: Manage flow for item creations from QRCode.


// TODO: Random name for qrcode