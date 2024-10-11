import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

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
    <html lang="fr" className={outfit.className}>
      <body>{children}</body>
    </html>
  );
}
