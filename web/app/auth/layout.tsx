export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-1 flex-col items-center justify-center gap-20 px-3'>
      {children}
    </main>
  );
}
