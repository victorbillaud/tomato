'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { getUserDetails, updateUserDetails } from '@utils/lib/user/services';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Button } from '../common/button';
import { InputText } from '../common/input';
import { Text } from '../common/text';

interface IProfileCardProps {
  user: User;
  profile: Awaited<ReturnType<typeof getUserDetails>>['user'];
}

export function ProfileCard({ user, profile }: IProfileCardProps) {
  const [isEdit, setIsEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdateProfile = useCallback(async () => {
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);

    const username = formData.get('username') as string;
    const full_name = formData.get('full_name') as string;

    const { user: userUpdated, error } = await updateUserDetails(
      supabase,
      user.id,
      {
        username,
        full_name,
      }
    );

    if (error) {
      throw error;
    }

    if (!userUpdated) {
      throw new Error('Profile not found');
    }

    setIsEdit(false);
    router.refresh();
  }, [profile?.id]);

  return (
    <div className='flex w-full flex-col rounded-md border border-gray-200 shadow-md'>
      <div className='flex w-full flex-row items-center justify-between border-b border-gray-200 px-4 py-4'>
        <Text variant='h4'>Edit</Text>
        <Button
          text='Edit'
          variant='tertiary'
          size='small'
          onClick={() => setIsEdit(!isEdit)}
        />
      </div>
      <div className='flex w-full flex-col p-4'>
        <form className='flex w-full flex-col gap-3' ref={formRef}>
          <div className='flex w-full flex-row items-center justify-between'>
            <ElementForm
              label='Username'
              value={profile?.username || ''}
              isEditing={isEdit}
              name='username'
            />
          </div>
          <div className='flex w-full flex-row items-center justify-between'>
            <ElementForm
              label='Name'
              value={profile?.full_name || ''}
              isEditing={isEdit}
              name='full_name'
            />
          </div>
          <div className='items-right flex w-full flex-col justify-between gap-1'>
            <Text variant='body' className='opacity-60' weight={300}>
              Email
            </Text>
            <Text variant='body' className='opacity-90' weight={500}>
              {user?.email}
            </Text>
          </div>
        </form>
      </div>
      <div className='flex w-full flex-row items-center justify-between border-t border-gray-200 p-4'>
        <Text variant='caption' className='opacity-70'>
          Manage your profile information and email address.
        </Text>
        {isEdit && (
          <Button
            text='Save'
            variant='primary'
            size='small'
            onClick={() => handleUpdateProfile()}
          />
        )}
      </div>
    </div>
  );
}
interface IElementFormProps {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
}

function ElementForm({ label, value, isEditing, name }: IElementFormProps) {
  return (
    <div className='items-right flex w-full flex-col justify-between gap-1'>
      <Text variant='body' className='opacity-60' weight={300}>
        {label}
      </Text>
      {isEditing ? (
        <div className='w-fukk flex flex-row items-center justify-end'>
          <InputText
            type='text'
            name={name}
            defaultValue={value}
            textAlignment='text-left'
          />
        </div>
      ) : (
        <Text variant='body' className='opacity-90' weight={500}>
          {value}
        </Text>
      )}
    </div>
  );
}
