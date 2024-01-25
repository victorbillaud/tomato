'use client';

import { createClient } from '@/utils/supabase/client';
import { Tables } from '@utils/lib/supabase/supabase_types';
import { updateUserDetails } from '@utils/lib/user/services';
import { useCallback } from 'react';
import { Switch } from '../common/switch/Switch';

interface IItemSettingsProps {
  user_id: string;
  label: string;
  field: keyof Pick<
    Tables<'profiles'>,
    'email_notifications' | 'message_notifications'
  >;
  value: boolean;
}

export function NotificationSettingsSwitch({
  user_id,
  label,
  field,
  value,
}: IItemSettingsProps) {
  const supabase = createClient();
  const handleUpdateProfile = useCallback(
    async (value: boolean) => {
      const { user: userUpdated, error } = await updateUserDetails(
        supabase,
        user_id,
        {
          [field]: value,
          updated_at: new Date().toISOString(),
        }
      );

      if (error) {
        console.error(error);
      }

      return userUpdated;
    },
    [supabase, user_id, field, value]
  );

  return (
    <Switch
      label={label}
      checked={value}
      onValueChange={async (value) => await handleUpdateProfile(value)}
    />
  );
}
