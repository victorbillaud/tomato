import { describe, test } from '@jest/globals';
import { getSupabase } from '../supabase/services';
import generateQRCode from './generator';

const sp = getSupabase();

describe('qrcode generator module', () => {
    test('insert item object', async () => {
        const urlToEncode = 'https://www.google.com';

        const qrCode = await generateQRCode(urlToEncode);

        expect(qrCode).toBeDefined();

        // Test if the QRCode is a valid image.
        expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });
});
