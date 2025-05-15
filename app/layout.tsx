import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Detectly',
  description: 'Detectly is a medical image analysis platform that uses AI to help doctors diagnose and treat patients.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
