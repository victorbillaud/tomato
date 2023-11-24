'use client';

import { Switch } from '../common/switch/Switch';
import { handleFormItemUpdate } from './actions';
import { IItemSettingsProps } from './types';

export function ItemSettings({ item }: IItemSettingsProps) {
  const handleUpdateWithItemId = handleFormItemUpdate.bind(null, item.id);

  const handleUpdateItem = (key: string, value: any) => {
    const formData = new FormData();
    formData.append("key", key);
    formData.append("value", value);
    handleUpdateWithItemId(formData);
  };

  return (
    <div className='flex w-full flex-col items-start justify-end gap-3'>
      <Switch
        label='Notify me when found'
        checked={item.notify_anyway}
        onValueChange={(value) => {
          handleUpdateItem('notify_anyway', value);
        }}
      />
    </div>
  );
}
