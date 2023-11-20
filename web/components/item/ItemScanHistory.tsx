import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { listScans } from '@utils/lib/scan/services';
import { cookies } from 'next/headers';
import { ItemScanHistoryItem } from './ItemScanHistoryItem';
import { TItemScanHistoryProps } from './types';


export async function ItemScanHistory(props: TItemScanHistoryProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: scans, error } = await listScans(
    supabase,
    undefined,
    props.item.qrcode_id || undefined
  );

  if (error) {
    throw error;
  }

  if (!scans) {
    throw new Error('Scans not found');
  }

  return (
    <div className='flex w-full flex-col items-center justify-start gap-3'>
      <div className={`flex w-full flex-row items-center justify-between`}>
        <Text variant='body' weight={600}>
          Scans history
        </Text>
      </div>
      {scans.length > 0 ? (
        <div className='w-full divide-y divide-stone-300 rounded-md border border-stone-300 dark:divide-stone-700 dark:border-stone-700'>
          {scans.map((scan) => (
            <ItemScanHistoryItem scan={scan} key={scan.id} />
          ))}
        </div>
      ) : (
        <Text variant='caption' className='opacity-50'>
          This item has not been scanned yet
        </Text>
      )}
    </div>
  );
}
