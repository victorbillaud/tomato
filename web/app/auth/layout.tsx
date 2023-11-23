export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex w-full max-w-lg flex-1 flex-col items-center justify-center'>
      {children}
    </main>
  );
}
