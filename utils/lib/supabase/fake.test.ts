import { describe, test } from '@jest/globals';
import { createFakeUser, deleteFakeUser, signInFakeUser } from './fake';
import { getSupabase } from './services';

const FAKE_USER_EMAIL = 'qwerty@test.fr';
const FAKE_USER_PASSWORD = 'qwerty';

describe('supabase fake module', () => {

    test('create fake user', async () => {
        const data = await createFakeUser(FAKE_USER_EMAIL, FAKE_USER_PASSWORD);

        expect(data.user).toBeDefined();

        await getSupabase().auth.signOut();
        await deleteFakeUser(data.user.id);
    });

    test('create fake user session', async () => {
        await createFakeUser(FAKE_USER_EMAIL, FAKE_USER_PASSWORD);
        await signInFakeUser(FAKE_USER_EMAIL, FAKE_USER_PASSWORD);
        const { data, error } = await getSupabase().auth.getSession();

        expect(error).toBeNull();
        expect(data.session).toBeDefined();

        await getSupabase().auth.signOut();
        await deleteFakeUser(data.session.user.id);
    });
});
