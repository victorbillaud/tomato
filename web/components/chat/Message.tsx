'use client';
import dateFormat, { masks } from 'dateformat';
import { MessageProps } from './types';
import { Text } from '../common/text';

masks.timeOnly = 'HH:MM';
masks.dateOnly = 'd mmm yyyy';
masks.dateTime = 'd mmm yyyy HH:MM';

const Message = ({
  message,
  prevMessage,
  nextMessage,
  currentUser,
}: MessageProps) => {
  let displayDate = true;
  let displayTime = false;
  let firstMessage = false;
  let lastMessage = false;

  const isCurrentUser = message.sender_id === (currentUser?.id || null)
  const isSameUserThanPrevious = message.sender_id === prevMessage?.sender_id;
  const isSameUserThanNext = message.sender_id === nextMessage?.sender_id;
  const currentDate = new Date(message.created_at);

  if (prevMessage) {
    const prevDate = new Date(prevMessage.created_at);
    const timeDiff = currentDate.getTime() - prevDate.getTime();
    const diffHoursWithPrevious = timeDiff / (1000 * 60);
    const isDifferentDay = currentDate.getDate() !== prevDate.getDate();

    if (diffHoursWithPrevious > 60) {
      firstMessage = true;
    } else {
      firstMessage = false;
    }
    if (isDifferentDay && diffHoursWithPrevious > 60) {
      displayDate = true;
    } else {
      displayDate = false;
    }
  }

  if (nextMessage) {
    const nextDate = new Date(nextMessage.created_at);
    const timeDiff = nextDate.getTime() - currentDate.getTime();
    const diffHoursWithNext = timeDiff / (1000 * 60);

    if (diffHoursWithNext > 60) {
      lastMessage = true;
    } else {
      lastMessage = false;
    }
  } else {
    lastMessage = true;
  }

  if (!isSameUserThanPrevious) {
    firstMessage = true;
  }
  if (!isSameUserThanNext) {
    lastMessage = true;
  }

  const messageColor = isCurrentUser ? 'bg-primary-900' : 'bg-primary-400';
  const messageStyle = isCurrentUser
    ? 'self-end items-end'
    : 'self-start items-start';
  const messageBubbleStyle = isCurrentUser
    ? (isSameUserThanPrevious && !firstMessage ? ' rounded-tr-sm ' : '') +
      (isSameUserThanNext && !lastMessage ? ' rounded-br-sm ' : '')
    : (isSameUserThanPrevious && !firstMessage ? ' rounded-tl-sm ' : '') +
      (isSameUserThanNext && !lastMessage ? ' rounded-bl-sm ' : '');

  return (
    <>
      {displayDate ? (
        <div className='py-2 text-center text-sm'>
          {dateFormat(message.created_at, masks.dateOnly)}
        </div>
      ) : null}
      <div
        className={`flex w-full flex-col font-light ${messageStyle}`}
        title={dateFormat(message.created_at, masks.dateTime)}
      >
        <div
          className={`mt-1 w-fit max-w-[60%] rounded-3xl px-4 py-2 text-white ${messageColor} ${messageBubbleStyle} break-words`}
        >
          <div>{message.content}</div>
        </div>
        {lastMessage ? (
          <Text
            variant={'caption'}
            className='px-2 pt-1'
            color='text-black/90 dark:text-white/70'
          >
            {dateFormat(message.created_at, masks.timeOnly)}
          </Text>
        ) : null}
      </div>
    </>
  );
};

export default Message;
