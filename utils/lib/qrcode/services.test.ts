import { describe, test } from '@jest/globals';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { getQRCode, insertQRCode, listQRCode } from './services';

const sp = getSupabase();

describe('qrcode service module', () => {
    test('insert qrcode object', async () => {
        const data = await signInFakeUser(sp);

        const { data: qrCode, error } = await insertQRCode(sp, {
            user_id: data.user.id,
        });

        expect(error).toBeNull();

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

        const { data: qrCodeList, error } = await listQRCode(sp);

        expect(error).toBeNull();

        // Assert each property of the object.
        expect(qrCodeList).toBeDefined();
        expect(qrCodeList.length).toBeGreaterThan(0);

        await sp.auth.signOut();
    });

    test('get qrcode object', async () => {
        const data = await signInFakeUser(sp);

        const { data: qrCode } = await insertQRCode(sp, {
            user_id: data.user.id,
        });

        const { data: qrCodeObject, error } = await getQRCode(sp, qrCode.id);

        expect(error).toBeNull();

        // Assert each property of the object.
        expect(qrCodeObject).toBeDefined();
        expect(qrCodeObject.id).toBe(qrCode.id);
        expect(qrCodeObject.user_id).toBe(qrCode.user_id);
        expect(qrCodeObject.barcode_data).toBe(qrCode.barcode_data);

        await sp.auth.signOut();
    });

});
