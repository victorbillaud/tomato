import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  return (
    <div className='animate-in flex w-full flex-col gap-5 px-3 opacity-0'>
      <Text variant={'h1'} className='text-center'>
        Tomato
      </Text>

      {data.user && (
        <Text variant={'caption'} className='text-center'>
          Hey, {data.user?.email}!
        </Text>
      )}
      <StyledLink href={'/ui'} text='UI/Theme' variant='primary' />
    </div>
  );
}
