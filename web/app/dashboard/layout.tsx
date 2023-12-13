export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-start px-3'>
      {children}
    </div>
  );
}
