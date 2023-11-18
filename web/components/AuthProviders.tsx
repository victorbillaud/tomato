import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from './common/button';

export default function AuthProviders() {
  const handleProviderLogin = async (formData: FormData) => {
    'use server';

    const referer = new URL(headers().get('referer') as string);
    const provider = formData.get('provider') as Provider;
    const next = referer.searchParams.get('next');

    if (!provider) {
      return;
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: next
          ? `${referer.origin}/auth/callback?next=${next}`
          : `${referer.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    return redirect(data.url);
  };

  return (
    <div className='my-5 flex w-full flex-col items-center justify-between gap-4'>
      <form className='w-full' action={handleProviderLogin}>
        <input type='hidden' name='provider' value='google' />
        <Button
          type='submit'
          text='Sign with Google'
          variant='secondary'
          className='w-full'
          icon='google'
        />
      </form>

      <form className='w-full' action={handleProviderLogin}>
        <input type='hidden' name='provider' value='discord' />
        <Button
          type='submit'
          text='Sign with Discord'
          variant='secondary'
          className='w-full'
          icon='discord'
        />
      </form>
    </div>
  );
}
