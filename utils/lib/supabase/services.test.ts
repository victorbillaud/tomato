import { describe, expect, test } from '@jest/globals';
import { getSupabase } from '../../lib/supabase/services';

describe('supabase module', () => {
    test('supabase is defined', () => {
        const supabase = getSupabase();
        expect(supabase).toBeDefined();
    });
});