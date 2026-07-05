'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter }  from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

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

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '1.25rem 1.5rem',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

interface UpgradeReqLog {
  id:         string;
  clientName: string;
  userEmail:  string;
  moduleName: string;
  createdAt:  string;
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
  const [filter,   setFilter]   = useState<'all' | 'google' | 'success' | 'failed'>('all');

  const ADMIN_EMAILS = ['shrigo.now@gmail.com', 'shrigonow@gmail.com', 'demo@posturepilot.io'];
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login-attempts');
      if (res.status === 401 || res.status === 403) {
        router.replace('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/upgrade-request');
      if (res.ok) {
        const data = await res.json();
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

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>Verifying credentials...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return <div style={{ minHeight: '100vh', background: '#0f172a' }} />;
  }

  // Logged in but not admin -> Access Denied screen
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 20,
          padding: '3.5rem 2.5rem',
          maxWidth: '480px',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          color: '#e2e8f0'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🚫</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fca5a5', margin: '0 0 0.75rem 0' }}>Access Denied</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            This panel is restricted to System Administrators only. Your identity <strong>({session?.user?.email})</strong> is not enrolled in the admin policy.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })} 
              style={{ padding: '0.625rem 1.25rem', background: '#6366f1', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total       = attempts.length;
  const unique      = new Set(attempts.map(a => a.email)).size;
  const googleLogins = attempts.filter(a => a.provider === 'google').length;
  const today       = attempts.filter(a => {
    const d = new Date(a.createdAt);
    const n = new Date();
    return d.toDateString() === n.toDateString();
  }).length;

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = attempts.filter(a => {
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      a.email.toLowerCase().includes(term) ||
      (a.firstName || '').toLowerCase().includes(term) ||
      (a.lastName  || '').toLowerCase().includes(term) ||
      (a.ip        || '').includes(term);

    const matchFilter =
      filter === 'all'     ? true :
      filter === 'google'  ? a.provider === 'google' :
      filter === 'success' ? a.status   === 'success' :
                             a.status   === 'failed';

    return matchSearch && matchFilter;
  });

  // ── CSV Export ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Provider', 'Status', 'IP Address', 'User Agent'];
    const rows    = filtered.map(a => [
      new Date(a.createdAt).toLocaleString(),
      a.firstName || '',
      a.lastName  || '',
      a.email,
      a.provider,
      a.status,
      a.ip        || '',
      (a.userAgent || '').replace(/,/g, ' '),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `posturepilot-logins-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; }

        .admin-wrap {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 70% 40% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%),
            #0f172a;
        }

        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }

        .admin-logo span {
          font-size: 0.62rem;
          font-weight: 700;
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .admin-page { padding: 2rem; max-width: 1400px; margin: 0 auto; }

        .page-heading {
          font-size: 1.6rem;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
        }

        .page-sub {
          font-size: 0.8rem;
          color: #475569;
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
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .search-input {
          flex: 1;
          min-width: 220px;
          max-width: 360px;
          padding: 0.65rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e2e8f0;
          font-size: 0.82rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color: #475569; }
        .search-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .filter-btn {
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .filter-btn:hover   { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        .filter-btn.active  {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
          color: #a5b4fc;
        }

        .action-btn {
          padding: 0.65rem 1.1rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 2px 10px rgba(99,102,241,0.3);
          white-space: nowrap;
        }

        .action-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .logout-btn {
          padding: 0.55rem 1.1rem;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.4);
        }

        .table-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .table-header {
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #e2e8f0;
        }

        .table-count {
          font-size: 0.65rem;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 700;
        }

        table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }

        thead tr {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        th {
          padding: 0.85rem 1.1rem;
          text-align: left;
          font-size: 0.65rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.12s;
        }

        tbody tr:hover { background: rgba(255,255,255,0.03); }
        tbody tr:last-child { border-bottom: none; }

        td {
          padding: 0.85rem 1.1rem;
          color: #94a3b8;
          vertical-align: middle;
        }

        .td-name  { color: #e2e8f0; font-weight: 600; }
        .td-email { color: #cbd5e1; font-weight: 500; }

        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-success { background: rgba(16,185,129,0.12); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2); }
        .badge-failed  { background: rgba(239,68,68,0.12);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); }
        .badge-google  { background: rgba(59,130,246,0.12); color: #93c5fd; border: 1px solid rgba(59,130,246,0.2); }
        .badge-cred    { background: rgba(148,163,184,0.1); color: #94a3b8; border: 1px solid rgba(148,163,184,0.15); }

        .empty-state {
          padding: 4rem 1.5rem;
          text-align: center;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.08);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }
      `}</style>

      <div className="admin-wrap">
        {/* ── Topbar ── */}
        <div className="admin-topbar">
          <div className="admin-logo">
            PosturePilot <span>Admin Console</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>

        {/* ── Main Content ── */}
        <div className="admin-page">
          <h1 className="page-heading">Login Activity Log</h1>
          <p className="page-sub">All authentication events captured across the platform. Updates on every page load.</p>

          {/* Stats */}
          <div className="stats-row">
            <StatCard label="Total Logins"   value={total}        sub="all time"               color="#a5b4fc" />
            <StatCard label="Unique Users"   value={unique}       sub="distinct emails"        color="#67e8f9" />
            <StatCard label="Google OAuth"   value={googleLogins} sub={`${Math.round(googleLogins/Math.max(total,1)*100)}% of all logins`} color="#86efac" />
            <StatCard label="Today"          value={today}        sub={new Date().toLocaleDateString()} color="#fbbf24" />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.75rem', paddingBottom: '0.1rem' }}>
            <button
              onClick={() => {
                setActiveTab('logins');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'logins' ? '#f1f5f9' : '#475569',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.6rem 0.25rem',
                borderBottom: activeTab === 'logins' ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              🔒 Authentication Audit Logs
            </button>
            <button
              onClick={() => {
                setActiveTab('requests');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'requests' ? '#f1f5f9' : '#475569',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.6rem 0.25rem',
                borderBottom: activeTab === 'requests' ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              ⭐ License Upgrade Requests
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '0.75rem 1rem', color: '#fca5a5', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
              ⚠ {error}
            </div>
          )}

          {activeTab === 'logins' ? (
            <>
              {/* Controls */}
              <div className="controls-row">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search name, email, IP..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {(['all', 'google', 'success', 'failed'] as const).map(f => (
                  <button
                    key={f}
                    className={`filter-btn${filter === f ? ' active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button className="action-btn" onClick={exportCSV}>↓ Export CSV</button>
                  <button className="action-btn" onClick={fetchAttempts} style={{ background: 'rgba(255,255,255,0.07)', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    ↺ Refresh
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="table-card">
                <div className="table-header">
                  <span className="table-title">Authentication Records</span>
                  <span className="table-count">{filtered.length} records</span>
                </div>

                {loading ? (
                  <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <div className="spinner" />
                    <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Loading authentication log…</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email</th>
                          <th>Provider</th>
                          <th>Status</th>
                          <th>IP Address</th>
                          <th>User Agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan={8} className="empty-state">No records match the current filter.</td></tr>
                        ) : filtered.map(a => (
                          <tr key={a.id}>
                            <td style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                              {new Date(a.createdAt).toLocaleString()}
                            </td>
                            <td className="td-name">{a.firstName || <span style={{ color: '#334155' }}>—</span>}</td>
                            <td className="td-name">{a.lastName  || <span style={{ color: '#334155' }}>—</span>}</td>
                            <td className="td-email">{a.email}</td>
                            <td>
                              <span className={`badge ${a.provider === 'google' ? 'badge-google' : 'badge-cred'}`}>
                                {a.provider === 'google' ? 'Google' : 'Credentials'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${a.status === 'success' ? 'badge-success' : 'badge-failed'}`}>
                                {a.status}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{a.ip || '—'}</td>
                            <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.userAgent || ''}>
                              {a.userAgent || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Controls */}
              <div className="controls-row">
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button className="action-btn" onClick={fetchRequests} style={{ background: 'rgba(255,255,255,0.07)', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    ↺ Refresh Requests
                  </button>
                </div>
              </div>

              {/* Upgrade Requests Table */}
              <div className="table-card">
                <div className="table-header">
                  <span className="table-title">License Expansion Inquiries</span>
                  <span className="table-count">{requests.length} requests</span>
                </div>

                {loading ? (
                  <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <div className="spinner" />
                    <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Loading requests…</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Client Tenant Name</th>
                          <th>User Email Address</th>
                          <th>Locked Module Requested</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.length === 0 ? (
                          <tr><td colSpan={5} className="empty-state">No license expansion requests found.</td></tr>
                        ) : requests.map(r => (
                          <tr key={r.id}>
                            <td style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                              {new Date(r.createdAt).toLocaleString()}
                            </td>
                            <td className="td-name">{r.clientName || <span style={{ color: '#64748b', fontStyle: 'italic' }}>Guest (Unassigned)</span>}</td>
                            <td className="td-email">{r.userEmail}</td>
                            <td>
                              <span style={{
                                background: 'rgba(99,102,241,0.12)',
                                border: '1px solid rgba(99,102,241,0.2)',
                                color: '#a5b4fc',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 600
                              }}>
                                {r.moduleName}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                background: 'rgba(245,158,11,0.12)',
                                border: '1px solid rgba(245,158,11,0.2)',
                                color: '#fbbf24',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em'
                              }}>
                                PENDING UPGRADE
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
