export const ChatListSkeleton = () => {
  return (
    <div className='flex h-full w-full flex-col gap-6 p-2 pr-4'>
      <div className='h-8 w-1/2 animate-pulse rounded-lg bg-gray-300/20'></div>
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className='h-16 w-full animate-pulse rounded-lg bg-gray-300/20'
        ></div>
      ))}
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
