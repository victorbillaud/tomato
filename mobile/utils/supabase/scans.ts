import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/supabase_types";

type ArrayElementType<T> = T extends (infer U)[] ? U : never
export type Scan = ArrayElementType<Awaited<ReturnType<typeof fetchScans>>>

export async function fetchScans(supabase: SupabaseClient<Database>, itemId: string) {
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) throw new Error('No user found')
	const { data, error } = await supabase
		.from('scan')
		.select()
		.eq('item_id', itemId)
	if (error) throw error
	return data
}
