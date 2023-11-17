'use client';

import { createClient } from '@/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { Button } from './common/button';

export default function AuthProviders() {
  const supabase = createClient();

  const getURL = () => {
    let url = window.location.hostname;

    if (url == 'localhost') {
      url = 'http://localhost:3000';
    }

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to include /auth/callback at the end.
    url = url.endsWith('/') ? `${url}auth/callback` : `${url}/auth/callback`;

    console.log(url);

    return url;
  };

  const handleProviderSignIn = async (provider: Provider) => {
    const redirectUrl = new URL(getURL());

    // Check if there is a redirectTo query param in the window location.
    const redirectTo = new URL(window.location.href).searchParams.get(
      'redirectTo'
    );

    // If there is a redirectTo query param, add it to the redirectUrl.
    if (redirectTo) {
      redirectUrl.searchParams.append('redirectTo', redirectTo);
    }

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl.href,
      },
    });
  };

  return (
    <div className='my-5 flex w-full flex-col items-center justify-between gap-4'>
      <Button
        onClick={() => handleProviderSignIn('google')}
        text='Sign with Google'
        variant='secondary'
        className='w-full'
        icon='google'
      />
      <Button
        onClick={() => handleProviderSignIn('discord')}
        text='Sign with Discord'
        variant='secondary'
        className='w-full'
        icon='discord'
      />
    </div>
  );
}
