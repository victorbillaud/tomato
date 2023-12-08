import VerifyOTPForm from '@/components/auth/otp/VerifyOTPForm';
import { SubmitButton } from '@/components/common/button';
import { InputText } from '@/components/common/input';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
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
    'conversation-token': specificToken?.token,
  });

  const { data, error } = await supabase
    .from('conversation')
    .select('*')
    .eq('id', params.conversation_id)
    .single();

  const handleFinderRegistrationBindRedirection = handleFinderRegistration.bind(
    null,
    `/chat/${params.conversation_id}`
  );

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-start gap-20'>
      {specificToken?.token && (
        <div className='flex w-full flex-col gap-2 rounded-md border border-orange-300 bg-orange-200/60 p-2 shadow-sm'>
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
                className='border-orange-300 bg-orange-200/60'
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
      <Text variant='h4' className='text-center opacity-90'>
        How it seems you found an item... {params.conversation_id}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Text>
    </div>
  );
}
