'use client';
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ClientProvider, useClient } from '@/context/ClientContext';

const routeMetadata: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': {
    title: '🛫 Flight Deck',
    subtitle: 'Aggregated multi-cloud telemetry, active airspace threat maps & fleet-wide risk posture',
  },
  '/dashboard/posture': {
    title: '🛡️ Cyber Posture',
    subtitle: 'Overall security integrity rating, fuselage vulnerability sweeps & structural drift scores',
  },
  '/dashboard/cloud': {
    title: '☁️ Cloud Altitude',
    subtitle: 'Multi-tenant cloud exposure auditing, IAM role maps & storage bucket leak sweeps',
  },
  '/dashboard/network': {
    title: '🌐 Network Airspace',
    subtitle: 'Boundary firewall rules, open gateway port mapping & real-time ingress alert logs',
  },
  '/dashboard/infosec': {
    title: '📋 Compliance Checkpoint',
    subtitle: 'Framework control tracking (SOC2, ISO27001, HIPAA) & compliance checklists',
  },
  '/dashboard/kpi': {
    title: '📊 Telemetry & Altimeters',
    subtitle: 'Security SLA remediation tracking, patch altitude gates & mean-time-to-resolve (MTTR) speedways',
  },
  '/dashboard/appsec': {
    title: '🔐 Carry-On Security',
    subtitle: 'Software supply chain vetting, container registry safety & application API boundary checks',
  },
  '/dashboard/traffic': {
    title: '📡 Traffic ATC',
    subtitle: 'Real-time inbound packet inspections, packet routing paths & active DDoS airspace blocks',
  },
  '/dashboard/server': {
    title: '🖥️ Server Terminal',
    subtitle: 'Hardware health diagnostics, CPU/Memory telemetry & host OS kernel patching states',
  },
  '/dashboard/ai-risk': {
    title: '🤖 Shadow Copilot',
    subtitle: 'Shadow AI model discovery, LLM training prompt leakage sweeps & unapproved model guardrails',
  },
  '/dashboard/ciso': {
    title: '👑 CISO Executive Cockpit',
    subtitle: 'Combined multi-tenant executive reporting and customizable security telemetry cockpit',
  },
  '/dashboard/findings': {
    title: '🔍 Baggage Claim',
    subtitle: 'Consolidated vulnerability arrivals desk & actionable CVE repair checklists',
  },
  '/dashboard/upload': {
    title: '📤 Scan Check-In',
    subtitle: 'Ingesting Qualys, Tenable, and Nessus reports to populate your active flight telemetry',
  },
  '/dashboard/settings': {
    title: '⚙️ Self-Service Kiosk',
    subtitle: 'Enterprise SSO configurations, API key distribution & external ticketing gates',
  },
  '/dashboard/secure': {
    title: '📡 Risk Radar',
    subtitle: 'Vulnerability Triage & Prioritized Exposure Engine — scanning for weaponized exploit storms',
  },
  '/dashboard/identity': {
    title: '🔑 Passport Control',
    subtitle: 'Your Gatekeeper — SSO directory auditing, privilege drift scanning & Zero-Trust MFA checkpoints',
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
