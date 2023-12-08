'use client';
import Link from 'next/link';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import { MobileHeaderProps } from './types';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getConversation } from '@utils/lib/messaging/services';
import { getItem } from '@utils/lib/item/services';
import { Tag } from '../common/tag';
import { ItemType } from '../item';

export default function MobileHeader({ conversationId }: MobileHeaderProps) {
  const supabase = createClient();
  const [item, setItem] = useState<ItemType | null>(null);

  useEffect(() => {
    async function fetchConversation() {
      const { conversation, error: conversationError } = await getConversation(
        supabase,
        conversationId
      );

      if (conversationError) {
        console.error(conversationError);
        return null;
      }

      fetchItem(conversation?.item_id as string);
    }

    async function fetchItem(itemId: string) {
      const { data: item, error: itemError } = await getItem(supabase, itemId);
      if (itemError) {
        console.error(itemError);
        return null;
      }
      setItem(item);
    }

    fetchConversation();
  }, [supabase, conversationId]);

  const renderTag = () => {
    if (item && item.lost) {
      return <Tag text='lost' color='red' size='small' />;
    } else if (item && !item.lost) {
      return <Tag text='found' color='green' size='small' />;
    } else {
      return <Tag text='scanned' color='blue' size='small' />;
    }
  };

  return (
    <div
      className='flex items-center gap-2 pb-2 sm:hidden'
      style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
    >
      <Link href='/chat'>
        <Icon
          name={'chevron-left'}
          size={33}
          animateOnClick
          color='text-black dark:text-white'
        />
      </Link>

      <Text variant='h4' weight={600}>
        {item?.name || 'unknown'}
      </Text>

      {renderTag()}
    </div>
  );
}
