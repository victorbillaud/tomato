import { MessageProps } from './types';
import dateFormat, { masks } from 'dateformat';

masks.timeOnly = 'hh:MM';

const Message = ({
  message,
  isSent = false,
  user = undefined,
  firstMessage = false,
  lastMessage = false,
}: MessageProps) => {
  const messageColor = isSent ? 'bg-primary-900' : 'bg-primary-400';
  const messageStyle = isSent ? 'self-end items-end' : 'self-start items-start';

  return (
    <div className={`flex w-full flex-col font-light ${messageStyle}`}>
      {firstMessage ? <div>{user?.full_name}</div> : null}
      <div
        className={`mt-1 w-fit max-w-[60%] rounded-lg px-4 py-2 text-white ${messageColor}`}
      >
        <div>{message.content}</div>
      </div>
      <div className='px-2 text-sm font-light'>
        {lastMessage ? dateFormat(message.created_at, masks.timeOnly) : null}
      </div>
    </div>
  );
};

export default Message;
