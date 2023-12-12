export const ChatListSkeleton = () => {
  return (
    <div className='flex h-full w-full flex-col gap-2 pr-4'>
      <div className='h-6 w-1/2 animate-pulse rounded-lg bg-gray-300/20 pb-6'></div>
      {[...Array(8)].map((_, index) => (
        <ChatCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const ChatCardSkeleton = () => {
  return (
    <div className='h-18 flex w-full items-center gap-2 px-2 py-3'>
      <div className='flex-shrink-0'>
        <div className='h-10 w-10 animate-pulse rounded-full bg-gray-300/20'></div>
      </div>

      <div className='flex flex-grow flex-col gap-2'>
        <div className='h-5 w-full animate-pulse rounded-lg bg-gray-300/20'></div>
        <div className='h-4 w-1/2 animate-pulse rounded-lg bg-gray-300/20'></div>
      </div>

      <div className='flex flex-shrink-0 flex-col items-end gap-2'>
        <div className='h-5 w-12 animate-pulse rounded-lg bg-gray-300/20'></div>
        <div className='h-4 w-16 animate-pulse rounded-lg bg-gray-300/20'></div>
      </div>
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className='flex h-full w-full flex-col gap-3 pb-6 sm:pl-6'>
      <div className='h-12 w-1/3 animate-pulse self-start rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-2/3 animate-pulse self-start rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-2/3 animate-pulse self-end rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/2 animate-pulse self-start rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/2 animate-pulse self-end rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/3 animate-pulse self-end rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/5 animate-pulse self-start rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/2 animate-pulse self-start rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/4 animate-pulse self-start rounded-lg bg-gray-300/20'></div>
      <div className='h-24 w-2/3 animate-pulse self-end rounded-lg bg-gray-300/20'></div>
      <div className='h-12 w-1/2 animate-pulse self-end rounded-lg bg-gray-300/20'></div>
    </div>
  );
};

export const InputSkeleton = () => {
  return (
    <div className='h-full'>
      <div className='h-12 w-full animate-pulse rounded-lg bg-gray-300/20'></div>
    </div>
  );
};
