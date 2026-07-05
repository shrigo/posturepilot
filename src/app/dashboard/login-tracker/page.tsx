'use client';

import { useState, useEffect } from 'react';
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

export default function LoginTrackerPage() {
  const { data: session, status } = useSession();
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAttempts = attempts.filter(att => 
    att.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    att.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    att.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (att.ip && att.ip.includes(searchTerm))
  );

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Loading tracker console...</div>
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
      
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search email, provider, status, IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              width: '320px',
              fontSize: '0.82rem',
              fontWeight: 500,
              background: '#fff',
              color: '#334155',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear
            </button>
          )}
        </div>
        
        <button 
          onClick={fetchAttempts}
          className="btn-primary"
          style={{
            padding: '0.625rem 1.25rem',
            background: 'linear-gradient(135deg, #3b82f6, #0891b2)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
          }}
        >
          🔄 Refresh Log
        </button>
      </div>

      {error && (
        <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Main attempts table card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title" style={{ margin: 0 }}>🛡️ Active Authentication Log</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 500 }}>
              Tracking all Google OAuth & Credential sign-in attempts globally
            </div>
          </div>
          <span style={{
            fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0'
          }}>
            SECURE AUDIT ACTIVE
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>Timestamp</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>First Name</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>Last Name</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>Email Address</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>Provider</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>IP Address</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                    {attempts.length === 0 ? 'No authentication records found.' : 'No matching records found for search filter.'}
                  </td>
                </tr>
              ) : (
                filteredAttempts.map(att => (
                  <tr key={att.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {new Date(att.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>
                      {att.firstName || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>
                      {att.lastName || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                      {att.email}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textTransform: 'capitalize', fontWeight: 600 }}>
                      {att.provider === 'google' ? '🟢 Google SSO' : '🔑 Credentials'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: att.status === 'success' ? '#d1fae5' : '#fee2e2',
                        color: att.status === 'success' ? '#065f46' : '#991b1b'
                      }}>
                        {att.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#475569', fontFamily: 'monospace' }}>
                      {att.ip || '—'}
                    </td>
                    <td style={{ 
                      padding: '0.85rem 1.25rem', 
                      color: '#64748b', 
                      maxWidth: '240px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }} title={att.userAgent || ''}>
                      {att.userAgent || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
