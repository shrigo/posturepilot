'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
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

const COMMON_FREE_PROVIDERS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'protonmail.com', 'aol.com'
]);

export default function LoginTrackerPage() {
  const { data: session, status } = useSession();
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'trial' | 'enterprise' | 'google'>('all');

  const adminEmails = ['shrigo.now@gmail.com', 'shrigonow@gmail.com', 'demo@posturepilot.io'];
  const isAdmin = session?.user?.email && adminEmails.includes(session.user.email);

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      fetchAttempts();
    } else if (status !== 'loading' && !isAdmin) {
      setLoading(false);
    }
  }, [status, session]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/login-attempts');
      if (!res.ok) {
        throw new Error(res.status === 403 ? 'Forbidden: Access Denied' : 'Failed to fetch attempts');
      }
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Analytics & Lead Insights
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

    return {
      total,
      trialLeadsCount: trialLeads.length,
      googleCount: googleLogins.length,
      uniqueDomainsCount: domainMap.size,
      enterpriseCount,
    };
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    return attempts.filter(att => {
      const email = att.email.toLowerCase();
      const domain = (att.lastName || att.email.split('@')[1] || '').toLowerCase();
      const provider = att.provider.toLowerCase();
      const search = searchTerm.toLowerCase();

      // Text search
      const matchesSearch = !search || (
        email.includes(search) ||
        domain.includes(search) ||
        provider.includes(search) ||
        (att.firstName && att.firstName.toLowerCase().includes(search)) ||
        (att.ip && att.ip.includes(search))
      );

      if (!matchesSearch) return false;

      // Tab filter
      if (activeFilter === 'trial') {
        return att.provider === 'free_trial' || att.provider === 'credentials';
      }
      if (activeFilter === 'google') {
        return att.provider === 'google';
      }
      if (activeFilter === 'enterprise') {
        return domain && !COMMON_FREE_PROVIDERS.has(domain);
      }
      return true;
    });
  }, [attempts, searchTerm, activeFilter]);

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Loading visitor intelligence console...</div>
        </div>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === 'unauthenticated' || !isAdmin) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card animate-in" style={{ maxWidth: '480px', textAlign: 'center', padding: '2.5rem 2rem', border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🚫</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991b1b', margin: '0 0 0.75rem 0' }}>Access Denied</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            This terminal is restricted to authorized System Administrators only. Your identity <strong>({session?.user?.email || 'Guest'})</strong> is not enrolled in the admin policy.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', background: '#3b82f6', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
              ← Return to Cockpit
            </Link>
            <Link href="/login" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', background: '#fff' }}>
              Change Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.4rem' }}>👥</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Visitor & Trial Lead Tracker
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 12,
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0'
            }}>
              LIVE AUDIT
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Real-time tracking of visitor emails, company organizations, IP origins, and free trial signups.
          </p>
        </div>

        <button 
          onClick={fetchAttempts}
          style={{
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <span>🔄</span> Refresh Leads
        </button>
      </div>

      {/* KPI Cards Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Leads Recorded
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.15rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
            100% email capture rate
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Free Trial Signups
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', margin: '0.35rem 0 0.15rem' }}>
            {stats.trialLeadsCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
            Instant sandbox trials activated
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Enterprise Organizations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', margin: '0.35rem 0 0.15rem' }}>
            {stats.enterpriseCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600 }}>
            Corporate domains detected
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Unique Company Domains
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.35rem 0 0.15rem' }}>
            {stats.uniqueDomainsCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
            Distinct organizations
          </div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Main attempts table card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Controls Bar */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: activeFilter === 'all' ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                background: activeFilter === 'all' ? '#ede9fe' : '#ffffff',
                color: activeFilter === 'all' ? '#4338ca' : '#475569',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All Leads ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter('trial')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: activeFilter === 'trial' ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                background: activeFilter === 'trial' ? '#f5f3ff' : '#ffffff',
                color: activeFilter === 'trial' ? '#6d28d9' : '#475569',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🚀 Free Trials ({stats.trialLeadsCount})
            </button>
            <button
              onClick={() => setActiveFilter('enterprise')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: activeFilter === 'enterprise' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                background: activeFilter === 'enterprise' ? '#f0f9ff' : '#ffffff',
                color: activeFilter === 'enterprise' ? '#0369a1' : '#475569',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🏢 Enterprise Orgs ({stats.enterpriseCount})
            </button>
            <button
              onClick={() => setActiveFilter('google')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: activeFilter === 'google' ? '1px solid #10b981' : '1px solid #e2e8f0',
                background: activeFilter === 'google' ? '#f0fdf4' : '#ffffff',
                color: activeFilter === 'google' ? '#047857' : '#475569',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🟢 Google SSO ({stats.googleCount})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search email, company, IP..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                width: '240px',
                fontSize: '0.78rem',
                fontWeight: 500,
                background: '#fff',
                color: '#334155',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{ fontSize: '0.72rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Timestamp</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Lead / User</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Organization / Domain</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Email Address</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Channel / Type</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>IP Origin</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Device / Browser</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                    {attempts.length === 0 ? 'No visitor records found.' : 'No matching records found for active filters.'}
                  </td>
                </tr>
              ) : (
                filteredAttempts.map(att => {
                  const domain = (att.lastName || att.email.split('@')[1] || '').toLowerCase().trim();
                  const isEnterprise = domain && !COMMON_FREE_PROVIDERS.has(domain);

                  return (
                    <tr key={att.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569', whiteSpace: 'nowrap' }}>
                        {new Date(att.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                        {att.firstName || '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
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
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                        {att.email}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                        {att.provider === 'google' ? (
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                            🟢 Google SSO
                          </span>
                        ) : att.provider === 'free_trial' ? (
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                            🚀 Free Trial Lead
                          </span>
                        ) : (
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                            🔑 Direct Auth
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          background: att.status === 'success' ? '#d1fae5' : '#fee2e2',
                          color: att.status === 'success' ? '#065f46' : '#991b1b'
                        }}>
                          {att.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                        {att.ip || '—'}
                      </td>
                      <td style={{ 
                        padding: '0.75rem 1rem', 
                        color: '#64748b', 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        fontSize: '0.72rem'
                      }} title={att.userAgent || ''}>
                        {att.userAgent || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
