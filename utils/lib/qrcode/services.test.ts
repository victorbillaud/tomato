import { describe, test } from '@jest/globals';
import { signInFakeUser } from 'lib/supabase/fake';
import { getSupabase } from 'lib/supabase/services';
import { insertQRCode } from './services';

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
});
