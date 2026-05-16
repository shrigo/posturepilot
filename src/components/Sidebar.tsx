'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard',          icon: '🏠', label: 'Overview' },
  { href: '/dashboard/posture',  icon: '🛡️', label: 'Cyber Posture',     badge: '3' },
  { href: '/dashboard/cloud',    icon: '☁️', label: 'Cloud Security' },
  { href: '/dashboard/network',  icon: '🌐', label: 'Network Security',  badge: '34' },
  { href: '/dashboard/infosec',  icon: '📋', label: 'Info Security' },
  { href: '/dashboard/kpi',      icon: '📊', label: 'Security KPIs' },
  { href: '/dashboard/appsec',   icon: '🔐', label: 'App Security',      badge: '14' },
  { href: '/dashboard/traffic',  icon: '📡', label: 'Traffic Monitor' },
  { href: '/dashboard/server',   icon: '🖥️', label: 'Server Health',     badge: '3' },
  { href: '/dashboard/ai-risk',  icon: '🤖', label: 'AI Risk',           badge: 'NEW' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ padding: '1rem 1.25rem', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
        <Link href="/" style={{ display:'block', lineHeight:0 }}>
          <Image
            src="/navbarlogoh.jpg"
            alt="PosturePilot — Home"
            width={200}
            height={54}
            style={{ objectFit: 'contain', objectPosition: 'left' }}
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
        <Link href="/dashboard/upload" className={`nav-item${pathname === '/dashboard/upload' ? ' active' : ''}`}>
          <span className="nav-icon">📤</span>
          <span className="nav-label">Upload Scan</span>
        </Link>
        <Link href="/dashboard/settings" className={`nav-item${pathname === '/dashboard/settings' ? ' active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>AF</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Acme Financial</div>
            <div style={{ fontSize: '0.65rem', color: '#475569' }}>Professional Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
