'use client';
import ChatList from '@/components/chat/ChatList';
import { useParams } from 'next/navigation';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversationId = useParams().conversation_id as string;
  const mobileStyle = conversationId ? ' hidden sm:block ' : '';

  return (
    <div className='flex h-[80vh] w-full overflow-hidden'>
      <div
        className={`w-full border-gray-700/10 dark:border-white/20 sm:w-1/3 sm:border-r-[1px] ${mobileStyle}`}
      >
        <ChatList />
      </div>
      {children}
    </div>
  );
}
