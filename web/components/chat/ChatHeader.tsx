'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '../common/icon';
import { Tag } from '../common/tag';
import { Text } from '../common/text';
import { MobileHeaderProps } from './types';
import { CustomImage } from '../common/image';

export default function ChatHeader({ currentUser, item }: MobileHeaderProps) {
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
      <div className='flex items-center gap-2'>
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
        <Text variant='h3' weight={600}>
          {item?.name || 'Item found'}
        </Text>
        {renderTag()}
      </div>
    );
  };

  const renderHeader = () => {
    if (isOwner) {
      return (
        <div className='flex w-full items-center justify-between gap-2'>
          {renderHeaderContent()}
          <Link href={item ? `../dashboard/item/${item?.id}` : ''}>
            {item && (
              <Icon
                name='external-link'
                size={25}
                animateOnClick
                color='text-black dark:text-white'
              />
            )}
          </Link>
        </div>
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
      <div className='mx-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100 py-3 pr-4 shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/20 sm:mx-0 sm:px-6 sm:shadow-none'>
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
