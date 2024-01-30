import { Button } from '@/components/common/button';
import { InputText } from '@/components/common/input';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import React from 'react';
import { getUserDetails } from '@utils/lib/user/services';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { WebHookBody } from '@/utils/discord/types';
import { env } from 'process';

const handleMessageSend = async (formData: FormData) => {
  'use server';

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Discord webhook url not found');
  }
  const name: string = formData.get('username') as string;
  const email: string = formData.get('email') as string;
  const title: string = formData.get('title') as string;
  const message: string = formData.get('message') as string;

  const webhookMessage: WebHookBody = {
    content: 'New message from the website',
    embeds: [
      {
        author: {
          name: name,
        },
        title: title,
        fields: [
          {
            name: 'Email',
            value: email,
          },
          {
            name: 'Message',
            value: message,
          },
        ],
      },
    ],
  };

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { user: tmp } = await getUserDetails(supabase, user?.id);
    if (tmp?.avatar_url) {
      webhookMessage.embeds![0].author!.icon_url = tmp.avatar_url;
    }
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhookMessage),
  });

  revalidatePath(`/`);
  redirect(`/`);
};

const ContactPage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let profile = null;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { user: tmp } = await getUserDetails(supabase, user?.id);
    profile = tmp;
  }

  return (
    <div className='mt-10 w-[80%] sm:w-[600px]'>
      <div className='flex flex-col gap-5 align-middle'>
        <h1 className='text-center text-5xl dark:text-gray-200'>Contact Us</h1>
        <h2 className='text-center text-lg dark:text-gray-200'>
          Ask us what you want
        </h2>
      </div>
      <form action={handleMessageSend} className='mt-6 flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <InputText
            name='username'
            placeholder='Name'
            defaultValue={profile?.username || ''}
            readOnly={!(profile === null || profile.username === null)}
            required
          />
          <InputText
            name='email'
            placeholder='Email*'
            defaultValue={user?.email || ''}
            readOnly={!(user === null || user.email === undefined)}
            required
          />
        </div>
        <InputText name='title' placeholder='Title*' required maxLength={50} />
        <textarea
          className='text-s text-black-100 dark:text-white-100 h-[200px] w-full resize-none rounded-md border border-zinc-200 bg-zinc-100 p-1 px-2 py-2 shadow-sm outline-none transition-all placeholder:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200 lg:text-sm xl:text-base'
          name='message'
          required
          placeholder='Message*'
          maxLength={500}
        />
        <Button variant='primary' text='Send' />
      </form>
    </div>
  );
};

export default ContactPage;
