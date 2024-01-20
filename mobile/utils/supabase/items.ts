import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/supabase_types";
import { editQRCode } from "@/utils/supabase/qrcodes";

type ArrayElementType<T> = T extends (infer U)[] ? U : never
export type Item = ArrayElementType<Awaited<ReturnType<typeof fetchItems>>>
export type ItemInsert = Pick<Database['public']['Tables']['item']['Insert'], 'name' | 'description' | 'qrcode_id' | 'activated'>
export type ItemUpdate = Omit<Database['public']['Tables']['item']['Update'], 'id'>

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

	await editQRCode(supabase, data.qrcode_id!!, {
		item_id: data.id,
	})

	return data as Item
}

export async function editItem(supabase: SupabaseClient<Database>, itemId: string, update: ItemUpdate) {
	const { data, error } = await supabase
		.from('item')
		.update(update)
		.eq('id', itemId)
		.select('*')
		.single()
	if (error) throw error
	return data as Item
}
