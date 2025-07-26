import { Metadata } from 'next';
import { ReactNode } from 'react';
import AppLayout from '@/components/AppLayout';

export const metadata: Metadata = {
  title: 'Feed | Desktop of Samuel',
  description: 'A collection of interesting links, thoughts, and discoveries.',
  openGraph: {
    title: 'Feed | Desktop of Samuel',
    description: 'A collection of interesting links, thoughts, and discoveries.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Feed | Desktop of Samuel',
    description: 'A collection of interesting links, thoughts, and discoveries.',
  },
};

interface FeedLayoutProps {
  children: ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Feed</h1>
          <p className="text-lg text-gray-600">
            A collection of interesting links, thoughts, and discoveries.
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </AppLayout>
  );
}