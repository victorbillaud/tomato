import { deleteFakeUser } from "../supabase/fake";
import { getSupabase } from "../supabase/services";

module.exports = async function () {
    const sp = getSupabase();

    await sp.auth.signOut();
    await deleteFakeUser(sp, globalThis.__SUPABASE_USER.id);
};