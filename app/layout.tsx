import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Carte - Menu Translator',
  description: 'Mobile-first menu translator and advisor using Claude vision',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}