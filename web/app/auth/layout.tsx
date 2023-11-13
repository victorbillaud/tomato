import AuthProviders from '@/components/AuthProviders';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <AuthProviders />
      <div className='my-5 h-0.5 w-2/3 rounded-full border border-gray-200 dark:border-gray-700'></div>
      {children}
    </main>
  );
}
