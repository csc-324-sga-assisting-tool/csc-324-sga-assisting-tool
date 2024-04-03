import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar, NavbarBrand, ThemeModeScript } from 'flowbite-react';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className}`} >
        <Navbar fluid>
          <NavbarBrand>
            <img src="gbudget-logo.png" className="mr-3 sm:h-9" alt="Gbudget Logo" />
            <span className="self-center whitespace-nowrap text-xl font-bold text-gray"> GBudget </span>
          </NavbarBrand>
        </Navbar>
        {children}
      </body>
    </html >
  );
}
