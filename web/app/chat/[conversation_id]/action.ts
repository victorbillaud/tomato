'use server';

import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleFinderRegistration(
  redirectUrl: string,
  formData: FormData
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const existingCookie = cookieStore.get('conversation_tokens')?.value;
  const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const email = formData.get('email') as string;

  if (!email) {
    return redirect(`${redirectUrl}?error=missing email`);
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/handle_finder_registration`
      : 'http://127.0.0.1:54321/functions/v1/handle_finder_registration',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
        }`,
        'x-tomato-edge-token': process.env.TOMATO_EDGE_TOKEN ?? '',
      },
      body: JSON.stringify({
        email,
        conversation_tokens: conversationTokens,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json();
    return redirect(`${redirectUrl}?error=${data.error}`);
  }

  const user = (await response.json()) as User;

  if (user) {
    const searchParams = new URLSearchParams();
    searchParams.append('email', email);
    searchParams.append('success', 'true');
    redirect(`${redirectUrl}?${searchParams.toString()}`);
  }
}
