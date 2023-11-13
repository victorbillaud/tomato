import AuthProviders from '@/components/AuthProviders';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <AuthProviders />
      <div className='w-2/3 rounded-lg border border-gray-300' />
      {children}
    </main>
  );
}
