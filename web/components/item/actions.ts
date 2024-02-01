'use server';

import { createClient } from '@/utils/supabase/server';
import {
  deleteItem,
  updateItem,
  updateItemImage,
} from '@utils/lib/item/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleFormItemUpdate(itemId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const key = formData.get('key') as string;
  const value = formData.get('value') as string;

  const { data: item, error } = await updateItem(supabase, itemId, {
    [key]: value,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!item) {
    throw new Error('Item not found');
  }

  revalidatePath(`/dashboard/item/${item.id}`);
  redirect(`/dashboard/item/${item.id}`);
}

export async function handleDeleteItem(itemId: string) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: item, error } = await deleteItem(supabase, itemId);

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  revalidatePath(`/dashboard`);
  redirect(`/dashboard`);
}

export async function handleImageUpdate(
  itemId: string,
  oldImage: string,
  userId: string,
  formData: FormData
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const imageValue: File = formData.get('picture') as File;
  const { imagePath, error } = await updateItemImage(
    supabase,
    itemId,
    imageValue,
    oldImage,
    userId
  );

  if (error) {
    throw error;
  }

  revalidatePath(`/dashboard/item/${itemId}`);
  redirect(`/dashboard/item/${itemId}`);
}

export async function handleUpdate(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const itemId = formData.get('item_id') as string;
  const valueToChange = formData.get('value_to_change') as string;
  const value = formData.get('value') as string;

  const { data: item, error } = await updateItem(supabase, itemId, {
    [valueToChange]: value,
  });

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  revalidatePath(`/dashboard/item/${item.id}`);
  redirect(`/dashboard/item/${item.id}`);
}
