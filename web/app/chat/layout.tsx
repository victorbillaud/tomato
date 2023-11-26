import ChatList from '@/components/chat/ChatList';

export default async function ChatLayout(props: { children: React.ReactNode }) {
  return (
    <div className='flex h-[80vh] w-full space-x-2 overflow-hidden'>
      <ChatList />
      {props.children}
    </div>
  );
}
