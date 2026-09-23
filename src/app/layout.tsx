import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/context/ClientContext';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'PosturePilot — Cybersecurity Command Center',
  description: 'Unified cybersecurity posture dashboard. Upload scan results from Qualys, Tenable, or Nessus and get board-ready dashboards in minutes.',
  keywords: 'cybersecurity dashboard, vulnerability management, CISO dashboard, Qualys, Tenable, security posture',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/pp_icon.gif', type: 'image/gif' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ClientProvider>
            {children}
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
