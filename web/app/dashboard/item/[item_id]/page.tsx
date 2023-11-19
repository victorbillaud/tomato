import { Icon } from '@/components/common/icon';
import { TTagColor, Tag } from '@/components/common/tag';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { getItem } from '@utils/lib/item/services';
import { listScans } from '@utils/lib/scan/services';
import { Database } from '@utils/lib/supabase/supabase_types';
import dateFormat, { masks } from 'dateformat';
import { cookies } from 'next/headers';

export default async function ItemPage(props: { params: { item_id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: item, error } = await getItem(supabase, props.params.item_id);

  if (error) {
    throw error;
  }

  if (!item) {
    throw new Error('Item not found');
  }

  return (
    <div className='flex w-full flex-col items-center justify-start gap-5 p-2'>
      <div className='flex w-full flex-col items-center justify-start gap-3'>
        <div className={`flex w-full flex-row items-center justify-start`}>
          <Text variant='h3' weight={600}>
            {item.name}
          </Text>
        </div>
        <div className='items-top flex w-full flex-row justify-between py-1'>
          <div className='flex flex-col items-start justify-center'>
            <Text
              variant='overline'
              className='text-center capitalize opacity-40'
            >
              Description
            </Text>
            <Text
              variant='caption'
              weight={500}
              className='text-start opacity-70'
            >
              {item.description}
            </Text>
          </div>
        </div>
        <div className='items-top flex w-full flex-row justify-between py-1'>
          <div className='flex flex-col items-start justify-center'>
            <Text
              variant='overline'
              className='text-center capitalize opacity-40'
            >
              created at
            </Text>
            <Text
              variant='caption'
              weight={500}
              className='text-center opacity-70'
            >
              {dateFormat(item.created_at, masks.default)}
            </Text>
          </div>
        </div>
        {item.lost ? (
          <div className='-mb-2 flex w-full flex-row items-center justify-center gap-1 rounded-md bg-primary-600/80 p-2'>
            <Text
              variant='caption'
              weight={400}
              color='text-white/90'
              className='text-center'
            >
              Item lost
            </Text>
            <Icon name='alert' size={24} color='text-white/90' stroke={2} />
          </div>
        ) : !item.activated ? (
          <div className='-mb-2 flex w-full flex-row items-center justify-center gap-1 rounded-md bg-orange-500/80 p-2'>
            <Text
              variant='caption'
              weight={400}
              color='text-white/90'
              className='text-center'
            >
              Not activated
            </Text>
            <Icon
              name='discount-check-outline'
              size={24}
              color='text-white/90'
              stroke={2}
            />
          </div>
        ) : null}
      </div>
      {item.qrcode_id ? (
        <ItemScanHistory item={item} />
      ) : (
        <Text variant='caption' className='opacity-50'>
          No scan history
        </Text>
      )}
    </div>
  );
}

type TItemScanHistoryProps = {
  item: Database['public']['Tables']['item']['Row'];
};

async function ItemScanHistory(props: TItemScanHistoryProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // TODO: Find a way to show scans of item and related qrcode
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

interface IItemScanHistoryItemProps {
  scan: Database['public']['Tables']['scan']['Row'];
}

function ItemScanHistoryItem(props: IItemScanHistoryItemProps) {
  const tagsTypes: Record<Database['public']['Enums']['ScanType'], TTagColor> =
    {
      activation: 'green',
      creation: 'green',
      owner_scan: 'blue',
      registered_user_scan: 'orange',
      non_registered_user_scan: 'red',
    };

  const tagsLabels: Record<Database['public']['Enums']['ScanType'], string> = {
    activation: 'Activation',
    creation: 'Creation',
    owner_scan: 'Yours',
    registered_user_scan: 'Registered user',
    non_registered_user_scan: 'Anonymous user',
  };

  return (
    <div
      key={props.scan.id}
      className={`flex w-full flex-col items-center justify-start gap-3 p-2 md:flex-row`}
    >
      <div className='flex w-full flex-row items-center justify-start gap-3'>
        <Text variant='caption' weight={400}>
          {`${dateFormat(
            props.scan.created_at,
            masks.shortDate
          )} - ${dateFormat(props.scan.created_at, masks.shortTime)}`}
        </Text>
      </div>
      <div className='flex w-full flex-row items-center justify-start gap-1 md:justify-end'>
        {props.scan.type?.map((type) => (
          <Tag
            text={tagsLabels[type]}
            color={tagsTypes[type]}
            size='small'
            key={type}
          />
        ))}
      </div>
    </div>
  );
}
