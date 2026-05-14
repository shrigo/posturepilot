import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PosturePilot — Cybersecurity Command Center',
  description: 'Unified cybersecurity posture dashboard. Upload scan results from Qualys, Tenable, or Nessus and get board-ready dashboards in minutes.',
  keywords: 'cybersecurity dashboard, vulnerability management, CISO dashboard, Qualys, Tenable, security posture',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
