import Link from 'next/link';
import { Icon } from '../common/icon';
import { Text } from '../common/text';

const MobileHeader = () => {
  return (
    <div className='flex items-center gap-2 sm:hidden'>
      <Link href='/chat'>
        <Icon
          name={'chevron-left'}
          size={33}
          animateOnClick
          color='text-black dark:text-white'
        />
      </Link>
      <Text variant='h3' weight={600}>
        Mobile Header
      </Text>
    </div>
  );
};

export default MobileHeader;
