import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/supabase_types";

export type UserProfile = Awaited<ReturnType<typeof fetchProfile>>
export type UserProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function fetchProfile(supabase: SupabaseClient<Database>) {
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) throw new Error('No user found')
	const { data, error } = await supabase
		.from('profiles')
		.select()
		.eq('id', user.id)
		.single()
	if (error) throw error
	return data
}

export async function editProfile(supabase: SupabaseClient<Database>, update: UserProfileUpdate) {
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) throw new Error('No user found')
	const { data, error } = await supabase
		.from('profiles')
		.update(update)
		.eq('id', user.id)
		.select()
		.single()
	if (error) throw error
	return data as UserProfile
}
