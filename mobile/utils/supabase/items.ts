import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/supabase_types";

type ArrayElementType<T> = T extends (infer U)[] ? U : never;
export type Item = ArrayElementType<Awaited<ReturnType<typeof fetchItems>>>;

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