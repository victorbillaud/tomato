import { Database, Tables } from '@utils/lib/supabase/supabase_types';
import dateFormat, { masks } from 'dateformat';
import { TTagColor, Tag } from '../common/tag';
import { Text } from '../common/text';
import * as Tooltip from '../radix/Tooltip';
import { LocationTooltip } from './ItemScanHistoryLocationMap';
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
        {props.scan.ip_metadata && <IpTooltip scan={props.scan} />}
        {props.scan.geo_location_metadata && (
          <LocationTooltip scan={props.scan} />
        )}
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

interface ILocationTooltipProps {
  scan: Tables<'scan'>;
}

const IpTooltip = (props: ILocationTooltipProps) => {
  const ipCity = props.scan.ip_metadata
    ? props.scan.ip_metadata['city']
    : 'Unknown';

  const ipRegion = props.scan.ip_metadata
    ? props.scan.ip_metadata['region']
    : 'Unknown';

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className=''>
            <Tag
              text={`${ipCity}, ${ipRegion}`}
              color='orange'
              size='small'
              className='mr-1'
              icon='map-pin-exclamation'
            />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className='data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-lg border  border-stone-300 bg-zinc-100/80 p-3 text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] backdrop-blur-lg will-change-[transform,opacity] dark:border-stone-700 dark:bg-zinc-900/70'
            sideOffset={5}
          >
            <Text variant='caption' weight={400}>
              This is an approximate location based on the IP address.
            </Text>
            <Tooltip.Arrow className='fill-zinc-100/80 dark:fill-zinc-900/70' />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
