import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import '../styles/globals.css'
import AnalyticsProvider from '@/components/AnalyticsProvider'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

const switzer = localFont({
  src: '../public/fonts/Switzer-Variable.woff2',
  variable: '--font-switzer',
  display: 'swap',
})


export const metadata: Metadata = {
  title: {
    template: '%s | Samuel Wong — Hong Kong UI/UX Designer | Desktop of Samuel',
    default: 'Samuel Wong — Hong Kong UI/UX Designer | Desktop of Samuel',
  },
  description: "I'm Samuel, I'm a Hong Kong based UI/UX Designer. User Interface Design, User Experience Design, Product Design, Design Thinking, Product Development, Brand Design - A personal design portfolio, also journal for designers' side-projects.",
  keywords: "科技,設計,UI,UX,旅行,城市,香港",
  authors: [{ name: 'Samuel W.' }],
  creator: 'Samuel W.',
  publisher: 'Samuel Wong — Hong Kong UI/UX Designer | Desktop of Samuel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://desktopofsamuel.com'),
  openGraph: {
    title: 'Desktop of Samuel',
    description: 'UI/UX 設計師，談談科技、Gadget心得。',
    url: 'https://desktopofsamuel.com',
    siteName: 'Samuel Wong — Hong Kong UI/UX Designer | Desktop of Samuel',
    images: [
      {
        url: 'https://desktopofsamuel.com/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'Desktop of Samuel',
      },
    ],
    locale: 'en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desktop of Samuel',
    description: 'UI/UX 設計師，談談科技、Gadget心得。',
    creator: '@desktopofsamuel',
    site: '@desktopofsamuel',
    images: ['https://desktopofsamuel.com/opengraph.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: 'https://desktopofsamuel.com/favicon.png',
    apple: [
      {
        url: 'https://desktopofsamuel.com/touch-icon-ipad.jpg',
        sizes: '76x76',
        type: 'image/jpeg',
      },
    ],
  },
  verification: {
    // Add any verification codes if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${switzer.variable} ${spaceMono.variable}`}>
      <body className={switzer.className}>
        {children}
        <AnalyticsProvider gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID ?? ''} />
      </body>
    </html>
  )
}
