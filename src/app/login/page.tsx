'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginFormContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      return;
    }

    const ua = navigator.userAgent;
    const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    setIsSafari(safari);

    fetch('/api/auth/csrf')
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken || ''))
      .catch(() => {});
  }, [status, router]);

  // Instant 14-Day Free Trial via CredentialsProvider
  const handleInstantTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialLoading(true);
    const targetEmail = email.trim() || 'trial@posturepilot.io';
    try {
      const res = await signIn('credentials', {
        email: targetEmail,
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (res?.ok) {
        router.push('/dashboard');
      } else {
        // Fallback: direct router navigation to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Trial login error:', err);
      router.push('/dashboard');
    } finally {
      setTrialLoading(false);
    }
  };

  // Instant Demo Sandbox Login
  const handleDemoLogin = async () => {
    setTrialLoading(true);
    try {
      await signIn('credentials', {
        email: 'demo@posturepilot.io',
        callbackUrl: '/dashboard',
        redirect: false,
      });
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setTrialLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="login-card animate-in" style={{ maxWidth: '440px', width: '100%' }}>
      {/* Brand Logo */}
      <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <Link href="/">
          <Image
            src="/hlogotag_v2.jpg"
            alt="PosturePilot"
            width={240}
            height={78}
            style={{ objectFit: 'contain' }}
            priority
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </Link>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
        Start Your Free Trial
      </h2>
      <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 500, marginBottom: '1.5rem', textAlign: 'center', lineHeight: 1.5 }}>
        Access the 12 Security Cockpits, SOAR dispatch, and CISO analytics. No credit card required.
      </p>

      {/* OAuth / Testing Mode Alert Notice */}
      {oauthError && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 8,
          background: '#fff1f2',
          border: '1px solid #fecaca',
          marginBottom: '1.25rem',
          fontSize: '0.78rem',
          color: '#9f1239',
          lineHeight: 1.4,
        }}>
          <strong>Google OAuth Notice:</strong> {oauthError === 'AccessDenied' || oauthError === 'OAuthSignin' || oauthError === 'OAuthCallback'
            ? 'Google returned "Access blocked" because this Google Client is in Testing Mode. Please use the Instant Free Trial below for immediate access.'
            : `Authentication error (${oauthError}). Use the Instant Free Trial below to proceed.`}
        </div>
      )}

      {/* Primary: Instant 14-Day Free Trial Form */}
      <form onSubmit={handleInstantTrial} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
            Work Email Address
          </label>
          <input
            type="email"
            placeholder="you@company.com (or leave blank for instant trial)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <button
          type="submit"
          disabled={trialLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.85rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: trialLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.15s ease',
            opacity: trialLoading ? 0.75 : 1,
          }}
        >
          {trialLoading ? 'Launching Your Trial...' : '🚀 Start 14-Day Free Trial (Instant Access) →'}
        </button>
      </form>

      {/* Quick 1-Click Sandbox Demo Button */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={trialLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.65rem',
          borderRadius: '8px',
          border: '1px solid #c7d2fe',
          background: '#f5f3ff',
          color: '#4338ca',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: trialLoading ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem',
          transition: 'all 0.15s ease',
        }}
      >
        ⚡ Launch 1-Click Sandbox Demo
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Or Sign In With SSO
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>

      {/* Google OAuth (With Safari support) */}
      {isSafari && csrfToken ? (
        <form
          method="POST"
          action="/api/auth/signin/google"
          style={{ width: '100%' }}
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/dashboard" />
          <button
            id="google-login-btn"
            type="submit"
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
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s',
            }}
          >
            <GoogleIcon />
            Sign in with Google Workspace
          </button>
        </form>
      ) : (
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
            opacity: loading ? 0.7 : 1,
          }}
        >
          <GoogleIcon />
          {loading ? 'Redirecting to Google...' : 'Sign in with Google Workspace'}
        </button>
      )}

      {/* Helpful Hint on Google Testing Mode */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.72rem',
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 1.4,
      }}>
        Corporate Google OAuth requires verified organization access. If prompted with test user restrictions, use the <strong>Instant Free Trial</strong> button above.
      </div>

      <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
        PosturePilot v1.0 · Multi-Tenant Security Command Center · © 2026
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Suspense fallback={
        <div style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
          Loading PosturePilot authentication...
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
