import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/contexts/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Ahsan Shop — Billing & Finance',
    template: '%s | Ahsan Shop',
  },
  description: 'Billing, invoicing, and finance management for Ahsan Shop — stationery & school uniforms.',
  keywords: ['billing', 'invoicing', 'POS', 'finance', 'school uniforms', 'stationery'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontSize: '15px', fontWeight: '500' },
              duration: 4000,
            }}
            richColors
          />
        </AuthProvider>
      </body>
    </html>
  )
}
