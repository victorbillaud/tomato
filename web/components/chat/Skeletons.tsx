const skeletonStyle = 'animate-pulse bg-gray-300/50 dark:bg-gray-300/20';

export const ChatListSkeleton = () => {
  return (
    <div className={`flex h-full w-full flex-col gap-2 pr-4`}>
      <div className={`${skeletonStyle} h-6 w-1/2 rounded-lg pb-6`}></div>
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
        <div className={`${skeletonStyle} h-10 w-10 rounded-full`}></div>
      </div>

      <div className='flex flex-grow flex-col gap-2'>
        <div className={`${skeletonStyle} h-5 w-full rounded-lg`}></div>
        <div className={`${skeletonStyle} h-4 w-1/2 rounded-lg`}></div>
      </div>

      <div className='flex flex-shrink-0 flex-col items-end gap-2'>
        <div className={`${skeletonStyle} h-5 w-12 rounded-lg`}></div>
        <div className={`${skeletonStyle} h-4 w-16 rounded-lg`}></div>
      </div>
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className='flex h-full w-full flex-col gap-3 pb-6 sm:pl-6'>
      <div
        className={`${skeletonStyle} h-12 w-1/3 self-start rounded-lg`}
      ></div>
      <div
        className={`${skeletonStyle} h-12 w-2/3 self-start rounded-lg`}
      ></div>
      <div className={`${skeletonStyle} h-12 w-2/3 self-end rounded-lg`}></div>
      <div
        className={`${skeletonStyle} h-12 w-1/2 self-start rounded-lg`}
      ></div>
      <div className={`${skeletonStyle} h-12 w-1/2 self-end rounded-lg`}></div>
      <div className={`${skeletonStyle} h-12 w-1/3 self-end rounded-lg`}></div>
      <div
        className={`${skeletonStyle} h-12 w-1/5 self-start rounded-lg`}
      ></div>
      <div
        className={`${skeletonStyle} h-12 w-1/2 self-start rounded-lg`}
      ></div>
      <div
        className={`${skeletonStyle} h-12 w-1/4 self-start rounded-lg`}
      ></div>
      <div className={`${skeletonStyle} h-24 w-2/3 self-end rounded-lg`}></div>
      <div className={`${skeletonStyle} h-12 w-1/2 self-end rounded-lg`}></div>
    </div>
  );
};

export const InputSkeleton = () => {
  return (
    <div className='h-full'>
      <div className={`${skeletonStyle} h-12 w-full rounded-lg`}></div>
    </div>
  );
};
