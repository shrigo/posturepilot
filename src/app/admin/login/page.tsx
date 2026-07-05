'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn('google', { callbackUrl: '/admin/dashboard' });
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="login-card animate-in">
        {/* Admin Badge Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '20px',
            padding: '3px 10px',
            fontSize: '0.62rem',
            fontWeight: 700,
            color: '#4f46e5',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4f46e5' }} />
            Admin Console
          </div>
        </div>

        <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Image
            src="/hlogotag_v2.jpg"
            alt="PosturePilot"
            width={260}
            height={88}
            style={{ objectFit: 'contain' }}
            priority
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', textAlign: 'center' }}>
          System Admin Gate
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginBottom: '2rem', textAlign: 'center', lineHeight: 1.5 }}>
          Sign in with your authorized Google / Gmail workspace account to view platform security logs and license inquiries.
        </p>

        <button 
          id="google-login-btn"
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-login-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#334155',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.15s',
            opacity: loading ? 0.7 : 1
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          {loading ? 'Redirecting to Google...' : 'Sign in with Google'}
        </button>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>
          PosturePilot v1.0 · Secured by Google OAuth · © 2026
        </div>
      </div>
    </div>
  );
}
