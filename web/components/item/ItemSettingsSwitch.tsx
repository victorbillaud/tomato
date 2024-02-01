'use client';

import { createClient } from '@/utils/supabase/client';
import { updateItem } from '@utils/lib/item/services';
import { Tables } from '@utils/lib/supabase/supabase_types';
import { useCallback } from 'react';
import { Switch } from '../common/switch/Switch';

interface IItemSettingsProps {
  itemId: string;
  label: string;
  field: keyof Pick<
    Tables<'item'>,
    | 'scan_show_avatar_url'
    | 'scan_show_full_name'
    | 'scan_show_item_name'
    | 'scan_show_phone'
  >;
  value: boolean;
}

export function ItemSettingsSwitch({
  itemId,
  label,
  field,
  value,
}: IItemSettingsProps) {
  const supabase = createClient();
  const handleItemUpdate = useCallback(
    async (value: boolean) => {
      const { data: itemUpdated, error } = await updateItem(supabase, itemId, {
        [field]: value,
      });

      if (error) {
        console.error(error);
      }

      return itemUpdated;
    },
    [supabase, itemId, field, value]
  );

  return (
    <Switch
      label={label}
      checked={value}
      onValueChange={async (value) => await handleItemUpdate(value)}
    />
  );
}
