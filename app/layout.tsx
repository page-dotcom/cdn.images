import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fcfcfc', color: '#111' }} className={inter.className}>
        {children}
      </body>
    </html>
  );
}
