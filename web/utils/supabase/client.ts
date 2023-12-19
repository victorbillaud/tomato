import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@utils/lib/supabase/supabase_types';
import Cookies from 'js-cookie';

const existingCookie = Cookies.get('conversation_tokens');
const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {},
      global: {
        headers: {
          'conversation-tokens': Object.values(conversationTokens)
            .map((token: any) => token.token)
            .join(','),
        }
      },
      realtime: {
        headers: {
          'conversation-tokens': Object.values(conversationTokens)
            .map((token: any) => token.token)
            .join(','),
        }
      },
    }
  )

