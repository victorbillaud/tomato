import ChatList from '@/components/chat/ChatList';

export default async function ChatLayout(props: { children: React.ReactNode }) {
  return (
    <div className='flex h-full w-full'>
      <ChatList />
      {props.children}
    </div>
  );
}
