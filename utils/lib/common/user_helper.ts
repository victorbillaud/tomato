import { User, UserIdentity } from "@supabase/supabase-js";

export const getUserAvatarUrl = (user: User) => {

    const identity: UserIdentity = user.identities?.find(
        (identity: UserIdentity) => identity?.identity_data?.avatar_url
    );

    return identity?.identity_data?.avatar_url;
}
