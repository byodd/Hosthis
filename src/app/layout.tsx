import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import SessionWrapper from "../components/SessionWrapper"

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HostThis - Hébergement web",
  description: "Hébergement web simple et rapide 🌐",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionWrapper>
      <html lang="fr" className={outfit.className}>
        <body>{children}</body>
      </html>
      </SessionWrapper>
  );
}
