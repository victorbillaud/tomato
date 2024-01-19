import { createClient } from '@/utils/supabase/server';
import { getUserDetails, updateUserAvatar } from '@utils/lib/user/services';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { CustomImage } from '../common/image';
import { InputFileForm } from '../common/input';

async function handleImageUpdate(
  oldImage: string,
  userId: string,
  formData: FormData
) {
  'use server';

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const imageValue: File = formData.get('picture') as File;
  const { imagePath, error } = await updateUserAvatar(
    supabase,
    imageValue,
    oldImage,
    userId
  );

  if (error) {
    throw error;
  }

  revalidatePath(`/user`);
  redirect(`/user`);
}

export async function ProfilePictureUploader() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { user: profile } = await getUserDetails(supabase, user?.id);

  if (!profile) {
    return notFound();
  }

  const handleImageUpdateBind = handleImageUpdate.bind(
    null,
    profile?.avatar_url,
    user?.id
  );

  return (
    <div className='flex w-full flex-col items-center justify-center gap-4'>
      <InputFileForm
        imgSource={profile?.avatar_url}
        callback={handleImageUpdateBind}
        showRemoveButton={false}
        iconName='photo-edit'
        renderImage={
          <CustomImage
            alt='item'
            src={profile?.avatar_url}
            shadow='md'
            rounded='full'
            className='group-hover:opacity-75 transition-opacity'
            cover
            width={200}
            height={200}
          />
        }
      />
    </div>
  );
}
