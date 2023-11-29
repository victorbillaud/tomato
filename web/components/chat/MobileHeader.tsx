import Link from 'next/link';
import { Icon } from '../common/icon';

const MobileHeader = () => {
  return (
    <div className='flex items-center gap-2 sm:hidden'>
      <Link href='/chat'>
        <Icon name={'chevron-left'} size={33} animateOnClick />
      </Link>
      Mobile Header
    </div>
  );
};

export default MobileHeader;
