import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  return (
    <div className='animate-in flex flex-1 flex-col items-center justify-center gap-5 px-3 opacity-0'>
      <Text variant={'h1'} className='text-center opacity-50'>
        404
      </Text>
      <Text variant={'body'} className='text-center opacity-50'>
        Eh you found me! This page is not implemented yet.
      </Text>

      <StyledLink href={'/'} text='Go back to home' variant='primary' />
    </div>
  );
}
