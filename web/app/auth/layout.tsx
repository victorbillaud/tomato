import AuthProviders from '@/components/AuthProviders';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex w-full max-w-lg flex-1 flex-col items-center justify-center'>
      <AuthProviders />
      <div className='my-5 h-0.5 w-2/3 rounded-full border border-stone-200 opacity-50 dark:border-stone-700'></div>
      {children}
    </main>
  );
}
