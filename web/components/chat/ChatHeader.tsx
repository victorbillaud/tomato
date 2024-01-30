'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '../common/icon';
import { Tag } from '../common/tag';
import { Text } from '../common/text';
import { MobileHeaderProps } from './types';
import { CustomImage } from '../common/image';

export default function ChatHeader({ currentUser, item }: MobileHeaderProps) {
  const [showLinkIcon, setShowLinkIcon] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && item) {
      setIsOwner(currentUser.id === item?.user_id);
    }
  }, [currentUser, item]);

  const renderTag = () => {
    if (isOwner && item?.lost) {
      return <Tag text='lost' color='red' size='small' className='h-fit' />;
    }
    if (!isOwner) {
      return <Tag text='scanned' color='blue' size='small' className='h-fit' />;
    }
    if (!item?.lost) {
      return <Tag text='found' color='green' size='small' className='h-fit' />;
    }
  };

  const renderHeaderContent = () => {
    return (
      <>
        {item.image_path ? (
          <CustomImage
            src={item.image_path}
            alt='item-image'
            width={36}
            height={36}
            cover
            rounded='full'
            className='block border-[1px] border-gray-700 dark:border-white/20 sm:hidden'
          />
        ) : null}
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
      <div className='mx-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100 py-3 shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/20 sm:mx-0 sm:pl-6 sm:shadow-none'>
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
