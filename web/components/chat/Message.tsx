import { IMessageProps } from './types';

const Message = ({
  message,
  isSent = false,
  firstMessage = false,
  lastMessage = false,
}: IMessageProps) => {
  const messageColor = isSent ? 'bg-primary-900' : 'bg-primary-400';
  const messageStyle = isSent ? 'self-end items-end' : 'self-start items-start';

  return (
    <div className={`flex w-full flex-col font-light ${messageStyle}`}>
      {firstMessage ? <div>{message.user_id}</div> : null}
      <div
        className={`mt-1 w-fit max-w-[60%] rounded-lg px-4 py-2 text-white ${messageColor}`}
      >
        <div>{message.content}</div>
      </div>
    </div>
  );
};

export default Message;
