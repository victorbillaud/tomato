'use client'; // Error components must be Client Components

import { Button } from '@/components/common/button';
import { Text } from '@/components/common/text';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; message: any };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='my-5 flex w-full flex-col rounded-md border border-red-400 bg-red-600/20 px-4 py-3 shadow-sm'>
      <div className='flex flex-row items-center justify-between gap-5'>
        <Text
          variant='caption'
          className='text-center opacity-50'
          color=' text-red-700'
        >
          An error occurred while rendering this segment
        </Text>
        <Button variant='tertiary' text='Try again' onClick={reset} />
      </div>
      <div>
        <span className='text-red-700'>{error.message}</span>
      </div>
    </div>
  );
}
