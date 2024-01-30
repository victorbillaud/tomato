import { afterEach, describe, test } from '@jest/globals';
import { insertItem } from '../item/services';
import { insertQRCode } from '../qrcode/services';
import {
  createFakeUser,
  deleteFakeUser,
  signInFakeUser,
} from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import {
  getConversation,
  getMessages,
  insertConversation,
  insertMessage,
  listUserConversations,
} from './services';

const sp = getSupabase();

beforeAll(async () => {
  const { user } = await signInFakeUser(sp);
  sp.auth.signOut();

  const { data: qrCode, error: insertQrCodeError } = await insertQRCode(sp, {
    user_id: user.id,
  });

  const { user: owner } = await signInFakeUser(sp);

  const { insertedItem, error: insertItemError } = await insertItem(sp, {
    name: 'test',
    description: 'test',
    qrcode_id: qrCode.id,
  });

  if (insertQrCodeError) {
    throw insertQrCodeError;
  }

  if (insertItemError) {
    throw insertItemError;
  }

  sp.auth.signOut();

  globalThis.owner = owner;
  globalThis.insertedItem = insertedItem;
  globalThis.qrCode = qrCode;
});

afterAll(async () => {
  delete globalThis.insertedItem;
  delete globalThis.qrCode;

  sp.auth.signOut();
});

afterEach(async () => {
  await sp.auth.signOut();
});

describe('service messaging module', () => {
  test('insertConversation', async () => {
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error } = await insertConversation(sp, {
      finder_id: finder.id,
      item_id: globalThis.insertedItem.id,
      owner_id: globalThis.owner.id,
    });

    expect(error).toBeNull();
    expect(insertedConversation).toBeDefined();
    expect(insertedConversation).toHaveProperty('id');
    expect(insertedConversation).toHaveProperty('finder_id');
    expect(insertedConversation.finder_id).toBe(finder.id);

    await sp.auth.signOut();
    await deleteFakeUser(sp, finder.id);
    const deletedConversation = await sp
      .from('conversation')
      .delete()
      .eq('id', insertedConversation.id)
      .select('*')
      .single();
    expect(deletedConversation.data).toBeDefined();
  });

  test('insert message into conversation', async () => {
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
        owner_id: globalThis.owner.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }
    await signInFakeUser(sp);

    const { insertedMessage, error: insertMessageError } = await insertMessage(
      sp,
      {
        conversation_id: insertedConversation.id,
        content: 'test',
      }
    );

    expect(insertMessageError).toBeNull();

    expect(insertedMessage).toBeDefined();
    expect(insertedMessage).toHaveProperty('id');
    expect(insertedMessage).toHaveProperty('conversation_id');
    expect(insertedMessage).toHaveProperty('content');

    await sp.auth.signOut();
    await deleteFakeUser(sp, finder.id);
    const deletedConversation = await sp
      .from('conversation')
      .delete()
      .eq('id', insertedConversation.id)
      .select('*')
      .single();
    expect(deletedConversation.data).toBeDefined();
  });

  test('insert message into conversation with invalid conversation id', async () => {
    await signInFakeUser(sp);
    const { insertedMessage, error } = await insertMessage(sp, {
      conversation_id: 'invalid',
      content: 'test',
    });

    expect(error).toBeDefined();
    expect(error).toHaveProperty('message');
    expect(error.message).toBeDefined();

    expect(insertedMessage).toBeNull();
  });

  test('list user conversations', async () => {
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');
    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
        owner_id: globalThis.owner.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

    await signInFakeUser(sp);

    await insertMessage(sp, {
      conversation_id: insertedConversation.id,
      content: 'test 1',
    });

    await insertMessage(sp, {
      conversation_id: insertedConversation.id,
      content: 'test 2',
    });

    const { data, error } = await listUserConversations(sp);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data).toHaveLength(1);
    expect(data[0]).toHaveProperty('owner_id');
    expect(data[0]).toHaveProperty('finder_id');
    expect(data[0]).toHaveProperty('item_id');
    expect(data[0].last_message).toBeInstanceOf(Object);

    await sp.auth.signOut();
    await deleteFakeUser(sp, finder.id);
    const deletedConversation = await sp
      .from('conversation')
      .delete()
      .eq('id', insertedConversation.id)
      .select('*')
      .single();
    expect(deletedConversation.data).toBeDefined();
  });

  test('list user conversations without last message', async () => {
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
        owner_id: globalThis.owner.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

    await signInFakeUser(sp);

    const { data, error } = await listUserConversations(sp);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data).toHaveLength(1);
    expect(data[0]).toHaveProperty('owner_id');
    expect(data[0]).toHaveProperty('finder_id');
    expect(data[0]).toHaveProperty('item_id');
    expect(data[0].last_message).toBeNull();

    await sp.auth.signOut();
    await deleteFakeUser(sp, finder.id);
    const deletedConversation = await sp
      .from('conversation')
      .delete()
      .eq('id', insertedConversation.id)
      .select('*')
      .single();
    expect(deletedConversation.data).toBeDefined();
  });

  test('get conversation messages', async () => {
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
        owner_id: globalThis.owner.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

    await signInFakeUser(sp);

    await insertMessage(sp, {
      conversation_id: insertedConversation.id,
      content: 'test 1',
    });

    await insertMessage(sp, {
      conversation_id: insertedConversation.id,
      content: 'test 2',
    });

    const { messages, error } = await getMessages(sp, [
      insertedConversation.id,
    ]);

    expect(error).toBeNull();
    expect(messages).toBeDefined();
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveProperty('id');
    expect(messages[0]).toHaveProperty('content', 'test 1');
    expect(messages[0]).toHaveProperty('sender_id');
    expect(messages[1]).toHaveProperty('id');
    expect(messages[1]).toHaveProperty('content', 'test 2');
    expect(messages[1]).toHaveProperty('sender_id');

    await sp.auth.signOut();
    await deleteFakeUser(sp, finder.id);
    const deletedConversation = await sp
      .from('conversation')
      .delete()
      .eq('id', insertedConversation.id)
      .select('*')
      .single();
    expect(deletedConversation.data).toBeDefined();
  });

  test('get conversation by id', async () => {
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');
    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
        owner_id: globalThis.owner.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

    await signInFakeUser(sp);

    const { conversation, error } = await getConversation(
      sp,
      insertedConversation.id
    );

    expect(error).toBeNull();
    expect(conversation).toBeDefined();
    expect(conversation).toHaveProperty('id');
    expect(conversation).toHaveProperty('finder_id');
    expect(conversation).toHaveProperty('item_id');
    expect(conversation).toHaveProperty('owner_id');

    await sp.auth.signOut();
    await deleteFakeUser(sp, finder.id);
    const deletedConversation = await sp
      .from('conversation')
      .delete()
      .eq('id', insertedConversation.id)
      .select('*')
      .single();
    expect(deletedConversation.data).toBeDefined();
  });
});
