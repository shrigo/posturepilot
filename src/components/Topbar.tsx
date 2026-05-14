'use client';
interface TopbarProps {
  title: string;
  subtitle?: string;
}
export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-right">
        <div className="topbar-tenant">
          <div className="topbar-dot" />
          Acme Financial Corp
        </div>
        <div style={{ fontSize: '0.75rem', background: 'var(--low-bg)', border: '1px solid var(--low-border)', borderRadius: 6, padding: '3px 10px', fontWeight: 600, color: 'var(--low)' }}>
          Last scan: May 13, 6:42 PM
        </div>
        <div className="topbar-avatar">AC</div>
        <button className="logout-btn" onClick={() => window.location.href = '/login'}>Sign out</button>
      </div>
    </header>
  );
}
