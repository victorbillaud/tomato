import { listItems } from '@utils/lib/item/services';
import { Database } from '@utils/lib/supabase/supabase_types';

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

export type ItemType = ArrayElementType<
  Awaited<ReturnType<typeof listItems>>['data']
>;

export interface IItemCardProps {
  item: ItemType;
}

export interface IItemInfoProps {
  item: ItemType;
}

export interface IItemSettingsProps {
  item: ItemType;
}

export interface TItemScanHistoryProps {
  item: ItemType;
}

export interface IItemScanHistoryItemProps {
  scan: Database['public']['Tables']['scan']['Row'];
}

export interface IItemStateManagerProps {
  item: ItemType;
}
