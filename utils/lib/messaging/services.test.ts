import { describe, test } from '@jest/globals';
import { insertItem } from '../item/services';
import { insertQRCode } from '../qrcode/services';
import {
  createFakeUser,
  deleteFakeUser,
  signInFakeUser,
} from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import {
  insertConversation,
  insertMessage,
  listUserConversations,
  getConversationMessages,
} from './services';

const sp = getSupabase();

beforeAll(async () => {
  const { user: owner } = await signInFakeUser(sp);

  const { data: qrCode, error: insertQrCodeError } = await insertQRCode(sp, {
    user_id: owner.id,
  });

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

  globalThis.owner = owner;
  globalThis.insertedItem = insertedItem;
  globalThis.qrCode = qrCode;
});

afterAll(async () => {
  delete globalThis.insertedItem;
  delete globalThis.qrCode;

  sp.auth.signOut();
});

describe('service messaging module', () => {
  test('insertConversation', async () => {
    await signInFakeUser(sp);
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error } = await insertConversation(sp, {
      finder_id: finder.id,
      item_id: globalThis.insertedItem.id,
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
    await signInFakeUser(sp);
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

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
    await signInFakeUser(sp);
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

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
    await signInFakeUser(sp);
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

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
    await signInFakeUser(sp);
    const { user: finder } = await createFakeUser(sp, 'finder@example.com');

    const { insertedConversation, error: insertConversationError } =
      await insertConversation(sp, {
        finder_id: finder.id,
        item_id: globalThis.insertedItem.id,
      });

    if (insertConversationError) {
      throw insertConversationError;
    }

    await insertMessage(sp, {
      conversation_id: insertedConversation.id,
      content: 'test 1',
    });

    await insertMessage(sp, {
      conversation_id: insertedConversation.id,
      content: 'test 2',
    });

    const { messages, error } = await getConversationMessages(
      sp,
      insertedConversation.id
    );

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
});
