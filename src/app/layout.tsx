import type { Metadata } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chessie — Wanna Play?',
  description:
    'Your cozy AI chess companion. Relax, play, and learn together in a warm, welcoming room.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#140b07] font-sans text-[#fdfbf7] selection:bg-amber-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
