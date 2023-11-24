import { describe, test } from '@jest/globals';
import { insertItem } from '../item/services';
import { insertQRCode } from '../qrcode/services';
import { createFakeUser, deleteFakeUser, signInFakeUser } from '../supabase/fake';
import { getSupabase } from '../supabase/services';
import { insertConversation, insertMessage } from './services';

const sp = getSupabase();

beforeAll(async () => {
    const { user: owner } = await signInFakeUser(sp);

    const { data: qrCode, error: insertQrCodeError } = await insertQRCode(sp, {
        user_id: owner.id,
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

    globalThis.owner = owner;
    globalThis.insertedItem = insertedItem;
    globalThis.qrCode = qrCode;
});

afterAll(async () => {
    delete globalThis.insertedItem;
    delete globalThis.qrCode;

    sp.auth.signOut();
});


describe('service messaging module', () => {
    test('insertConversation', async () => {
        const { user: finder } = await createFakeUser(sp, "finder@example.com");

        const { insertedConversation, error } = await insertConversation(sp, {
            finder_id: finder.id,
            item_id: globalThis.insertedItem.id,
        });

        expect(error).toBeNull();
        expect(insertedConversation).toBeDefined();
        expect(insertedConversation).toHaveProperty('id');
        expect(insertedConversation).toHaveProperty('finder_id');
        expect(insertedConversation.finder_id).toBe(finder.id);

        await deleteFakeUser(sp, finder.id);
        sp.from('conversation').delete().eq('id', insertedConversation.id);
    });

    test('insert message into conversation', async () => {
        const { user: finder } = await createFakeUser(sp, "finder@example.com");

        const { insertedConversation, error: insertConversationError } = await insertConversation(sp, {
            finder_id: finder.id,
            item_id: globalThis.insertedItem.id,
        });

        if (insertConversationError) {
            throw insertConversationError;
        }

        const { insertedMessage, error: insertMessageError } = await insertMessage(sp, {
            conversation_id: insertedConversation.id,
            content: 'test',
        });

        expect(insertMessageError).toBeNull();
        
        expect(insertedMessage).toBeDefined();
        expect(insertedMessage).toHaveProperty('id');
        expect(insertedMessage).toHaveProperty('conversation_id');
        expect(insertedMessage).toHaveProperty('content');

        await deleteFakeUser(sp, finder.id);
        sp.from('conversation').delete().eq('id', insertedConversation.id);
    });
});