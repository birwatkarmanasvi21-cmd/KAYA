import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: 'KAYA',
  description: 'Your personalized health AI advisor with confidence ratings, severity assessments, and emergency safety features.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    userScalable: true,
    viewportFit: 'cover',
  },
  icons: {
    icon: [
      {
        url: '/kaya-coffee.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/kaya-coffee.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/kaya-coffee.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
