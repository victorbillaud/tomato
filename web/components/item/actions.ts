'use server';

import { createClient } from "@/utils/supabase/server";
import { updateItem } from "@utils/lib/item/services";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
