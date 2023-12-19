'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '@utils/lib/supabase/supabase_types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type SignInResponseReturnType = {
  item: Database['public']['Tables']['item']['Row'];
  conversation: Database['public']['Tables']['conversation']['Row'];
};

type AnonymousResponseReturnType = {
  conversation_id: string;
  token: string;
};

type ResponseReturnType =
  | SignInResponseReturnType
  | AnonymousResponseReturnType;

export async function edgeFinderFlow(itemId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const existingCookie = cookieStore.get('conversation_tokens')?.value;
  const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
  const specificToken = conversationTokens[itemId]?.token;
  const token = (await supabase.auth.getSession()).data.session?.access_token;

  const response = await fetch(
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/handle_finder_flow`
      : 'http://127.0.0.1:54321/functions/v1/handle_finder_flow',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token ?? ''}`,
        'x-tomato-edge-token': process.env.TOMATO_EDGE_TOKEN ?? '',
        'x-tomato-conversation-token': specificToken ?? '',
      },
      body: JSON.stringify({
        item_id: itemId,
      }),
    }
  );

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data: ResponseReturnType = await response.json();

  if ('token' in data && 'conversation_id' in data) {
    conversationTokens[itemId] = {
      token: data.token,
      conversation_id: data.conversation_id,
    };

    cookies().set('conversation_tokens', JSON.stringify(conversationTokens), {
      path: '/',
    });

    redirect(`/chat/${data.conversation_id}?token=${data.token}`);
  } else {
    redirect(`/chat/${data.conversation.id}`);
  }
}
