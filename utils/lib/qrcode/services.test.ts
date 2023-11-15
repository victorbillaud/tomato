import { describe, test } from '@jest/globals';
import { signInFakeUser } from 'lib/supabase/fake';
import { insertQRCode } from './services';

describe('create qrcode object module', () => {
    test('insert qrcode object', async () => {
        const data = await signInFakeUser();

        const qrCode = await insertQRCode({
            user_id: data.user.id,
        });

        // Assert each property of the object.
        expect(qrCode.id).toBeDefined();
        expect(qrCode.user_id).toBeDefined();
        expect(qrCode.barcode_data).toBeDefined();
    });
});
