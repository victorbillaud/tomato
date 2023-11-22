import { IMessage } from './types';

type MessageProps = {
  message: IMessage;
  isSent?: boolean;
};

const Message = ({ message, isSent = false }: MessageProps) => {
  const messageColor = isSent ? 'bg-primary-900' : 'bg-primary-400';
  const messageStyle = isSent ? 'self-end items-end' : 'self-start items-start';

  return (
    <div className={`flex flex-col ${messageStyle}`}>
      <div>{message.user_id}</div>
      <div
        className={`max-w-70% w-fit rounded-lg px-4 py-2 text-white ${messageColor}`}
      >
        <div>{message.content}</div>
      </div>
    </div>
  );
};

export default Message;
