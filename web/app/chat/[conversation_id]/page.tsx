import VerifyOTPForm from '@/components/auth/otp/VerifyOTPForm';
import Chat from '@/components/chat/Chat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { ChatSkeleton, InputSkeleton } from '@/components/chat/Skeletons';
import { DBItem, DBMessage } from '@/components/chat/types';
import { SubmitButton } from '@/components/common/button';
import { InputText } from '@/components/common/input';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import {
  getConversationItem,
  getMessages,
} from '@utils/lib/messaging/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { handleFinderRegistration } from './action';

export default async function Conversation({
  params,
  searchParams,
}: {
  params: { conversation_id: string };
  searchParams: { success: string; email: string; error: string };
}) {
  const cookieStore = cookies();
  const existingCookie = cookieStore.get('conversation_tokens')?.value;
  const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
  const specificToken: any = Object.values(conversationTokens).find(
    (token: any) => token.conversation_id === params.conversation_id
  );

  const supabase = createClient(cookieStore, {
    'conversation-tokens': Object.values(conversationTokens)
      .map((token: any) => token.token)
      .join(','),
  });

  const handleFinderRegistrationBindRedirection = handleFinderRegistration.bind(
    null,
    `/chat/${params.conversation_id}`
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { messages, error: messageError } = await getMessages(
    supabase,
    [params.conversation_id]
  );

  console.log(messages);

  if (messageError) {
    redirect('/chat');
  }

  const { item, error: itemError } = await getConversationItem(
    supabase,
    params.conversation_id
  );

  console.log(item);

  if (itemError) {
    console.error(itemError);
    return null;
  }

  if (!messages && !item) {
    return (
      <div className='flex h-full w-full flex-col justify-end overflow-hidden px-4 sm:w-2/3'>
        <ChatSkeleton />
        <InputSkeleton />
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col justify-start sm:w-2/3 sm:pl-2'>
      {specificToken?.token && (
        <div className='flex w-full flex-col gap-2 rounded-md border border-orange-300 bg-orange-200/60 p-2 shadow-sm dark:bg-orange-200/20'>
          <Text
            variant='caption'
            color='text-orange-500'
            className='text-center opacity-90'
          >
            {!searchParams.success && (
              <>
                You are currently seeing this conversation as a guest. To help
                the owner to find his item faster you can give us your email
                address so we can create an account for you and save your
                conversations.
              </>
            )}
          </Text>
          {!searchParams.success ? (
            <form
              action={handleFinderRegistrationBindRedirection}
              className='flex w-full flex-row gap-2'
            >
              <InputText
                icon='at'
                name='email'
                type='email'
                placeholder='Email'
                className='border-orange-300 bg-orange-200/60 dark:bg-orange-200/10'
              />
              <SubmitButton
                variant='tertiary'
                type='submit'
                text='Create an account'
                className='flex-1 text-orange-500'
              />
            </form>
          ) : (
            <>
              <Text
                variant='caption'
                color='text-orange-500'
                className='text-center opacity-90'
              >
                We sent you an email with a code to verify your email address.
              </Text>
              <VerifyOTPForm
                email={searchParams.email}
                clearConversationTokens
                buttonStyle='secondary'
              />
            </>
          )}
        </div>
      )}
      <ChatHeader currentUser={user as User} item={item as DBItem} />
      <div className='flex h-full flex-col justify-end gap-2 overflow-y-scroll px-3 sm:px-0'>
        <Chat
          conversationId={params.conversation_id}
          oldMessages={messages as DBMessage[]}
          currentUser={user as User}
        />
        <ChatInput conversationId={params.conversation_id} />
      </div>
    </div>
  );
}
