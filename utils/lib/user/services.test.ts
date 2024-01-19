import { describe, test } from '@jest/globals';
import {
  createFakeUser,
  deleteFakeUser,
  signInFakeUser,
} from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import {
  getPublicUserDetails,
  getUserDetails,
  updateUserDetails,
} from './services';

const sp = getSupabase();

beforeAll(async () => {
  await signInFakeUser(sp);
});

afterAll(async () => {
  sp.auth.signOut();
});

describe('user details module', () => {
  test('get public user details', async () => {
    const { user: testUser } = await createFakeUser(sp, 'test@example.com');

    const { user, error } = await getPublicUserDetails(sp, testUser.id);

    expect(error).toBeNull();
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', testUser.id);
    expect(user).not.toHaveProperty('email_notifications_field');

    sp.auth.signOut();
    await deleteFakeUser(sp, testUser.id);
  });

  test('update user details', async () => {
    await createFakeUser(sp, 'test@example.com');
    const { user } = await signInFakeUser(sp,'test@example.com');

    const { user: updatedUser, error } = await updateUserDetails(sp, user.id, {
      email_notifications: true,
      message_notifications: true,
      full_name: 'test',
      username: 'test',
      phone: 'test',
    });

    expect(error).toBeNull();
    expect(updatedUser).toBeDefined();
    expect(updatedUser).toHaveProperty('id', user.id);
    expect(updatedUser).toHaveProperty('email_notifications', true);
    expect(updatedUser).toHaveProperty('message_notifications', true);
    expect(updatedUser).toHaveProperty('full_name', 'test');
    expect(updatedUser).toHaveProperty('username', 'test');
    expect(updatedUser).toHaveProperty('phone', 'test');

    sp.auth.signOut();
    await deleteFakeUser(sp, user.id);
  });

  test('get user details', async () => {
    await createFakeUser(sp, 'test@example.com')
    const { user } = await signInFakeUser(sp, 'test@example.com');

    const { error: updateError } = await updateUserDetails(sp, user.id, {
      email_notifications: true,
      message_notifications: true,
      full_name: 'test',
      username: 'test',
      phone: 'test',
    });

    expect(updateError).toBeNull();

    const { user: userDetails, error } = await getUserDetails(sp, user.id);

    expect(error).toBeNull();
    expect(userDetails).toBeDefined();
    expect(userDetails).toHaveProperty('id', user.id);
    expect(userDetails).toHaveProperty('email_notifications', true);
    expect(userDetails).toHaveProperty('message_notifications', true);
    expect(userDetails).toHaveProperty('full_name', 'test');
    expect(userDetails).toHaveProperty('username', 'test');
    expect(userDetails).toHaveProperty('phone', 'test');

    sp.auth.signOut();
    await deleteFakeUser(sp, user.id);
  });

  test('get user details without the right permissions', async () => {
    // Create a user and sign in.
    await createFakeUser(sp, 'test@example.com')
    const { user: userTest } = await signInFakeUser(sp, 'test@example.com');

    // Sign in with another user to make the request
    sp.auth.signOut();
    await signInFakeUser(sp);

    // Create a new user.
    const { error } = await getUserDetails(sp, userTest.id);

    expect(error).toBeDefined();

    sp.auth.signOut();
    await deleteFakeUser(sp, userTest.id);
  });
});
