'use client';
import { useState, useRef, useEffect } from 'react';
import { useClient, clients, ClientKey } from '@/context/ClientContext';
import { useSession, signOut } from 'next-auth/react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

const clientMeta: Record<ClientKey, { industry: string; icon: string; color: string; colorLight: string }> = {
  WELLS:  { industry: 'Financial',     icon: '🏦', color: '#dc2626', colorLight: '#fef2f2' },
  TOYOTA: { industry: 'Automotive',    icon: '🚗', color: '#ea580c', colorLight: '#fff7ed' },
  UR:     { industry: 'Services',      icon: '🏗️', color: '#10b981', colorLight: '#f0fdf4' },
  CISCO:  { industry: 'Technology',    icon: '💻', color: '#06b6d4', colorLight: '#ecfeff' },
  DISNEY: { industry: 'Entertainment', icon: '🎬', color: '#a855f7', colorLight: '#faf5ff' },
};

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { data: session } = useSession();
  const { currentClient, allowedClients, setClient, isEnterpriseMode, setIsEnterpriseMode } = useClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<ClientKey | null>(null);
  const [switching, setSwitching] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setHoveredKey(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitch = (key: ClientKey) => {
    if (key === currentClient.key) { setMenuOpen(false); return; }
    setSwitching(true);
    setTimeout(() => {
      setClient(key);
      setMenuOpen(false);
      setHoveredKey(null);
      setSwitching(false);
    }, 180);
  };

  const meta = clientMeta[currentClient.key];
  const hovered = hoveredKey ? clients[hoveredKey] : null;
  const hoveredMeta = hoveredKey ? clientMeta[hoveredKey] : null;

  const toggleMobileSidebar = () => {
    const layout = document.querySelector('.app-layout');
    if (layout) {
      layout.classList.toggle('sidebar-mobile-open');
    }
  };

  return (
    <div className="topbar-wrapper">
      <header className="topbar" style={{ overflow: 'visible' }}>
        <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={toggleMobileSidebar}
            className="mobile-sidebar-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0.25rem',
              marginRight: '0.25rem',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Menu"
          >
            ☰
          </button>
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
          </div>
        </div>

        <div className="topbar-right">

          {/* HUD Badge */}
          <div className="hud-telemetry">
            <span className="hud-pulse" />
            <span>SYS.SEC_V3.8 // ACTIVE</span>
          </div>

          {/* Enterprise Mode Toggle */}
          <div
            onClick={() => setIsEnterpriseMode(!isEnterpriseMode)}
            style={{
              cursor: 'pointer', userSelect: 'none', fontSize: '0.72rem', fontWeight: 700,
              background: isEnterpriseMode ? 'linear-gradient(135deg, #0f172a, #1e293b)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              color: isEnterpriseMode ? '#38bdf8' : '#475569',
              border: isEnterpriseMode ? '1px solid #38bdf8' : '1px solid #cbd5e1',
              borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
              boxShadow: isEnterpriseMode ? '0 0 10px rgba(56,189,248,0.25)' : 'none'
            }}
            title="Toggle White-Label / Enterprise mode"
          >
            <span>{isEnterpriseMode ? '💼 Enterprise Mode' : '🛡️ White-Label'}</span>
          </div>

          {/* ── CLIENT SWITCHER ── */}
          {allowedClients.length > 1 && (
            <div ref={menuRef} style={{ position: 'relative', zIndex: 1000 }}>

            {/* Big visible trigger button */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setHoveredKey(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '6px 14px 6px 8px',
                background: menuOpen
                  ? `linear-gradient(135deg, ${meta.colorLight}, white)`
                  : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                border: `2px solid ${menuOpen ? meta.color : '#e2e8f0'}`,
                borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: menuOpen ? `0 0 0 3px ${meta.color}22` : 'none',
                opacity: switching ? 0.5 : 1,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 800, color: '#fff',
                boxShadow: `0 2px 6px ${meta.color}44`,
              }}>
                {currentClient.avatar}
              </div>

              {/* Text */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
                  {meta.icon} {meta.industry} Client
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                  {currentClient.name}
                </div>
              </div>

              {/* Score badge */}
              <div style={{
                fontSize: '0.78rem', fontWeight: 800,
                background: currentClient.score > 90 ? '#dcfce7' : currentClient.score > 80 ? '#fffbeb' : '#fee2e2',
                color: currentClient.score > 90 ? '#16a34a' : currentClient.score > 80 ? '#d97706' : '#dc2626',
                border: `1px solid ${currentClient.score > 90 ? '#bbf7d0' : currentClient.score > 80 ? '#fde68a' : '#fecaca'}`,
                padding: '2px 8px', borderRadius: 20, marginLeft: 2,
              }}>
                {currentClient.score}
              </div>

              {/* Chevron */}
              <span style={{
                fontSize: '0.7rem', color: '#94a3b8', marginLeft: 2,
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                display: 'inline-block',
              }}>▼</span>
            </button>

            {/* Dropdown panel */}
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.15), 0 8px 20px -5px rgba(0,0,0,0.08)',
                minWidth: 280,
                overflow: 'hidden',
                animation: 'fadeIn 0.12s ease',
              }}>

                {/* Header */}
                <div style={{
                  padding: '10px 16px 8px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '0.62rem', fontWeight: 800,
                  color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: '#fafafa',
                }}>
                  Switch Active Client
                </div>

                {/* Client rows */}
                {allowedClients.map((key) => {
                  const c = clients[key];
                  const cm = clientMeta[key];
                  const isActive = key === currentClient.key;
                  const isHov = hoveredKey === key;
                  return (
                    <div
                      key={key}
                      onClick={() => handleSwitch(key)}
                      onMouseEnter={() => setHoveredKey(key)}
                      onMouseLeave={() => setHoveredKey(null)}
                      style={{
                        padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        cursor: isActive ? 'default' : 'pointer',
                        background: isActive ? `linear-gradient(135deg, ${cm.colorLight}, white)` : isHov ? '#f8fafc' : 'transparent',
                        borderLeft: isActive ? `3px solid ${cm.color}` : '3px solid transparent',
                        transition: 'all 0.15s',
                        position: 'relative',
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: `linear-gradient(135deg, ${cm.color}, ${cm.color}bb)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 800, color: '#fff',
                        boxShadow: isHov || isActive ? `0 3px 8px ${cm.color}44` : 'none',
                        transition: 'box-shadow 0.2s',
                      }}>
                        {c.avatar}
                      </div>

                      {/* Name + industry */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isActive ? cm.color : '#0f172a' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>
                          {cm.icon} {cm.industry}
                        </div>
                      </div>

                      {/* Score */}
                      <div style={{
                        fontSize: '0.75rem', fontWeight: 800,
                        background: c.score > 90 ? '#dcfce7' : c.score > 80 ? '#fffbeb' : '#fee2e2',
                        color: c.score > 90 ? '#16a34a' : c.score > 80 ? '#d97706' : '#dc2626',
                        padding: '2px 8px', borderRadius: 20,
                      }}>
                        {c.score}
                      </div>

                      {/* Active pill */}
                      {isActive && (
                        <div style={{
                          fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.06em', background: cm.color,
                          color: '#fff', padding: '2px 6px', borderRadius: 20,
                        }}>
                          Active
                        </div>
                      )}

                      {/* Hover snapshot card */}
                      {isHov && !isActive && hovered && hoveredMeta && (
                        <div style={{
                          position: 'absolute', right: 'calc(100% + 8px)', top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#0f172a',
                          border: `1px solid ${hoveredMeta.color}44`,
                          borderRadius: 12, padding: '10px 14px',
                          minWidth: 190,
                          boxShadow: `0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px ${hoveredMeta.color}22`,
                          zIndex: 2000,
                          pointerEvents: 'none',
                          animation: 'fadeIn 0.1s ease',
                        }}>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: hoveredMeta.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                            {hoveredMeta.icon} {hoveredMeta.industry} · {hovered.name}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {[
                              { label: 'Risk Score', value: `${hovered.score} ${hovered.grade}`, color: hovered.score > 90 ? '#4ade80' : hovered.score > 80 ? '#fbbf24' : '#f87171' },
                              { label: 'Criticals', value: hovered.criticals, color: '#f87171' },
                              { label: 'Backlog',   value: hovered.backlog,   color: '#fbbf24' },
                              { label: 'Assets',    value: hovered.assets,    color: '#38bdf8' },
                            ].map(row => (
                              <div key={row.label}>
                                <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: row.color, marginTop: 1 }}>{row.value}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #1e293b', fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
                            🕐 Last scan: {hovered.scanDate}
                          </div>
                          <div style={{ marginTop: 6, fontSize: '0.62rem', color: hoveredMeta.color, fontWeight: 700 }}>
                            Click to switch →
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Footer hint */}
                <div style={{
                  padding: '8px 16px', borderTop: '1px solid #f1f5f9',
                  fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600,
                  background: '#fafafa', textAlign: 'center',
                }}>
                  Hover a client to preview · Click to switch
                </div>
              </div>
            )}
          </div>
          )}

          {/* Last scan */}
          <div style={{
            fontSize: '0.72rem', background: 'var(--low-bg)',
            border: '1px solid var(--low-border)', borderRadius: 6,
            padding: '3px 10px', fontWeight: 600, color: 'var(--low)'
          }}>
            Last scan: {currentClient.scanDate}
          </div>

          {/* Avatar */}
          <div
            className="topbar-avatar"
            style={{
              background: meta.color
                ? `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`
                : 'linear-gradient(135deg, #3b82f6, #0891b2)',
              transition: 'all 0.3s ease',
              boxShadow: `0 2px 8px ${meta.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              currentClient.avatar
            )}
          </div>

          <button 
            className="logout-btn" 
            onClick={() => {
              sessionStorage.removeItem('posturepilot_demo_mode');
              signOut({ callbackUrl: '/' });
            }}
          >
            Sign out
          </button>
        </div>
      </header>
    </div>
  );
}
