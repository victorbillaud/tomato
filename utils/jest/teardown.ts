import { deleteFakeUser } from "../lib/supabase/fake";
import { getSupabase } from "../lib/supabase/services";

module.exports = async function (globalConfig, projectConfig) {
    await getSupabase().auth.signOut();
    await deleteFakeUser(globalThis.__SUPABASE_USER.id);
};