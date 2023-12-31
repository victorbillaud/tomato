import { SupabaseClient } from '@supabase/supabase-js';
import { associateQRCodeToItem } from '../qrcode/services';
import { Database } from '../supabase/supabase_types';

export async function insertItem(
  supabaseInstance: SupabaseClient<Database>,
  item: Pick<
    Database['public']['Tables']['item']['Insert'],
    'name' | 'description' | 'qrcode_id' | 'activated'
  >
) {
  const {
    data: { user },
  } = await supabaseInstance.auth.getUser();

  const itemToInsert: Database['public']['Tables']['item']['Insert'] = {
    user_id: user.id,
    ...item,
  };

  const { data: insertedItem, error: itemInsertionError } =
    await supabaseInstance
      .from('item')
      .insert(itemToInsert)
      .select('*')
      .single();

  if (itemInsertionError) {
    return { insertedItem, error: itemInsertionError };
  }

  const { error: qrCodeUpdateError } = await associateQRCodeToItem(
    supabaseInstance,
    insertedItem.qrcode_id,
    insertedItem.id
  );

  if (qrCodeUpdateError) {
    return { insertedItem, error: qrCodeUpdateError };
  }

  return { insertedItem, error: null };
}

export async function listItems(supabaseInstance: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabaseInstance.auth.getUser();

  const { data, error } = await supabaseInstance
    .from('item')
    .select(
      `
            *,
            qrcode!qrcode_item_id_fkey (
                *
            )
        `
    )
    .eq('user_id', user.id);

  return { data, error };
}

export async function getItemFromQrCodeId(
  supabaseInstance: SupabaseClient<Database>,
  qrCodeId: string
) {
  const { data, error } = await supabaseInstance
    .from('item')
    .select(
      `
            *,
            qrcode!qrcode_item_id_fkey (
                *
            )
        `
    )
    .eq('qrcode_id', qrCodeId)
    .limit(1)
    .single();

  return { data, error };
}

export async function getItem(
  supabaseInstance: SupabaseClient<Database>,
  itemId: string
) {
  const {
    data: { user },
  } = await supabaseInstance.auth.getUser();

  const { data, error } = await supabaseInstance
    .from('item')
    .select(
      `
            *,
            qrcode!qrcode_item_id_fkey (
                *
            )
        `
    )
    .eq('id', itemId)
    .eq('user_id', user.id)
    .limit(1)
    .single();

  return { data, error };
}

export async function activateItem(
  supabaseInstance: SupabaseClient<Database>,
  itemId: string
) {
  const { data, error } = await supabaseInstance
    .from('item')
    .update({ activated: true })
    .eq('id', itemId)
    .select('*')
    .single();

  return { data, error };
}

export async function updateItem(
  supabaseInstance: SupabaseClient<Database>,
  itemId: string,
  item: Omit<
    Database['public']['Tables']['item']['Update'],
    'id' | 'created_at' | 'user_id' | 'activated'
  >
) {
  const { data, error } = await supabaseInstance
    .from('item')
    .update(item)
    .eq('id', itemId)
    .select('*')
    .single();

  return { data, error };
}
