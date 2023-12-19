import { Text } from '@/components/common/text';
import Navbar from '@/components/nav/Navbar';
import { GeistSans } from 'geist/font';

import { NotificationProvider } from '@/components/notification/NotificationContext';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Tomato',
  description: 'Traceable Objects Management and Tracking Operation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <NotificationProvider>
        <body className='flex h-screen max-h-screen w-full flex-col items-center justify-start gap-2 bg-zinc-50 dark:bg-zinc-800 sm:gap-5'>
          <nav className='dark:bg-dark-200 flex h-16 w-full justify-center border-b border-b-stone-300 bg-zinc-100 dark:border-b-stone-700 dark:bg-zinc-900'>
            <div className='flex w-full max-w-5xl items-center justify-between p-3 text-sm'>
              <Navbar />
            </div>
          </nav>

          <main className='animate-in flex w-full max-w-5xl flex-1 flex-col items-center gap-20 px-0 opacity-0 sm:px-3'>
            {children}
          </main>

          <footer className='flex w-full justify-center border-t border-t-stone-300 bg-zinc-100 p-8 text-center text-xs dark:border-t-stone-700 dark:bg-zinc-900'>
            <Text variant={'caption'} className='text-center'>
              powered by <strong>Tomato</strong>
            </Text>
          </footer>
        </body>
      </NotificationProvider>
    </html>
  );
}
