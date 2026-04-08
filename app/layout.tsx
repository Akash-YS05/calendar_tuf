import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Great_Vibes, Anek_Malayalam } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-artistic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Wall Calendar",
  description:
    "Interactive wall calendar with date range selection and locally persisted notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}>
      <body className="min-h-[100dvh] flex flex-col overflow-x-hidden">
        {children}
        <Analytics/>  
      </body>
    </html>
  );
}
