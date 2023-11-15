import { createFakeUser, signInFakeUser } from "../lib/supabase/fake";

module.exports = async function (globalConfig, projectConfig) {
    await createFakeUser();
    const { user, session } = await signInFakeUser();

    globalThis.__SUPABASE_USER = user;
    globalThis.__SUPABASE_SESSION = session;
}  
