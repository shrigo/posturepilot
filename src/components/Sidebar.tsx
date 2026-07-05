import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useClient } from '@/context/ClientContext';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { href: '/dashboard',          label: 'Command Center' },
  { href: '/dashboard/posture',  label: 'Security Posture',    badge: '3' },
  { href: '/dashboard/ai-risk',  label: 'AI Risk',             badge: 'NEW' },
  { href: '/dashboard/appsec',   label: 'AppSec',              badge: '14' },
  { href: '/dashboard/cloud',    label: 'Cloud Security' },
  { href: '/dashboard/infosec',  label: 'Compliance Center' },
  { href: '/dashboard/dispatch', label: 'Incident Response',   badge: 'SOAR' },
  { href: '/dashboard/server',   label: 'Server Health',       badge: '3' },
  { href: '/dashboard/kpi',      label: 'KPI Metrics' },
  { href: '/dashboard/identity', label: 'Identity & Access',   badge: 'NEW' },
  { href: '/dashboard/network',  label: 'Network Security',    badge: '34' },
  { href: '/dashboard/secure',   label: 'Risk Radar',          badge: 'NEW' },
  { href: '/dashboard/traffic',  label: 'Traffic & Threats' },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { currentClient } = useClient();
  const [lockedModule, setLockedModule] = useState<string | null>(null);
  const [submittingUpgrade, setSubmittingUpgrade] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'alpha'>('default');

  const adminEmails = ['shrigo.now@gmail.com', 'shrigonow@gmail.com', 'demo@posturepilot.io'];
  const isAdmin = session?.user?.email && adminEmails.includes(session.user.email);

  const handleLinkClick = () => {
    const layout = document.querySelector('.app-layout');
    if (layout) {
      layout.classList.remove('sidebar-mobile-open');
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    const isAllowed = currentClient.allowedModules?.includes(href);
    if (!isAllowed) {
      e.preventDefault();
      setLockedModule(label);
      return;
    }
    handleLinkClick();
  };

  const handleUpgradeRequest = async () => {
    if (submittingUpgrade || !lockedModule) return;
    setSubmittingUpgrade(true);
    try {
      const res = await fetch('/api/admin/upgrade-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: currentClient.name === 'Self-Service Sandbox' ? '' : currentClient.name,
          moduleName: lockedModule
        })
      });
      if (res.ok) {
        alert(`Thank you! Access request for "${lockedModule}" has been submitted to your Account Manager.`);
      } else {
        alert('Failed to log upgrade request. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingUpgrade(false);
      setLockedModule(null);
    }
  };

  const sortedNavItems = [...navItems].sort((a, b) => {
    if (sortOrder === 'alpha') {
      return a.label.localeCompare(b.label);
    }
    return 0; // default order
  });

  return (
    <aside className="sidebar">
      {/* Mobile Close Button */}
      <button 
        onClick={handleLinkClick}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'none',
          zIndex: 110
        }}
        className="mobile-sidebar-close"
      >
        ✕
      </button>

      <div className="sidebar-logo">
        <Link href="/dashboard" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} onClick={handleLinkClick}>
          <Image
            src="/hlogotag_v2.jpg"
            alt="PosturePilot — Dashboard"
            width={248}
            height={84}
            style={{ objectFit: 'contain' }}
            priority
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '0.75rem' }} className="sidebar-section-label">
        <span>Dashboards</span>
        <button
          onClick={() => setSortOrder(prev => prev === 'default' ? 'alpha' : 'default')}
          style={{
            background: sortOrder === 'alpha' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            border: sortOrder === 'alpha' ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
            color: sortOrder === 'alpha' ? '#a5b4fc' : 'var(--text-muted)',
            fontSize: '0.625rem',
            cursor: 'pointer',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            padding: '2px 8px',
            borderRadius: '4px',
            transition: 'all 0.15s'
          }}
          title={sortOrder === 'default' ? 'Sort Alphabetically (A-Z)' : 'Reset to Default Order'}
        >
          A-Z
        </button>
      </div>
      <nav className="sidebar-nav">
        {sortedNavItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isAllowed = currentClient.allowedModules?.includes(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item${isActive ? ' active' : ''}`} 
              onClick={(e) => handleNavClick(e, item.href, item.label)}
              style={!isAllowed ? { opacity: 0.5, cursor: 'pointer' } : {}}
            >
              <span className="nav-label" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
                {item.label}
                {!isAllowed && <span style={{ fontSize: '0.65rem', color: '#f59e0b', marginLeft: 'auto' }}>🔒</span>}
              </span>
              {item.badge && isAllowed && (
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
        {[
          { href: '/dashboard/ciso', label: 'CISO Cockpit' },
          { href: '/dashboard/findings', label: 'Findings' },
          { href: '/dashboard/upload', label: 'Upload Scans' },
          { href: '/dashboard/settings', label: 'Settings' }
        ].map(dataItem => {
          const isAllowed = currentClient.allowedModules?.includes(dataItem.href);
          const isActive = pathname === dataItem.href;
          return (
            <Link 
              key={dataItem.href}
              href={dataItem.href} 
              className={`nav-item${isActive ? ' active' : ''}`} 
              onClick={(e) => handleNavClick(e, dataItem.href, dataItem.label)}
              style={!isAllowed ? { opacity: 0.5, cursor: 'pointer' } : {}}
            >
              <span className="nav-label" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
                {dataItem.label}
                {!isAllowed && <span style={{ fontSize: '0.65rem', color: '#f59e0b', marginLeft: 'auto' }}>🔒</span>}
              </span>
            </Link>
          );
        })}
        {isAdmin && (
          <Link href="/dashboard/login-tracker" className={`nav-item${pathname === '/dashboard/login-tracker' ? ' active' : ''}`} onClick={handleLinkClick}>
            <span className="nav-label" style={{ color: '#a78bfa', fontWeight: 700 }}>Login Tracker</span>
          </Link>
        )}
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
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session?.user?.name || 'User'}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              currentClient.avatar
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.name || currentClient.name}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{currentClient.tier} Plan</div>
          </div>
          {/* Sign Out — always visible in sidebar (critical for mobile where topbar button is hidden) */}
          <button
            onClick={() => {
              sessionStorage.removeItem('posturepilot_demo_mode');
              handleLinkClick();
              signOut({ callbackUrl: '/' });
            }}
            title="Sign out"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              color: '#f87171',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 10px',
              flexShrink: 0,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* ── Upgrade Plan Premium Modal ── */}
      {lockedModule && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            background: 'linear-gradient(160deg, #1e1b4b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 24,
            padding: '2.5rem',
            maxWidth: '460px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            position: 'relative'
          }}>
            {/* Upgrade Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.5rem'
            }}>
              ⭐ Premium Module Gate
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Upgrade License
            </h3>
            
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
              Access to **{lockedModule}** is restricted under the current **{currentClient.tier}** subscription tier of {currentClient.name}. Contact your account manager to activate this component.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleUpgradeRequest}
                disabled={submittingUpgrade}
                style={{
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: submittingUpgrade ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                  transition: 'opacity 0.2s',
                  opacity: submittingUpgrade ? 0.7 : 1
                }}
              >
                {submittingUpgrade ? 'Submitting Request...' : 'Request Instants Expansion'}
              </button>

              <button 
                onClick={() => setLockedModule(null)}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                Close Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
