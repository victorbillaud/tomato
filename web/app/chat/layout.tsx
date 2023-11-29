export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-[80vh] w-full overflow-hidden sm:space-x-2'>
      {children}
    </div>
  );
}
