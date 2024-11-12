import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import SessionWrapper from "./components/SessionWrapper"

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HostThis - Hébergement web",
  description: "Hébergement web simple et rapide 🌐",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionWrapper>
      <html lang="fr" className={outfit.className}>
        <body className="text-[#023246] p-10 h-screen w-screen">{children}</body>
      </html>
    </SessionWrapper>
  );
}
