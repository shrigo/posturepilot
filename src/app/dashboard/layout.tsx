'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ClientProvider, useClient } from '@/context/ClientContext';
import { useSession } from 'next-auth/react';
import MythosPromo from '@/components/MythosPromo';

const routeMetadata: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': {
    title: 'Command Center',
    subtitle: 'All Dashboards · Acme Financial Corp',
  },
  '/dashboard/posture': {
    title: 'Security Posture',
    subtitle: 'Overall risk score, threat level & threat intelligence feed',
  },
  '/dashboard/cloud': {
    title: 'Cloud Security',
    subtitle: 'Misconfigurations, IAM risk & storage exposure across cloud assets',
  },
  '/dashboard/network': {
    title: 'Network Security',
    subtitle: 'Firewall events, IDS alerts, blocked IPs & VPN sessions',
  },
  '/dashboard/infosec': {
    title: 'Compliance Center',
    subtitle: 'Policy violations, access control audits & data classification',
  },
  '/dashboard/kpi': {
    title: 'KPI Metrics',
    subtitle: 'MTTA, MTTR, Patch SLA compliance & team performance',
  },
  '/dashboard/appsec': {
    title: 'AppSec',
    subtitle: 'OWASP findings, SAST/DAST results & dependency vulnerabilities',
  },
  '/dashboard/traffic': {
    title: 'Traffic & Threats',
    subtitle: 'Network traffic analysis, anomaly detection & bandwidth usage',
  },
  '/dashboard/server': {
    title: 'Server Health',
    subtitle: 'Patch status, EDR coverage & endpoint health monitoring',
  },
  '/dashboard/ai-risk': {
    title: 'AI Risk',
    subtitle: 'Shadow AI detection, model vulnerabilities & data exposure risks',
  },
  '/dashboard/ciso': {
    title: 'CISO Cockpit',
    subtitle: 'Combined multi-tenant executive reporting and customizable security telemetry cockpit',
  },
  '/dashboard/findings': {
    title: 'Findings',
    subtitle: 'All parsed CVEs & vulnerabilities from uploaded scans',
  },
  '/dashboard/upload': {
    title: 'Upload Scans',
    subtitle: 'Import findings from Qualys, Tenable, Nessus or CSV — results go live instantly',
  },
  '/dashboard/settings': {
    title: 'Settings',
    subtitle: 'Tenant configuration, API keys & integrations',
  },
  '/dashboard/secure': {
    title: 'Risk Radar',
    subtitle: 'Vulnerability Triage & Prioritized Exposure Engine',
  },
  '/dashboard/identity': {
    title: 'Identity & Access',
    subtitle: 'SSO directory auditing, privilege drift scanning & Zero-Trust MFA',
  },
  '/dashboard/dispatch': {
    title: 'Incident Response',
    subtitle: 'SOAR automated routing, Jira & ServiceNow ticketing integrations & active owner gates',
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

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // Check demo mode initial state
  const { status } = useSession();

  useEffect(() => {
    // Wait for session to finish loading before deciding
    if (status === 'loading') return;

    // If the user is authenticated, ensure demo mode is disabled so they have full access.
    if (status === 'authenticated') {
      setIsDemoMode(false);
      setShowLockModal(false);
      sessionStorage.removeItem('posturepilot_demo_mode');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true' || sessionStorage.getItem('posturepilot_demo_mode') === 'true') {
      setIsDemoMode(true);
      sessionStorage.setItem('posturepilot_demo_mode', 'true');
    }
  }, [status]);

  // Scroll to top whenever the route changes (window is the actual scroll host, but content-scroll-container may also scroll)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const contentContainer = document.querySelector('.content-scroll-container');
    if (contentContainer) {
      contentContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);

  // Global capture click listener to block all interactions in guest demo mode
  useEffect(() => {
    if (!isDemoMode) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow clicks on the lock modal, the mythos promo popup, or their inner interactive parts
      if (target.closest('.demo-lock-modal') || target.closest('.mythos-promo-modal')) {
        return;
      }
      
      // Block all other interaction clicks on the dashboard and trigger the lock warning modal
      e.preventDefault();
      e.stopPropagation();
      setShowLockModal(true);
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [isDemoMode]);

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
        <div className="content-scroll-container">
          {children}
        </div>
      </div>

      {/* Demo Lock Alert Modal Overlay */}
      {showLockModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {/* Blur glass backdrop */}
          <div 
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(6px)" }} 
            onClick={() => setShowLockModal(false)}
          />
          {/* Lock popup frame */}
          <div className="demo-lock-modal" style={{
            background: "#ffffff",
            color: "#0f172a",
            width: "90vw",
            maxWidth: "480px",
            borderRadius: "20px",
            padding: "2rem",
            position: "relative",
            zIndex: 10010,
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
            border: "1px solid #cbd5e1",
            textAlign: "center",
            fontFamily: "Inter, sans-serif"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem 0", letterSpacing: "-0.02em" }}>
              Demo Workspace Locked
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.5, margin: "0 0 2rem 0" }}>
              You are currently viewing the live command center in <strong>Read-Only Demo Mode</strong>. To explore other panels, configure integrations, or configure custom SLA gates, upgrade to a professional cockpit plan.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button 
                onClick={() => {
                  setShowLockModal(false);
                  setShowPromoModal(true);
                }}
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                  transition: "transform 0.15s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                ✨ View Pricing & Upgrade
              </button>
              <button 
                onClick={() => {
                  window.location.href = "/login";
                }}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
              >
                Sign In to Account
              </button>
              <button 
                onClick={() => setShowLockModal(false)}
                style={{
                  background: "transparent",
                  color: "#94a3b8",
                  border: "none",
                  padding: "0.5rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Continue as Read-Only Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing and Promo modal launched inside dashboard */}
      {showPromoModal && (
        <MythosPromo 
          onClose={() => setShowPromoModal(false)}
          initialSlide={3}
        />
      )}
    </div>
  );
}
