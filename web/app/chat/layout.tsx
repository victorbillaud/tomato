import ChatList from '@/components/chat/ChatList';
import Input from '@/components/chat/Input';

export default async function ChatLayout(props: { children: React.ReactNode }) {
  return (
    <div className='flex h-full w-full'>
      <ChatList />
      <div className='flex h-full w-2/3 flex-col justify-end'>
        {props.children}
        <Input />
      </div>
    </div>
  );
}
