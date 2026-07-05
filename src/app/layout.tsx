import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/context/ClientContext';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'PosturePilot — Cybersecurity Command Center',
  description: 'Unified cybersecurity posture dashboard. Upload scan results from Qualys, Tenable, or Nessus and get board-ready dashboards in minutes.',
  keywords: 'cybersecurity dashboard, vulnerability management, CISO dashboard, Qualys, Tenable, security posture',
  icons: {
    icon: '/pp_icon.gif',
    shortcut: '/pp_icon.gif',
    apple: '/pp_icon.gif',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/pp_icon.gif" type="image/gif" />
        <link rel="shortcut icon" href="/pp_icon.gif" type="image/gif" />
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
