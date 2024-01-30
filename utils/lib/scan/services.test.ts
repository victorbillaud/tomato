import { describe, test } from '@jest/globals';
import { insertItem } from '../item/services';
import { insertQRCode } from '../qrcode/services';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { deleteScan, insertScan, listScans } from './services';

const sp = getSupabase();

beforeAll(async () => {
  const { user } = await signInFakeUser(sp);
  sp.auth.signOut();

  const { data: qrCode, error: insertQrCodeError } = await insertQRCode(sp, {
    user_id: user.id,
  });

  await signInFakeUser(sp);

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

  globalThis.insertedItem = insertedItem;
  globalThis.qrCode = qrCode;
  globalThis.scansCreated = [];
});

afterAll(() => {
  delete globalThis.insertedItem;
  delete globalThis.qrCode;

  globalThis.scansCreated.forEach(async (scan) => {
    await deleteScan(sp, scan.id);
  });

  sp.auth.signOut();
});

describe('service scan module', () => {
  test('insert scan object for unknown user', async () => {
    sp.auth.signOut();

    const { data, error } = await insertScan(sp, {
      item_id: globalThis.insertedItem.id,
      qrcode_id: globalThis.qrCode.id,
    });

    if (error) {
      throw error;
    }

    // Assert each property of the object.
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    expect(data.user_id).toBeNull();
    expect(data.item_id).toBeDefined();
    expect(data.type).toContain('non_registered_user_scan');

    globalThis.scansCreated.push(data);
  });

  test('delete scan object', async () => {
    const { data: scan, error: insertScanError } = await insertScan(sp, {
      item_id: globalThis.insertedItem.id,
      qrcode_id: globalThis.qrCode.id,
    });

    if (insertScanError) {
      throw insertScanError;
    }

    const { error: deleteScanError } = await deleteScan(sp, scan.id);

    if (deleteScanError) {
      throw deleteScanError;
    }

    expect(deleteScanError).toBeNull();
  });

  test('insert scan object for known user', async () => {
    const data = await signInFakeUser(sp);

    const { data: scan, error: insertScanError } = await insertScan(sp, {
      item_id: globalThis.insertedItem.id,
      qrcode_id: globalThis.qrCode.id,
    });

    if (insertScanError) {
      throw insertScanError;
    }

    // Assert each property of the object.
    expect(scan).toBeDefined();
    expect(scan.id).toBeDefined();
    expect(scan.user_id).toBe(data.user.id);
    expect(scan.item_id).toBeDefined();
    expect(scan.type).toContain('registered_user_scan');

    globalThis.scansCreated.push(scan);
  });

  test('insert scan with array of types', async () => {
    await signInFakeUser(sp);

    const { data: scan, error: insertScanError } = await insertScan(sp, {
      item_id: globalThis.insertedItem.id,
      qrcode_id: globalThis.qrCode.id,
      type: ['creation', 'owner_scan'],
    });

    if (insertScanError) {
      throw insertScanError;
    }

    // Assert each property of the object.
    expect(scan).toBeDefined();
    expect(scan.id).toBeDefined();
    expect(scan.item_id).toBeDefined();
    expect(scan.type).toContain('creation');
    expect(scan.type).toContain('owner_scan');
    expect(scan.type).toContain('registered_user_scan');

    globalThis.scansCreated.push(scan);
  });

  test('insert scan with array of types with duplicates', async () => {
    await signInFakeUser(sp);

    const { data: scan, error: insertScanError } = await insertScan(sp, {
      item_id: globalThis.insertedItem.id,
      qrcode_id: globalThis.qrCode.id,
      type: ['creation', 'owner_scan', 'owner_scan'],
    });

    // Should raise an error.
    expect(insertScanError).toBeDefined();

    // Assert each property of the object.
    expect(scan).toBeNull();
  });

  test('insert scan with array of types with unknown user and registered user', async () => {
    await signInFakeUser(sp);

    const { data: scan, error: insertScanError } = await insertScan(sp, {
      item_id: globalThis.insertedItem.id,
      qrcode_id: globalThis.qrCode.id,
      type: ['creation', 'non_registered_user_scan'],
    });

    // Should raise an error.
    expect(insertScanError).toBeDefined();

    // Assert each property of the object.
    expect(scan).toBeNull();
  });

  test('list items scans', async () => {
    for (let i = 0; i < 3; i++) {
      await insertScan(sp, {
        item_id: globalThis.insertedItem.id,
        qrcode_id: globalThis.qrCode.id,
      });
    }

    const { data, error } = await listScans(sp, globalThis.insertedItem.id);

    if (error) {
      throw error;
    }

    // Assert each property of the object.
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);

    globalThis.scansCreated.push(...data);
  });

  test('list qrcode scans', async () => {
    for (let i = 0; i < 3; i++) {
      await insertScan(sp, {
        item_id: null,
        qrcode_id: globalThis.qrCode.id,
      });
    }

    const { data, error } = await listScans(sp, null, globalThis.qrCode.id);

    if (error) {
      throw error;
    }

    // Assert each property of the object.
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);

    globalThis.scansCreated.push(...data);
  });
});
