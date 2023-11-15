import { deleteFakeUser } from "../lib/supabase/fake";
import { getSupabase } from "../lib/supabase/services";

module.exports = async function (globalConfig, projectConfig) {
    const sp = getSupabase();

    await sp.auth.signOut();
    await deleteFakeUser(sp, globalThis.__SUPABASE_USER.id);
};