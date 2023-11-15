import { describe, test } from '@jest/globals';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { insertQRCode, listQRCode } from './services';

const sp = getSupabase();

describe('create qrcode object module', () => {
    test('insert qrcode object', async () => {
        const data = await signInFakeUser(sp);

        const qrCode = await insertQRCode(sp, {
            user_id: data.user.id,
        });

        // Assert each property of the object.
        expect(qrCode.id).toBeDefined();
        expect(qrCode.user_id).toBeDefined();
        expect(qrCode.barcode_data).toBeDefined();
    });

    test('list qrcode object', async () => {
        const data = await signInFakeUser(sp);

        await insertQRCode(sp, {
            user_id: data.user.id,
        });

        const qrCodeList = await listQRCode(sp);

        // Assert each property of the object.
        expect(qrCodeList).toBeDefined();
        expect(qrCodeList.length).toBeGreaterThan(0);

        await sp.auth.signOut();
    });
});
