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

// TODO: Write policies for item and qrcode links.
//       - An item can only be linked to a qrcode once.
//       - A qrcode can only be linked to an item once.
// TODO: Add a test ofr functions of qrcode and item.
// TODO: Finish the frontend process of item creation.
// TODO: Manage flow for item creations from QRCode.