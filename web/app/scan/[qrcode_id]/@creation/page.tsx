import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Scan({
  params,
}: {
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-20'>
      <Text variant='body' className='text-center opacity-50'>
        This is the <strong>Creation</strong> page
      </Text>
    </div>
  );
}
