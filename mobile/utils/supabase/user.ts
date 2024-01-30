import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/utils/supabase/supabase_types"
import * as uuid from 'uuid'

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

export async function editUserAvatar(supabase: SupabaseClient, file: Blob, oldImageUrl: string, userId: string) {
	const imagePath = userId + '/' + uuid.v4() + file.type.replace('image/', '.')

	if (file.size === 0) {
		if (oldImageUrl !== '') {
			await supabase.storage
				.from('avatars')
				.remove([userId + '/' + oldImageUrl])

			await supabase.from('profiles')
				// @ts-ignore
				.update({ avatar_url: null })
				.eq('id', userId)
			return null
		}
	}

	if (file.size < 100 || file.size > 5000001)
		return null

	console.log('-------------------------')
	console.log('imagePath', imagePath)
	console.log('file', file)

	const { data, error } = await supabase.storage
		.from('avatars')
		.upload(imagePath, file, {
			contentType: file.type,
		})

	console.log('result', data, error)

	if (error) throw error

	const publicUrl = supabase.storage
		.from('avatars')
		.getPublicUrl(data.path)
		.data.publicUrl

	const { error: itemUpdateError } = await supabase
		.from('profiles')
		.update({ avatar_url: publicUrl })
		.eq('id', userId)

	if (itemUpdateError) {
		await supabase.storage.from('avatars').remove([imagePath])
		throw error
	}

	if (oldImageUrl !== '')
		await supabase.storage.from('avatars').remove([userId + '/' + oldImageUrl])

	return publicUrl
}
