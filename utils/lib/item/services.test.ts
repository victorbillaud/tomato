import { describe, test } from '@jest/globals';
import { insertQRCode } from '../qrcode/services';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { activateItem, getItem, getItemFromQrCodeId, insertItem, listItems, updateItem } from './services';

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

    test("update item", async () => {
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
});
