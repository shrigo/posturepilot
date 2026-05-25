import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/context/ClientContext';

export const metadata: Metadata = {
  title: 'PosturePilot — Cybersecurity Command Center',
  description: 'Unified cybersecurity posture dashboard. Upload scan results from Qualys, Tenable, or Nessus and get board-ready dashboards in minutes.',
  keywords: 'cybersecurity dashboard, vulnerability management, CISO dashboard, Qualys, Tenable, security posture',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
