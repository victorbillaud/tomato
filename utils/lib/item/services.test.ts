import { describe, test } from '@jest/globals';
import { File } from '@web-std/file';
import { readFileSync } from 'fs';
import { insertQRCode } from '../qrcode/services';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import {
  activateItem,
  deleteItem,
  getItem,
  getItemFromQrCodeId,
  insertItem,
  listItems,
  updateItem,
  updateItemImage,
} from './services';

const sp = getSupabase();

describe('service item module', () => {
  test('insert item object', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem, error } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    expect(error).toBeNull();

    // Assert each property of the object.
    expect(insertedItem).toBeDefined();
    expect(insertedItem.id).toBeDefined();
    expect(insertedItem.user_id).toBeDefined();
    expect(insertedItem.name).toBeDefined();
    expect(insertedItem.description).toBeDefined();
  });

  test('list item object', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    const { data: items, error } = await listItems(sp);

    expect(error).toBeNull();

    // Assert each property of the object.
    expect(items).toBeDefined();
    expect(items.length).toBeGreaterThan(0);
  });

  test('get item from qrcode id', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    const { data: item, error } = await getItemFromQrCodeId(sp, qrCode.id);

    expect(error).toBeNull();

    // Assert each property of the object.
    expect(item).toBeDefined();
    expect(item.id).toBe(insertedItem.id);
    expect(item.user_id).toBe(insertedItem.user_id);
    expect(item.name).toBe(insertedItem.name);
    expect(item.description).toBe(insertedItem.description);
  });

  test('get item from qrcode id with no item', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { data: item, error } = await getItemFromQrCodeId(sp, qrCode.id);

    expect(error).toBeDefined();

    expect(item).toBeNull();
  });

  test('get item from id', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    const { data: item, error } = await getItem(sp, insertedItem.id);

    expect(error).toBeNull();

    // Assert each property of the object.
    expect(item).toBeDefined();
    expect(item.id).toBe(insertedItem.id);
    expect(item.user_id).toBe(insertedItem.user_id);
    expect(item.name).toBe(insertedItem.name);
    expect(item.description).toBe(insertedItem.description);
  });

  test('activate item', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    expect(insertedItem.activated).toBe(false);

    const { data: item, error } = await activateItem(sp, insertedItem.id);

    if (error) {
      throw error;
    }

    expect(item.activated).toBe(true);
  });

  test('update item', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    expect(insertedItem.activated).toBe(false);

    const { data: item, error } = await updateItem(sp, insertedItem.id, {
      name: 'test2',
      description: 'test2',
      lost: true,
      lost_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    expect(item.name).toBe('test2');
    expect(item.description).toBe('test2');
    expect(item.lost).toBe(true);
    expect(item.lost_at).toBeDefined();
  });

  test('add item picture', async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });
    const fileContent = readFileSync('./assets/test.jpg');
    const fileObject = new File([fileContent], 'test.png', {
      type: 'image/png',
    });

    const { imagePath: imagePath1, error: error1 } = await updateItemImage(
      sp,
      insertedItem.id,
      fileObject,
      '',
      data.user.id
    );

    if (error1) {
      throw error1;
    }

    expect(imagePath1).toBeDefined();

    const { imagePath: imagePath2, error: error2 } = await updateItemImage(
      sp,
      insertedItem.id,
      fileObject,
      '',
      data.user.id
    );

    if (error2) {
      throw error2;
    }

    expect(imagePath2).toBeDefined();
    expect(imagePath1).not.toBe(imagePath2);
  });

  test("delete item", async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode } = await insertQRCode(sp, {
      user_id: data.user.id,
    });

    const { insertedItem } = await insertItem(sp, {
      name: 'test',
      description: 'test',
      qrcode_id: qrCode.id,
    });

    const { error: error2 } = await deleteItem(sp, insertedItem.id);

    expect(error2).toBeNull();

    const { data: item2, error: error3 } = await getItem(sp, insertedItem.id);

    expect(error3).toBeDefined();
    expect(item2).toBeNull();
  });
});
