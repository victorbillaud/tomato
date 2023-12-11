'use client';
import Link from 'next/link';
import { Icon } from '../common/icon';
import { Text } from '../common/text';
import { MobileHeaderProps } from './types';
import { useEffect, useState } from 'react';
import { Tag } from '../common/tag';

export default function ChatHeader({ currentUser, item }: MobileHeaderProps) {
  const [showLinkIcon, setShowLinkIcon] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && item) {
      setIsOwner(currentUser.id === item?.user_id);
    }
  }, [currentUser, item]);

  const renderTag = () => {
    if (item && item.lost) {
      return <Tag text='lost' color='red' size='small' className='h-fit' />;
    } else if (item && !item.lost) {
      return <Tag text='found' color='green' size='small' className='h-fit' />;
    } else {
      return <Tag text='scanned' color='blue' size='small' className='h-fit' />;
    }
  };

  const renderHeaderContent = () => {
    return (
      <>
        <Text variant='h3' weight={600} className='hidden sm:block'>
          {item?.name || 'Item found'}
        </Text>
        <Text variant='h4' weight={600} className='block sm:hidden'>
          {item?.name || 'Item found'}
        </Text>
        {renderTag()}
      </>
    );
  };

  const renderHeader = () => {
    if (isOwner) {
      return (
        <Link
          href={item ? `../dashboard/item/${item?.id}` : ''}
          className='flex items-center gap-2 dark:text-white'
          onMouseOver={() => setShowLinkIcon(true)}
          onMouseLeave={() => setShowLinkIcon(false)}
        >
          {renderHeaderContent()}
          {showLinkIcon && item && (
            <Icon
              name='external-link'
              size={20}
              animateOnClick
              color='text-black dark:text-white'
              className='hidden sm:block'
            />
          )}
        </Link>
      );
    } else {
      return (
        <div className='flex items-center gap-2 dark:text-white'>
          {renderHeaderContent()}
        </div>
      );
    }
  };

  return (
    <>
      <div className='flex items-center gap-2 pb-2 shadow-md dark:shadow-black/20 sm:pl-6 sm:shadow-none'>
        <Link href='/chat' className='flex sm:hidden'>
          <Icon
            name={'chevron-left'}
            size={33}
            animateOnClick
            color='text-black dark:text-white'
          />
        </Link>

        <>{renderHeader()}</>
      </div>
    </>
  );
}
