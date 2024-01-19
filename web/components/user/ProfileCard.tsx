'use client';

import { createClient } from '@/utils/supabase/client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { Database } from '@utils/lib/supabase/supabase_types';
import { getUserDetails, updateUserDetails } from '@utils/lib/user/services';
import dateFormat, { masks } from 'dateformat';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Button } from '../common/button';
import { Icon, IconNames } from '../common/icon';
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
        updated_at: new Date().toISOString(),
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
        <Text variant='h4'>Profile</Text>
        <div className='flex flex-row items-center justify-between gap-2'>
          <ResetPasswordButton user={user} supabase={supabase} />
          <Button
            text='Edit'
            variant='secondary'
            size='small'
            onClick={() => setIsEdit(!isEdit)}
          />
        </div>
      </div>
      <div className='flex w-full flex-col items-start justify-center gap-3 p-4'>
        <form className='flex w-full flex-col gap-3' ref={formRef}>
          <div className='flex w-full flex-row items-center justify-between'>
            <ElementForm
              label='Username'
              value={profile?.username || null}
              isEditing={isEdit}
              name='username'
            />
          </div>
          <div className='flex w-full flex-row items-center justify-between'>
            <ElementForm
              label='Name'
              value={profile?.full_name || null}
              isEditing={isEdit}
              name='full_name'
            />
          </div>
          <div className='flex w-full flex-row items-center justify-between'>
            <ElementForm
              icon='phone'
              label='Phone'
              value={profile?.phone || null}
              isEditing={isEdit}
              name='phone'
            />
          </div>
          <div className='items-right flex w-full flex-col justify-between gap-1'>
            <div className='flex w-full flex-row items-center justify-start gap-1'>
              <Icon name={'at'} size={16} className='opacity-60' />
              <Text variant='body' className='opacity-60' weight={300}>
                Email
              </Text>
            </div>
            <Text variant='body' className='opacity-90' weight={500}>
              {user?.email}
            </Text>
          </div>
        </form>
      </div>
      <div className='flex w-full flex-row items-center justify-between border-t border-gray-200 p-4'>
        <Text variant='caption' className='opacity-70'>
          Last updated{' '}
          {dateFormat(profile?.updated_at || undefined, masks.fullDate)}
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
  value: string | null;
  isEditing: boolean;
  icon?: IconNames;
}

function ElementForm({
  label,
  value,
  isEditing,
  name,
  icon,
}: IElementFormProps) {
  return (
    <div className='items-right flex w-full flex-col justify-between gap-1'>
      <div className='flex w-full flex-row items-center justify-start gap-1'>
        {icon && <Icon name={icon} size={16} className='opacity-60' />}
        <Text variant='body' className='opacity-60' weight={300}>
          {label}
        </Text>
      </div>
      {isEditing ? (
        <div className='w-fukk flex flex-row items-center justify-end'>
          <InputText
            icon={icon}
            type='text'
            name={name}
            defaultValue={value || ''}
            textAlignment='text-left'
          />
        </div>
      ) : value ? (
        <Text variant='body' className='opacity-90' weight={500}>
          {value}
        </Text>
      ) : (
        <Text variant='body' className='opacity-40' weight={300}>
          Not set
        </Text>
      )}
    </div>
  );
}

interface IResetPasswordButtonProps {
  user: User;
  supabase: SupabaseClient<Database>;
}

function ResetPasswordButton({ user, supabase }: IResetPasswordButtonProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleClick = () => {
    user.email &&
      supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/forgot-password`,
      });

    setIsDisabled(true);
    setTimer(60);

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      setIsDisabled(false);
    }, 60000);
  };

  return (
    <Button
      text={timer > 0 ? `Resend in ${timer}s` : 'Change password'}
      variant='secondary'
      size='small'
      disabled={isDisabled}
      onClick={handleClick}
    />
  );
}
