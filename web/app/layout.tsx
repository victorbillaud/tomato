import AuthButton from '@/components/AuthButton';
import { GeistSans } from 'geist/font';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body className='flex min-h-screen w-full flex-1 flex-col items-center justify-between gap-20 bg-background text-foreground'>
        <nav className='flex h-16 w-full justify-center border-b border-b-foreground/10'>
          <div className='flex w-full max-w-4xl items-center justify-between p-3 text-sm'>
            <AuthButton />
          </div>
        </nav>

        <main className='animate-in flex max-w-4xl flex-1 flex-col gap-20 px-3 opacity-0'>
          {children}
        </main>

        <footer className='flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs'>
          <p>
            Powered by <strong>Tomato</strong>
          </p>
        </footer>
      </body>
    </html>
  );
}
