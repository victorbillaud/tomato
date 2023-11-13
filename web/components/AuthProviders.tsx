'use client';

import { createClient } from '@/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { Button } from './common/button';

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
      <Button
        onClick={() => handleProviderSignIn('google')}
        text='Sign with Google'
        variant='secondary'
        className='w-full'
      />
      <Button
        onClick={() => handleProviderSignIn('discord')}
        text='Sign with Discord'
        variant='secondary'
        className='w-full'
      />
    </div>
  );
}
