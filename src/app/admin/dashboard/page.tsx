'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter }  from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LoginAttempt {
  id:        string;
  email:     string;
  firstName: string | null;
  lastName:  string | null;
  provider:  string;
  status:    string;
  ip:        string | null;
  userAgent: string | null;
  createdAt: string;
}

interface UpgradeReqLog {
  id:         string;
  clientName: string;
  userEmail:  string;
  moduleName: string;
  createdAt:  string;
}

const COMMON_FREE_PROVIDERS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'protonmail.com', 'aol.com'
]);

function StatCard({ 
  label, 
  value, 
  sub, 
  color, 
  borderColor 
}: { 
  label: string; 
  value: string | number; 
  sub?: string; 
  color: string;
  borderColor: string;
}) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: 14,
      padding: '1.25rem 1.5rem',
      flex: 1,
      minWidth: 180,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, color, lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'logins' | 'requests'>('logins');
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [requests, setRequests] = useState<UpgradeReqLog[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<'all' | 'trial' | 'enterprise' | 'google'>('all');

  const ADMIN_EMAILS = ['shrigo.now@gmail.com', 'shrigonow@gmail.com'];
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase().trim());

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login-attempts');
      if (res.status === 401 || res.status === 403) {
        router.replace('/admin/login');
        return;
      }
      const data = await res.json().catch(() => ({ attempts: [] }));
      setAttempts(data.attempts || []);
    } catch (e: unknown) {
      console.warn('Admin fetch warning:', e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/upgrade-request');
      if (res.ok) {
        const data = await res.json().catch(() => ({ requests: [] }));
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error('Failed to fetch upgrade requests:', e);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      fetchAttempts();
      fetchRequests();
    }
  }, [status, isAdmin, fetchAttempts, fetchRequests]);

  // Lead Analytics calculations
  const stats = useMemo(() => {
    const total = attempts.length;
    const trialLeads = attempts.filter(a => a.provider === 'free_trial' || a.provider === 'credentials');
    const googleLogins = attempts.filter(a => a.provider === 'google');
    
    const domainMap = new Map<string, number>();
    let enterpriseCount = 0;

    attempts.forEach(a => {
      const domain = (a.lastName || a.email.split('@')[1] || '').toLowerCase().trim();
      if (domain) {
        domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
        if (!COMMON_FREE_PROVIDERS.has(domain)) {
          enterpriseCount++;
        }
      }
    });

    const todayCount = attempts.filter(a => {
      const d = new Date(a.createdAt);
      const n = new Date();
      return d.toDateString() === n.toDateString();
    }).length;

    return {
      total,
      trialLeadsCount: trialLeads.length,
      googleCount: googleLogins.length,
      uniqueDomainsCount: domainMap.size,
      enterpriseCount,
      todayCount,
    };
  }, [attempts]);

  // Filtering for logins
  const filteredAttempts = useMemo(() => {
    return attempts.filter(a => {
      const term = search.toLowerCase().trim();
      const domain = (a.lastName || a.email.split('@')[1] || '').toLowerCase().trim();

      const matchSearch =
        !term ||
        a.email.toLowerCase().includes(term) ||
        domain.includes(term) ||
        (a.firstName || '').toLowerCase().includes(term) ||
        (a.lastName  || '').toLowerCase().includes(term) ||
        (a.ip        || '').includes(term);

      if (!matchSearch) return false;

      if (filter === 'trial') return a.provider === 'free_trial' || a.provider === 'credentials';
      if (filter === 'google') return a.provider === 'google';
      if (filter === 'enterprise') return domain && !COMMON_FREE_PROVIDERS.has(domain);
      return true;
    });
  }, [attempts, search, filter]);

  // Filtering for upgrade requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const term = search.toLowerCase().trim();
      return (
        !term ||
        r.clientName.toLowerCase().includes(term) ||
        r.userEmail.toLowerCase().includes(term) ||
        r.moduleName.toLowerCase().includes(term)
      );
    });
  }, [requests, search]);

  // CSV Export
  const exportCSV = () => {
    if (activeTab === 'logins') {
      const headers = ['Timestamp', 'First Name / Lead', 'Organization Domain', 'Email', 'Provider', 'Status', 'IP Address', 'User Agent'];
      const rows = filteredAttempts.map(a => [
        new Date(a.createdAt).toLocaleString(),
        a.firstName || '',
        a.lastName || a.email.split('@')[1] || '',
        a.email,
        a.provider,
        a.status,
        a.ip || '',
        (a.userAgent || '').replace(/,/g, ' '),
      ]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `posturepilot-leads-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Timestamp', 'Client Name', 'User Email', 'Requested Module'];
      const rows = filteredRequests.map(r => [
        new Date(r.createdAt).toLocaleString(),
        r.clientName,
        r.userEmail,
        r.moduleName,
      ]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `posturepilot-upgrade-requests-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>Verifying administrator credentials...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return <div style={{ minHeight: '100vh', background: '#f8fafc' }} />;
  }

  // Logged in but not admin -> Access Denied screen
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #fee2e2',
          borderRadius: 20,
          padding: '3rem 2.5rem',
          maxWidth: '480px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991b1b', margin: '0 0 0.5rem 0' }}>Access Denied</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            This terminal is strictly restricted to authorized System Administrators. Your email <strong>({session?.user?.email || 'Guest'})</strong> is not enrolled in the admin policy.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link 
              href="/dashboard" 
              style={{ padding: '0.625rem 1.25rem', background: '#4f46e5', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}
            >
              ← Return to Cockpit
            </Link>
            <button 
              onClick={handleLogout} 
              style={{ padding: '0.625rem 1.25rem', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; }

        .admin-wrap {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .admin-topbar {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          padding: 0.9rem 2rem;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .admin-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #4338ca;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .admin-page { padding: 2rem; max-width: 1400px; margin: 0 auto; }

        .page-heading {
          font-size: 1.55rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }

        .page-sub {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 1.75rem;
        }

        .stats-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.75rem;
        }

        .controls-row {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .search-input {
          flex: 1;
          min-width: 220px;
          max-width: 320px;
          padding: 0.6rem 0.95rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #334155;
          font-size: 0.82rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color: #94a3b8; }
        .search-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
        }

        .filter-btn {
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-size: 0.74rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .filter-btn:hover { background: #f1f5f9; color: #0f172a; }
        .filter-btn.active {
          background: #ede9fe;
          border-color: #c4b5fd;
          color: #5b21b6;
        }

        .action-btn {
          padding: 0.55rem 1.1rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 2px 8px rgba(79,70,229,0.25);
          white-space: nowrap;
        }
        .action-btn:hover { opacity: 0.92; transform: translateY(-1px); }

        .secondary-btn {
          padding: 0.55rem 1.1rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .secondary-btn:hover { background: #f8fafc; border-color: #94a3b8; }

        .table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .table-header {
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justifyContent: space-between;
        }

        table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }

        thead tr {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        th {
          padding: 0.85rem 1.1rem;
          text-align: left;
          font-size: 0.68rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.12s;
        }

        tbody tr:hover { background: #f8fafc; }
        tbody tr:last-child { border-bottom: none; }

        td {
          padding: 0.85rem 1.1rem;
          color: #475569;
          vertical-align: middle;
        }

        .td-name  { color: #0f172a; font-weight: 600; }
        .td-email { color: #0f172a; font-weight: 700; }

        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-failed  { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-trial   { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
        .badge-google  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .badge-cred    { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

        .empty-state {
          padding: 4rem 1.5rem;
          text-align: center;
          color: #64748b;
          font-weight: 600;
          font-size: 0.85rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 32px; height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }
      `}</style>

      <div className="admin-wrap">
        
        {/* ── Top Navigation Bar ── */}
        <div className="admin-topbar">
          <div className="admin-logo">
            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            <span>PosturePilot</span>
            <span className="admin-badge">Admin Portal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              ← Return to Cockpit
            </Link>

            <button 
              onClick={handleLogout}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                background: '#fff1f2',
                color: '#991b1b',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Main Admin Content ── */}
        <div className="admin-page">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 className="page-heading">Executive Lead & Access Console</h1>
              <p className="page-sub">
                Real-time tracking of visitor emails, company organizations, IP origins, and client upgrade requests.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="secondary-btn" onClick={exportCSV}>
                📥 Export CSV
              </button>
              <button className="action-btn" onClick={() => { fetchAttempts(); fetchRequests(); }}>
                🔄 Refresh Data
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="stats-row">
            <StatCard 
              label="Total Leads Captured"   
              value={stats.total} 
              sub="100% email capture rate" 
              color="#0f172a" 
              borderColor="#4f46e5" 
            />
            <StatCard 
              label="Free Trial Signups" 
              value={stats.trialLeadsCount} 
              sub="Sandbox trials activated" 
              color="#6d28d9" 
              borderColor="#7c3aed" 
            />
            <StatCard 
              label="Enterprise Organizations" 
              value={stats.enterpriseCount} 
              sub="Corporate domains detected" 
              color="#0369a1" 
              borderColor="#0284c7" 
            />
            <StatCard 
              label="Unique Company Domains" 
              value={stats.uniqueDomainsCount} 
              sub="Distinct organizations" 
              color="#047857" 
              borderColor="#10b981" 
            />
            <StatCard 
              label="Today's Signups" 
              value={stats.todayCount} 
              sub={new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} 
              color="#c2410c" 
              borderColor="#f97316" 
            />
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <button
              onClick={() => { setActiveTab('logins'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'logins' ? '#4f46e5' : '#64748b',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0.75rem 0.5rem',
                borderBottom: activeTab === 'logins' ? '2px solid #4f46e5' : '2px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>👥 Visitor & Trial Leads</span>
              <span style={{
                fontSize: '0.68rem',
                background: activeTab === 'logins' ? '#ede9fe' : '#f1f5f9',
                color: activeTab === 'logins' ? '#4338ca' : '#64748b',
                padding: '2px 8px',
                borderRadius: '12px',
              }}>
                {attempts.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('requests'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'requests' ? '#4f46e5' : '#64748b',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0.75rem 0.5rem',
                borderBottom: activeTab === 'requests' ? '2px solid #4f46e5' : '2px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>💼 Module Upgrade Requests</span>
              <span style={{
                fontSize: '0.68rem',
                background: activeTab === 'requests' ? '#ede9fe' : '#f1f5f9',
                color: activeTab === 'requests' ? '#4338ca' : '#64748b',
                padding: '2px 8px',
                borderRadius: '12px',
              }}>
                {requests.length}
              </span>
            </button>
          </div>

          {/* Controls Bar */}
          <div className="controls-row">
            
            {/* Filter Buttons for Logins */}
            {activeTab === 'logins' ? (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Leads ({attempts.length})
                </button>
                <button
                  className={`filter-btn ${filter === 'trial' ? 'active' : ''}`}
                  onClick={() => setFilter('trial')}
                >
                  🚀 Free Trials ({stats.trialLeadsCount})
                </button>
                <button
                  className={`filter-btn ${filter === 'enterprise' ? 'active' : ''}`}
                  onClick={() => setFilter('enterprise')}
                >
                  🏢 Enterprise Orgs ({stats.enterpriseCount})
                </button>
                <button
                  className={`filter-btn ${filter === 'google' ? 'active' : ''}`}
                  onClick={() => setFilter('google')}
                >
                  🟢 Google SSO ({stats.googleCount})
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                Showing enterprise tier upgrade inquiries
              </div>
            )}

            {/* Search Input */}
            <input
              type="text"
              className="search-input"
              placeholder={activeTab === 'logins' ? "Search email, company, IP..." : "Search client, email, module..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── Table Card ── */}
          <div className="table-card">
            
            {activeTab === 'logins' ? (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Lead / User</th>
                      <th>Organization / Domain</th>
                      <th>Email Address</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>IP Origin</th>
                      <th>Device / Browser</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="empty-state">
                          <div className="spinner" />
                          <div>Loading authentication records...</div>
                        </td>
                      </tr>
                    ) : filteredAttempts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-state">
                          {attempts.length === 0 ? 'No authentication records found.' : 'No matching records found for active filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAttempts.map(a => {
                        const domain = (a.lastName || a.email.split('@')[1] || '').toLowerCase().trim();
                        const isEnterprise = domain && !COMMON_FREE_PROVIDERS.has(domain);

                        return (
                          <tr key={a.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {new Date(a.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="td-name">
                              {a.firstName || '—'}
                            </td>
                            <td>
                              {domain ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: isEnterprise ? '#eff6ff' : '#f1f5f9',
                                  color: isEnterprise ? '#1d4ed8' : '#475569',
                                  border: isEnterprise ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                                }}>
                                  {isEnterprise ? '🏢' : '👤'} {domain}
                                </span>
                              ) : '—'}
                            </td>
                            <td className="td-email">{a.email}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {a.provider === 'google' ? (
                                <span className="badge badge-google">🟢 Google SSO</span>
                              ) : a.provider === 'free_trial' ? (
                                <span className="badge badge-trial">🚀 Free Trial</span>
                              ) : (
                                <span className="badge badge-cred">🔑 Direct Auth</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${a.status === 'success' ? 'badge-success' : 'badge-failed'}`}>
                                {a.status}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.74rem' }}>{a.ip || '—'}</td>
                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.72rem' }} title={a.userAgent || ''}>
                              {a.userAgent || '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Upgrade Requests Tab */
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Client Name</th>
                      <th>User Email</th>
                      <th>Requested Module</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-state">
                          No upgrade inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map(r => (
                        <tr key={r.id}>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {new Date(r.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="td-name">🏢 {r.clientName}</td>
                          <td className="td-email">{r.userEmail}</td>
                          <td>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: '#ede9fe',
                              color: '#5b21b6',
                              border: '1px solid #c4b5fd',
                            }}>
                              {r.moduleName}
                            </span>
                          </td>
                          <td>
                            <a
                              href={`mailto:${r.userEmail}?subject=PosturePilot%20Module%20Upgrade%20Inquiry%20(${encodeURIComponent(r.moduleName)})`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '3px 10px',
                                borderRadius: '6px',
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#166534',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              ✉️ Contact Client
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
