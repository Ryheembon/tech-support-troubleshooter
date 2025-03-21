import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Network Support Assistant',
  description: 'Get help with your network issues',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 