import { createFakeUser, signInFakeUser } from "../lib/supabase/fake";
import { getSupabase } from "../lib/supabase/services";

module.exports = async function (globalConfig, projectConfig) {

    const sp = getSupabase();

    await createFakeUser(sp);
    const { user, session } = await signInFakeUser(sp);

    globalThis.__SUPABASE_USER = user;
    globalThis.__SUPABASE_SESSION = session;
}  
