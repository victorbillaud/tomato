import { describe, test } from '@jest/globals';
import { FAKE_LOCATION_COORDINATES } from '../constant';
import { insertItem } from '../item/services';
import { insertQRCode } from '../qrcode/services';
import { signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { deleteScan, insertScan } from './services';

const sp = getSupabase();

beforeAll(async () => {
    const data = await signInFakeUser(sp);

    const { data: qrCode, error: insertQrCodeError } = await insertQRCode(sp, {
        user_id: data.user.id,
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
            location: `POINT(${FAKE_LOCATION_COORDINATES.latitude} ${FAKE_LOCATION_COORDINATES.longitude})`,
        });

        if (error) {
            throw error;
        }

        // Assert each property of the object.
        expect(data).toBeDefined();
        expect(data.id).toBeDefined();
        expect(data.user_id).toBeNull();
        expect(data.item_id).toBeDefined();

        globalThis.scansCreated.push(data);
    });

    test('delete scan object', async () => {
        const { data: scan, error: insertScanError } = await insertScan(sp, {
            item_id: globalThis.insertedItem.id,
            qrcode_id: globalThis.qrCode.id,
            location: `POINT(${FAKE_LOCATION_COORDINATES.latitude} ${FAKE_LOCATION_COORDINATES.longitude})`,
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
            location: `POINT(${FAKE_LOCATION_COORDINATES.latitude} ${FAKE_LOCATION_COORDINATES.longitude})`,
        });

        if (insertScanError) {
            throw insertScanError;
        }

        // Assert each property of the object.
        expect(scan).toBeDefined();
        expect(scan.id).toBeDefined();
        expect(scan.user_id).toBe(data.user.id);
        expect(scan.item_id).toBeDefined();

        globalThis.scansCreated.push(scan);
    });
});
