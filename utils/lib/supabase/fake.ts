import { FAKE_USER_EMAIL, FAKE_USER_PASSWORD } from "../../lib/constant";
import { getSupabase } from "./services";

export async function createFakeUser(
    email: string = FAKE_USER_EMAIL,
    password: string = FAKE_USER_PASSWORD,
) {
    const { data, error } = await getSupabase().auth.admin.createUser({
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
    email: string = FAKE_USER_EMAIL,
    password: string = FAKE_USER_PASSWORD
) {
    const { data, error } = await getSupabase().auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteFakeUser(id: string) {
    const { data, error } = await getSupabase().auth.admin.deleteUser(id)

    if (error) {
        throw error;
    }

    return data;
}



