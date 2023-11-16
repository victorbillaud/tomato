import { describe, test } from '@jest/globals';
import { insertQRCode } from '../qrcode/services';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { insertItem, listItems } from './services';

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
});
