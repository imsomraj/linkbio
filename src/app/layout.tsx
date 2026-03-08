// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'LinkBio – Your Link in Bio, Reimagined', template: '%s | LinkBio' },
  description: 'Create your beautiful link in bio page. Share all your links, social profiles and more – in one stunning page.',
  keywords: ['link in bio', 'linktree alternative', 'india', 'social links'],
  authors: [{ name: 'LinkBio' }],
  openGraph: {
    type: 'website',
    siteName: 'LinkBio',
    title: 'LinkBio – Your Link in Bio, Reimagined',
    description: 'Create your beautiful link in bio page.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
