'use client';

import { createClient } from '@/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';

export default function AuthProviders() {
  const supabase = createClient();

  const handleProviderSignIn = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
  };

  return (
    <div className='my-10 flex w-full flex-col items-center justify-between gap-4'>
      <button
        onClick={() => handleProviderSignIn('google')}
        className='flex w-full justify-center rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      >
        Sign with Google
      </button>
      <button
        onClick={() => handleProviderSignIn('discord')}
        className='flex w-full justify-center rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      >
        Sign with Discord
      </button>
    </div>
  );
}
