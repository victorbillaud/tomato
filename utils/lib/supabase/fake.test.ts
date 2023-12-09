import { describe, test } from '@jest/globals';
import { createFakeUser, deleteFakeUser, signInFakeUser } from './fake';
import { getSupabase } from './services';

const FAKE_USER_EMAIL = 'qwerty@test.fr';
const FAKE_USER_PASSWORD = 'qwerty';

const sp = getSupabase();

describe('supabase fake module', () => {
    test('create fake user', async () => {
        const data = await createFakeUser(sp, FAKE_USER_EMAIL, FAKE_USER_PASSWORD);

        expect(data.user).toBeDefined();

        await sp.auth.signOut();
        await deleteFakeUser(sp, data.user.id);
    });

    test('create fake user session', async () => {
        await createFakeUser(sp, FAKE_USER_EMAIL, FAKE_USER_PASSWORD);
        await signInFakeUser(sp, FAKE_USER_EMAIL, FAKE_USER_PASSWORD);
        const { data, error } = await sp.auth.getSession();

        expect(error).toBeNull();
        expect(data.session).toBeDefined();

        await sp.auth.signOut();
        await deleteFakeUser(sp, data.session.user.id);
    });

    test('delete fake user', async () => {
        const { user } = await createFakeUser(sp, FAKE_USER_EMAIL, FAKE_USER_PASSWORD);
        const deletedUser = await deleteFakeUser(sp, user.id);

        expect(deletedUser).toBeDefined();
    });
});
