import ChatList from '@/components/chat/ChatList';
import { ChatProvider } from '@/components/chat/ChatContext';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-[80vh] w-full overflow-hidden'>
      <ChatProvider>
        <ChatList />
        {children}
      </ChatProvider>
    </div>
  );
}
