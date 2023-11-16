import { createFakeUser, signInFakeUser } from "../supabase/fake";
import { getSupabase } from "../supabase/services";


module.exports = async function () {

    const sp = getSupabase();

    await createFakeUser(sp);
    const { user, session } = await signInFakeUser(sp);

    globalThis.__SUPABASE_USER = user;
    globalThis.__SUPABASE_SESSION = session;
}  
