'use client';
import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text/Text';
import { useNotifications } from '@/utils/hooks/useNotifications';
import { createClient } from '@/utils/supabase/client';

export type NotificationPinProps = {
  user_id: string;
};

export const NotificationPin = ({ user_id }: NotificationPinProps) => {
  const supabase = createClient();
  const [notifications, notificationsLoaded] = useNotifications({
    client: supabase,
    user_id: user_id,
  });

  return (
    notificationsLoaded && (
      <div className='flex flex-row items-center justify-center gap-1 rounded-lg border border-stone-300 p-1 px-2 dark:border-stone-700'>
        <Icon
          name='bell'
          size={18}
          color='text-stone-300 dark:text-stone-300'
        />
        <Text
          variant='caption'
          weight={400}
          color='text-stone-300 dark:text-stone-300'
          className='text-center uppercase'
        >
          {notifications.length}
        </Text>
      </div>
    )
  );
};
