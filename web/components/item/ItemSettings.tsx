'use client';

import { Switch } from '../common/switch/Switch';
import { Text } from '../common/text';
import { ItemSettingsSwitch } from './ItemSettingsSwitch';
import { handleFormItemUpdate } from './actions';
import { IItemSettingsProps } from './types';

export function ItemSettings({ item }: IItemSettingsProps) {
  const handleUpdateWithItemId = handleFormItemUpdate.bind(null, item.id);

  const handleUpdateItem = (key: string, value: any) => {
    const formData = new FormData();
    formData.append('key', key);
    formData.append('value', value);
    handleUpdateWithItemId(formData);
  };

  return (
    <div className='flex w-full flex-col items-start justify-end gap-3'>
      <Text variant='subtitle'>Settings</Text>
      <Switch
        label='Notify me when scanned even if item is not lost'
        checked={item.notify_anyway}
        onValueChange={(value) => {
          handleUpdateItem('notify_anyway', value);
        }}
      />
      <ItemSettingsSwitch
        itemId={item.id}
        label='Show avatar on scan page'
        field='scan_show_avatar_url'
        value={item.scan_show_avatar_url}
      />
      <ItemSettingsSwitch
        itemId={item.id}
        label='Show full name on scan page'
        field='scan_show_full_name'
        value={item.scan_show_full_name}
      />
      <ItemSettingsSwitch
        itemId={item.id}
        label='Show item name on scan page'
        field='scan_show_item_name'
        value={item.scan_show_item_name}
      />
      <ItemSettingsSwitch
        itemId={item.id}
        label='Show phone on scan page'
        field='scan_show_phone'
        value={item.scan_show_phone}
      />
    </div>
  );
}
