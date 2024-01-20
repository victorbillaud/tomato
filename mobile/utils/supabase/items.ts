import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/supabase_types";

type ArrayElementType<T> = T extends (infer U)[] ? U : never
export type Item = ArrayElementType<Awaited<ReturnType<typeof fetchItems>>>
export type ItemInsert = Pick<
	Database['public']['Tables']['item']['Insert'],
	'name' | 'description' | 'qrcode_id' | 'activated'
>

export async function fetchItems(supabase: SupabaseClient<Database>) {
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error('No user found')
	const { data, error } = await supabase
		.from('item')
		.select(`*, qrcode!qrcode_item_id_fkey (*)`)
		.eq('user_id', user.id);
	if (error) throw error
	return data
}

export async function createItem(supabase: SupabaseClient<Database>, item: ItemInsert): Promise<Item> {
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) throw new Error('No user found')

	const { data, error } =
		await supabase
			.from('item')
			.insert({
				user_id: user.id,
				...item,
			})
			.select('*')
			.single()
	if (error) throw error

	await associateQRCodeToItem(supabase, data.qrcode_id!!, data.id)
	return data as Item
}

export async function associateQRCodeToItem(supabase: SupabaseClient<Database>, qrCodeId: string, itemId: string) {
	const { data, error } = await supabase
		.from('qrcode')
		.update({ item_id: itemId })
		.eq('id', qrCodeId)
		.select('*')
		.single()
	if (error) throw error
	return data
}
