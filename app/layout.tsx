import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Space_Mono } from 'next/font/google'
import '../styles/globals.css'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { Agentation } from "agentation";
import { THEME_BOOTSTRAP_SCRIPT } from '@/lib/theme-bootstrap'

const TYPOGRAPHER_CSS =
  'https://typographer.io/1/users/9007cc8e614ebce0747a903974153498c926d163cebeed8c66be1914012aebf4/f9899ed5856b1909e5770c493a1038355e947a5e86a1a5cacfa8775838c7bd03/css?token=49a699a68a'
const TYPOGRAPHER_BEACON =
  'https://use.typographer.io/1/users/9007cc8e614ebce0747a903974153498c926d163cebeed8c66be1914012aebf4/f9899ed5856b1909e5770c493a1038355e947a5e86a1a5cacfa8775838c7bd03/css?token=49a699a68a'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

const switzer = localFont({
  src: '../public/fonts/Switzer-Variable.woff2',
  variable: '--font-switzer-face',
  weight: '100 900',
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
    <html
      lang="en"
      className={`dark ${switzer.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://typographer.io/" />
        <link rel="stylesheet" href={TYPOGRAPHER_CSS} />
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `try{navigator.sendBeacon(${JSON.stringify(TYPOGRAPHER_BEACON)})}catch{}`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="font-body">
        {children}
        <AnalyticsProvider
          gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID}
          clarityId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
        />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  )
}
