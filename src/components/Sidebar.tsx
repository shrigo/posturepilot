'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useClient } from '@/context/ClientContext';

const navItems = [
  { href: '/dashboard',          icon: '🏢', label: 'Main Terminal' },
  { href: '/dashboard/posture',  icon: '🛡️', label: 'Posture Clearance', badge: '3' },
  { href: '/dashboard/cloud',    icon: '☁️', label: 'Cloud Altitude' },
  { href: '/dashboard/network',  icon: '🌐', label: 'Network Runway',    badge: '34' },
  { href: '/dashboard/infosec',  icon: '📋', label: 'Compliance Checkpoint' },
  { href: '/dashboard/kpi',      icon: '📊', label: 'Flight Telemetry (KPIs)' },
  { href: '/dashboard/appsec',   icon: '🔐', label: 'AppSec Check',      badge: '14' },
  { href: '/dashboard/traffic',  icon: '🗼', label: 'Traffic Control' },
  { href: '/dashboard/server',   icon: '🖥️', label: 'Fleet Health',       badge: '3' },
  { href: '/dashboard/ai-risk',  icon: '🤖', label: 'AI Risk',           badge: 'NEW' },
  { href: '/dashboard/identity', icon: '🔑', label: 'Identity Shield',    badge: 'NEW' },
  { href: '/dashboard/secure',   icon: '📡', label: 'Risk Radar',         badge: 'NEW' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentClient } = useClient();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link href="/" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Image
            src="/hlogotag.jpg"
            alt="PosturePilot — Home"
            width={248}
            height={84}
            style={{ objectFit: 'contain' }}
            priority
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </Link>
      </div>

      <div className="sidebar-section-label">Dashboards</div>
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge" style={item.badge === 'NEW' ? { background: '#7c3aed' } : {}}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-section-label">Data</div>
      <nav className="sidebar-nav" style={{ paddingTop: 0 }}>
        <Link href="/dashboard/ciso" className={`nav-item${pathname === '/dashboard/ciso' ? ' active' : ''}`}>
          <span className="nav-icon">👑</span>
          <span className="nav-label">CISO Cockpit</span>
        </Link>
        <Link href="/dashboard/findings" className={`nav-item${pathname === '/dashboard/findings' ? ' active' : ''}`}>
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Baggage Claim</span>
        </Link>
        <Link href="/dashboard/upload" className={`nav-item${pathname === '/dashboard/upload' ? ' active' : ''}`}>
          <span className="nav-icon">📤</span>
          <span className="nav-label">Scan Check-In</span>
        </Link>
        <Link href="/dashboard/settings" className={`nav-item${pathname === '/dashboard/settings' ? ' active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Self-Service Kiosk</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            background: currentClient.key === 'UR' ? 'linear-gradient(135deg, #7c3aed, #059669)' : 'linear-gradient(135deg, #3b82f6, #0891b2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: '#fff', 
            flexShrink: 0,
            transition: 'all 0.3s ease'
          }}>
            {currentClient.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentClient.name}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Professional Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
