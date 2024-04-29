import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ThemeModeScript} from 'flowbite-react';
import {ComponentNav} from './navbarComp';
import {Suspense} from 'react';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Gbudget',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className}`}>
        <ComponentNav buttonLabel={'Log Out'} />
        <Suspense fallback={<p>Loading ...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
