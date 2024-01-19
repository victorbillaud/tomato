import { SupabaseClient } from '@supabase/supabase-js';
import * as uuid from 'uuid';
import { Database } from '../supabase/supabase_types';

export async function getUserDetails(
  supabaseInstance: SupabaseClient<Database>,
  userId: string
) {
  const { data: user, error } = await supabaseInstance
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { user, error };
}

export async function updateUserDetails(
  supabaseInstance: SupabaseClient<Database>,
  userId: string,
  updates: Record<string, unknown>
) {
  const { data: user, error } = await supabaseInstance
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  return { user, error };
}

export async function updateUserAvatar(
  supabaseInstance: SupabaseClient<Database>,
  image: File,
  oldImageId: string,
  userId: string
) {
  const imagePath =
    userId + '/' + uuid.v4() + image.type.replace('image/', '.');

  if (image.size === 0) {
    if (oldImageId !== '') {
      await supabaseInstance.storage
        .from('avatars')
        .remove([userId + '/' + oldImageId]);

      await supabaseInstance
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      return { imagePath: null, error: null };
    }
  }

  if (image.size < 100 || image.size > 5000001)
    return { imagePath: null, error: null };

  const { data, error } = await supabaseInstance.storage
    .from('avatars')
    .upload(imagePath, image);

  if (error) {
    return { imagePath: null, error: error };
  }

  const publicUrl = supabaseInstance.storage
    .from('avatars')
    .getPublicUrl(data.path).data.publicUrl;

  const { error: itemUpdateError } = await supabaseInstance
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (itemUpdateError) {
    await supabaseInstance.storage.from('avatars').remove([imagePath]);
    return { imagePath: null, error: itemUpdateError };
  }

  if (oldImageId !== '') {
    await supabaseInstance.storage
      .from('avatars')
      .remove([userId + '/' + oldImageId]);
  }

  return { imagePath: publicUrl, error: null };
}
