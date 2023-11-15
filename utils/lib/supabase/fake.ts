import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase_types";
import { FAKE_USER_EMAIL, FAKE_USER_PASSWORD } from "../../lib/constant";

export async function createFakeUser(
    supabaseInstance: SupabaseClient<Database>,
    email: string = FAKE_USER_EMAIL,
    password: string = FAKE_USER_PASSWORD,
) {
    const { data, error } = await supabaseInstance.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
    })

    if (error) {
        throw error;
    }

    return data;
}

export async function signInFakeUser(
    supabaseInstance: SupabaseClient<Database>,
    email: string = FAKE_USER_EMAIL,
    password: string = FAKE_USER_PASSWORD
) {
    const { data, error } = await supabaseInstance.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteFakeUser(supabaseInstance: SupabaseClient<Database>, id: string) {
    const { data, error } = await supabaseInstance.auth.admin.deleteUser(id)

    if (error) {
        throw error;
    }

    return data;
}



