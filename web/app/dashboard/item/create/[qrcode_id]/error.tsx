'use client'; // Error components must be Client Components

import { Button } from '@/components/common/button';
import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; message: any };
  reset: () => void;
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-start px-3'>
      <div className='my-10 flex w-full max-w-[700px] items-center justify-between gap-3 rounded-md border border-red-400 bg-red-600/20 px-6 py-3 shadow-sm'>
        <div className='flex flex-col items-start justify-around'>
          <Text
            variant='body'
            className='text-left opacity-50 dark:opacity-80'
            color=' text-red-700'
          >
            Oops ! Something went wrong when loading this segment:
          </Text>
          <span className='text-red-700'>{error.message}</span>
        </div>
        <Icon
          name='exclamation-circle'
          size={50}
          color='text-red-700'
          className='opacity-70'
        />
      </div>

      <Button variant='secondary' text='Try again' onClick={reset} />
    </div>
  );
}
