'use client';
import ChatList from '@/components/chat/ChatList';
import { useParams } from 'next/navigation';
import { ChatProvider } from '@/components/chat/ChatContext';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversationId = useParams().conversation_id as string;
  const mobileStyle = conversationId ? ' hidden sm:block ' : '';

  return (
    <div className='flex h-[80vh] w-full overflow-hidden'>
      <ChatProvider>
        <div
          className={`w-full border-gray-700/10 px-3 dark:border-white/20 sm:w-1/3 sm:border-r-[1px] sm:px-0 ${mobileStyle}`}
        >
          <ChatList />
        </div>
        {children}
      </ChatProvider>
    </div>
  );
}
