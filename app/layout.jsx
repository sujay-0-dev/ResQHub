import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/use-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ResQHub 2.0 - Emergency Response Platform',
  description: 'Real-world emergency and disaster assistance platform connecting victims, volunteers, NGOs, and government bodies in real-time.',
  keywords: 'emergency response, disaster relief, NGO coordination, government emergency management, volunteer network',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
