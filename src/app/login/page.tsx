'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email === 'demo@posturepilot.io' && password === 'Demo@1234') {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Use demo@posturepilot.io / Demo@1234');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="login-card animate-in">
        <div className="login-logo">
          {/* Real logo — place posturepilot-logo.png in /public */}
          <div style={{ marginBottom: '0.75rem' }}>
            <Image
              src="/posturepilot.jpg"
              alt="PosturePilot"
              width={220}
              height={74}
              style={{ objectFit: 'contain' }}
              priority
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          {/* Text fallback */}
          <div className="login-logo-icon">🎯</div>
          <div className="login-product-name">Posture<span>Pilot</span></div>
          <div className="login-tagline">Configure · Monitor · Report · Secure</div>
        </div>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <label className="login-form-label">Email address</label>
          <input
            id="email"
            type="email"
            className="login-form-input"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label className="login-form-label">Password</label>
          <input
            id="password"
            type="password"
            className="login-form-input"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button id="login-btn" type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to Dashboard →'}
          </button>
        </form>

        <div className="demo-hint">
          🔑 <strong>Demo credentials</strong><br />
          demo@posturepilot.io &nbsp;/&nbsp; Demo@1234
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: '#334155' }}>
          PosturePilot v1.0 · All data is demo only · © 2026
        </div>
      </div>
    </div>
  );
}
