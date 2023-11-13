import { cookies } from 'next/headers';

export default async function Index() {
  const cookieStore = cookies();

  return (
    <div className='flex w-full flex-1 flex-col items-center gap-20'>
      <div className='animate-in flex max-w-4xl flex-1 flex-col gap-20 px-3 opacity-0'>
        <h1 className='text-center text-4xl font-bold'>Tomato</h1>
      </div>
    </div>
  );
}
