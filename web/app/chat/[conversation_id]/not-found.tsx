import { StyledLink } from '@/components/common/link';
import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';

export default function NotFound() {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-start px-3'>
      <div className='my-10 flex w-full max-w-[700px] items-center justify-between gap-3 rounded-md border border-yellow-400 bg-yellow-600/20 px-6 py-3 shadow-sm'>
        <div className='flex flex-col items-start justify-around'>
          <Text
            variant='body'
            className='text-left opacity-60 dark:opacity-80'
            color='text-yellow-700'
          >
            Oops ! Conversation not found
          </Text>
          <Text variant='body' color='text-yellow-700'>
            It seems like the conversation you&apos;re looking for doesn&apos;t
            exist.
          </Text>
          <Text variant='body' color='text-yellow-700'>
            Please select another conversation or return home.
          </Text>
        </div>
        <Icon name='alert-triangle' size={50} color='text-yellow-700' />
      </div>

      <StyledLink variant='secondary' text='Return home' href='/'></StyledLink>
    </div>
  );
}
