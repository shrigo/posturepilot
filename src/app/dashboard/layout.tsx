'use client';
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ClientProvider, useClient } from '@/context/ClientContext';

const routeMetadata: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': {
    title: '🏢 Main Terminal',
    subtitle: 'All Dashboards · Acme Financial Corp',
  },
  '/dashboard/posture': {
    title: '🛡️ Cyber Posture',
    subtitle: 'Overall risk score, threat level & threat intelligence feed',
  },
  '/dashboard/cloud': {
    title: '☁️ Cloud Altitude',
    subtitle: 'Misconfigurations, IAM risk & storage exposure across cloud assets',
  },
  '/dashboard/network': {
    title: '🌐 Network Security',
    subtitle: 'Firewall events, IDS alerts, blocked IPs & VPN sessions',
  },
  '/dashboard/infosec': {
    title: '📋 Compliance Checkpoint',
    subtitle: 'Policy violations, access control audits & data classification',
  },
  '/dashboard/kpi': {
    title: '📊 Security KPIs',
    subtitle: 'MTTA, MTTR, Patch SLA compliance & team performance',
  },
  '/dashboard/appsec': {
    title: '🔐 App Security',
    subtitle: 'OWASP findings, SAST/DAST results & dependency vulnerabilities',
  },
  '/dashboard/traffic': {
    title: '📡 ATC Monitor',
    subtitle: 'Network traffic analysis, anomaly detection & bandwidth usage',
  },
  '/dashboard/server': {
    title: '🖥️ Server Health',
    subtitle: 'Patch status, EDR coverage & endpoint health monitoring',
  },
  '/dashboard/ai-risk': {
    title: '🤖 AI Risk',
    subtitle: 'Shadow AI detection, model vulnerabilities & data exposure risks',
  },
  '/dashboard/ciso': {
    title: '👑 CISO Executive Cockpit',
    subtitle: 'Combined multi-tenant executive reporting and customizable security telemetry cockpit',
  },
  '/dashboard/findings': {
    title: '🔍 Baggage Claim',
    subtitle: 'All parsed CVEs & vulnerabilities from uploaded scans',
  },
  '/dashboard/upload': {
    title: '📤 Scan Check-In',
    subtitle: 'Import findings from Qualys, Tenable, Nessus or CSV — results go live instantly',
  },
  '/dashboard/settings': {
    title: '⚙️ Self-Service Kiosk',
    subtitle: 'Tenant configuration, API keys & integrations',
  },
  '/dashboard/secure': {
    title: '📡 Risk Radar',
    subtitle: 'Vulnerability Triage & Prioritized Exposure Engine',
  },
  '/dashboard/identity': {
    title: '🔑 Identity Shield',
    subtitle: 'Your Gatekeeper — SSO directory auditing, privilege drift scanning & Zero-Trust MFA',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentClient } = useClient();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  let bgClass = 'bg-default';
  if (pathname.includes('/posture')) bgClass = 'bg-posture';
  else if (pathname.includes('/cloud')) bgClass = 'bg-cloud';
  else if (pathname.includes('/network')) bgClass = 'bg-network';
  else if (pathname.includes('/infosec')) bgClass = 'bg-infosec';
  else if (pathname.includes('/kpi')) bgClass = 'bg-kpi';
  else if (pathname.includes('/appsec')) bgClass = 'bg-appsec';
  else if (pathname.includes('/traffic')) bgClass = 'bg-traffic';
  else if (pathname.includes('/server')) bgClass = 'bg-server';
  else if (pathname.includes('/ai-risk')) bgClass = 'bg-ai-risk';
  else if (pathname.includes('/findings')) bgClass = 'bg-findings';
  else if (pathname.includes('/upload')) bgClass = 'bg-upload';
  else if (pathname.includes('/settings')) bgClass = 'bg-settings';

  const metadata = routeMetadata[pathname] || 
                   Object.entries(routeMetadata).find(([key]) => key !== '/dashboard' && pathname.startsWith(key))?.[1] || 
                   routeMetadata['/dashboard'];

  const dynamicSubtitle = metadata.subtitle?.replace('Acme Financial Corp', currentClient.name);

  return (
    <div className={`app-layout ${bgClass}`}>
      <Sidebar />
      <div className="main-content">
        <Topbar title={metadata.title} subtitle={dynamicSubtitle} />
        <div ref={scrollContainerRef} className="content-scroll-container">
          {children}
        </div>
      </div>
    </div>
  );
}
