import { Database } from '@utils/lib/supabase/supabase_types';
import dateFormat, { masks } from 'dateformat';
import { TTagColor, Tag } from '../common/tag';
import { Text } from '../common/text';
import { IItemScanHistoryItemProps } from './types';


export function ItemScanHistoryItem(props: IItemScanHistoryItemProps) {
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
