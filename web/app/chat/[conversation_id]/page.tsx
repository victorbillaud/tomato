'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Chat from '@/components/chat/Chat';
import Input from '@/components/chat/Input';
import ChatHeader from '@/components/chat/ChatHeader';
import { DBMessage } from '@/components/chat/types';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { getConversationMessages } from '@utils/lib/messaging/services';
import { ChatSkeleton, InputSkeleton } from '@/components/chat/Skeletons';

export default function Index() {
  const supabase = createClient();
  const router = useRouter();
  const conversationId = useParams().conversation_id as string;
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<DBMessage[] | null>(null);

  useEffect(() => {
    async function fetchUser(supabase: any) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        throw new Error('User not found');
      }
      setUser(user);
    }

    async function fetchMessages(supabase: any) {
      const { messages, error: messageError } = await getConversationMessages(
        supabase,
        conversationId
      );
      // if can't get messages, redirect to conversations list
      if (messageError) {
        router.push('/chat');
      }
      setMessages(messages as DBMessage[]);
    }

    fetchUser(supabase);
    fetchMessages(supabase);
  }, [supabase, conversationId, router]);

  if (!user && !messages) {
    return (
      <div className='flex h-full w-full flex-col justify-end overflow-hidden px-4 sm:w-2/3'>
        <ChatSkeleton />
        <InputSkeleton />
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col justify-start sm:w-2/3 sm:pl-2'>
      <ChatHeader conversationId={conversationId} currentUser={user as User} />
      <div className='flex h-full flex-col justify-end gap-2 overflow-y-scroll px-3 sm:px-0'>
        <Chat
          conversationId={conversationId}
          oldMessages={messages as DBMessage[]}
          currentUser={user as User}
        />
        <Input conversationId={conversationId} />
      </div>
    </div>
  );
}
