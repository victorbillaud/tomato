import React from 'react';

export default function ChatLayout(props: {
  chatList: React.ReactNode;
  chat: React.ReactNode;
  params: { conversation_id: string[] };
}) {
  return (
    <div className='flex h-full w-full'>
      {props.chatList}
      <div className='flex h-full w-2/3 flex-col justify-end'>{props.chat}</div>
    </div>
  );
}
