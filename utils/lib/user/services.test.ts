import { describe, test } from '@jest/globals';
import {
  signInFakeUser,
  createFakeUser,
  deleteFakeUser,
} from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { getUserDetails } from './services';

const sp = getSupabase();

beforeAll(async () => {
  await signInFakeUser(sp);
});

afterAll(async () => {
  sp.auth.signOut();
});

describe('user details module', () => {
  test('get user details', async () => {
    const { user: testUser } = await createFakeUser(sp, 'test@example.com');

    const { user, error } = await getUserDetails(sp, testUser.id);

    expect(error).toBeNull();
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', testUser.id);
    expect(user).toHaveProperty('email', 'test@example.com');

    await deleteFakeUser(sp, testUser.id);
    const deletedUser = await sp
      .from('user')
      .delete()
      .eq('id', testUser.id)
      .select('*')
      .single();
    expect(deletedUser.data).toBeDefined();
  });

  test('get user details with invalid user ID', async () => {
    const { user, error } = await getUserDetails(sp, 'invalidUserId');

    expect(error).toBeDefined();
    expect(error).toHaveProperty('message');
    expect(error.message).toBeDefined();

    expect(user).toBeNull();
  });
});
