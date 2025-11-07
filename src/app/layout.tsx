import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Introspect - AI-Powered Project Discovery',
  description: 'Transform client conversations into complete technical specifications through intelligent orchestration.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

