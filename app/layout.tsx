import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DTS - Document Tracking System',
  description: 'Manage and track your documents efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="text-foreground">
        {children}
      </body>
    </html>
  )
}
