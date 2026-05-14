'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const orbitCards = [
  { icon: '🛡️', label: 'Cyber\nPosture',    color: '#3b82f6', href: '/dashboard/posture' },
  { icon: '☁️', label: 'Cloud\nSecurity',   color: '#22d3ee', href: '/dashboard/cloud' },
  { icon: '🌐', label: 'Network\nSecurity', color: '#818cf8', href: '/dashboard/network' },
  { icon: '📋', label: 'Info\nSecurity',    color: '#34d399', href: '/dashboard/infosec' },
  { icon: '📊', label: 'Security\nKPIs',    color: '#fbbf24', href: '/dashboard/kpi' },
  { icon: '🔐', label: 'App\nSecurity',     color: '#f87171', href: '/dashboard/appsec' },
  { icon: '📡', label: 'Traffic\nMonitor',  color: '#22d3ee', href: '/dashboard/traffic' },
  { icon: '🖥️', label: 'Server\nHealth',   color: '#a78bfa', href: '/dashboard/server' },
  { icon: '🤖', label: 'AI\nRisk',          color: '#fb923c', href: '/dashboard/ai-risk' },
];

const plans = [
  {
    name: 'Starter', price: '$149', period: '/month',
    color: '#3b82f6', desc: 'Perfect for small security teams.',
    features: ['1 user · 1 data source', 'Manual entry & CSV upload', '500 findings stored', 'All 9 dashboards', 'PDF export'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional', price: '$399', period: '/month',
    color: '#22d3ee', desc: 'For teams with multiple scan sources.', popular: true,
    features: ['5 users · 3 data sources', 'Qualys · Tenable · Nessus webhooks', '10,000 findings stored', 'Scheduled email reports', 'API access'],
    cta: 'Start Free Trial',
  },
  {
    name: 'MSSP', price: '$999', period: '/month',
    color: '#a78bfa', desc: 'For MSSPs managing multiple clients.',
    features: ['Unlimited users', 'Multi-tenant client accounts', 'White-label option', 'All integrations + API pull', 'Dedicated support'],
    cta: 'Contact Sales',
  },
];

const steps = [
  { step: '01', icon: '📤', title: 'Upload Your Scan',      desc: 'Drag and drop your Qualys XML, Nessus .nessus, or any CSV export. Our parser handles it automatically.' },
  { step: '02', icon: '⚡', title: 'Instant Normalization', desc: 'Findings are deduplicated, enriched with CVSS + EPSS scores, and mapped across all 9 dashboard modules.' },
  { step: '03', icon: '📊', title: 'Share the Dashboard',   desc: 'Share a live URL with your CISO, board, or clients. No Excel. No screenshots. Just clarity.' },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handler); };
  }, []);

  return (
    <div style={{ background: '#06091a', color: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 64,
        background: scrolled ? 'rgba(6,9,26,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/posturepilot.jpg" alt="PosturePilot" width={36} height={36}
            style={{ borderRadius: 8, objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Posture<span style={{ color: '#22d3ee' }}>Pilot</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Features', 'How it Works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#f1f5f9'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#94a3b8'}
            >{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem' }}>Sign in</Link>
          <Link href="/login" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
            Try Free →
          </Link>
        </div>
      </nav>

      {/* ── Hero with Orbit ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Orbit wrapper */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 1100, height: 'calc(100vh - 64px)', margin: '64px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Orbit rings */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '88%', height: '88%', transform: 'translate(-50%,-50%)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '60%', height: '60%', transform: 'translate(-50%,-50%)', border: '1px solid rgba(34,211,238,0.10)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Orbiting dashboard cards */}
          {orbitCards.map((card, i) => {
            const total = orbitCards.length;
            const angleRad = ((2 * Math.PI) / total) * i - Math.PI / 2;
            const isOuter = i % 2 === 0;
            const radiusPercent = isOuter ? 43 : 29;
            const x = 50 + radiusPercent * Math.cos(angleRad);
            const y = 50 + radiusPercent * Math.sin(angleRad);
            const scale = isOuter ? 1 : 0.88;
            const floatDur = 3 + (i % 3);
            const floatDelay = i * 0.3;
            return (
              <Link key={card.label} href={card.href} style={{
                position: 'absolute',
                left: `${x}%`, top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '0.6rem 0.85rem',
                background: 'rgba(10,15,35,0.85)',
                border: `1px solid ${card.color}30`,
                borderRadius: 12,
                backdropFilter: 'blur(12px)',
                boxShadow: `0 0 20px ${card.color}18, 0 4px 12px rgba(0,0,0,0.4)`,
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.6s ease ${i * 0.08}s`,
                animation: `ppFloat ${floatDur}s ease-in-out ${floatDelay}s infinite`,
                cursor: 'pointer', textDecoration: 'none',
                zIndex: 2,
              }}>
                <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{card.icon}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: card.color, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.3 }}>{card.label}</span>
              </Link>
            );
          })}

          {/* Center glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 220, height: 220, transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(34,211,238,0.10) 40%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'ppPulse 4s ease-in-out infinite' }} />

          {/* Center content */}
          <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: 400, padding: '1.5rem' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, padding: '0.375rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#93c5fd', marginBottom: '1.25rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'ppPulse 2s infinite' }} />
              9 Dashboards · 1 Platform
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '0.875rem' }}>
              Your Security<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Under Control
              </span>
            </h1>

            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Upload Qualys, Tenable, or Nessus scans.<br />Get a board-ready dashboard in 5 minutes.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', padding: '0.625rem 1.5rem', borderRadius: 8, textDecoration: 'none', boxShadow: '0 6px 24px rgba(59,130,246,0.35)' }}>
                Start Free Trial →
              </Link>
              <Link href="/dashboard" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem', padding: '0.625rem 1.25rem', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools Banner ── */}
      <section style={{ padding: '1.75rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Works with your existing scanner</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          {['Qualys VMDR', 'Tenable.io', 'Nessus Pro', 'OpenVAS', 'CrowdStrike', 'AWS Security Hub'].map(tool => (
            <div key={tool} style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>{tool}</div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '4rem 2rem', maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
        {[
          { value: '9', label: 'Security Dashboards' },
          { value: '200+', label: 'Scanner Formats' },
          { value: '5 min', label: 'To First Dashboard' },
          { value: '80%', label: 'Less Manual Reporting' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.375rem' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" style={{ padding: '5rem 2rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>Dead Simple Onboarding</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>From scan file to dashboard in 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {steps.map((s, i) => (
              <div key={s.step} style={{ position: 'relative' }}>
                {i < 2 && <div style={{ position: 'absolute', top: 24, left: 'calc(100% - 0.5rem)', width: '1rem', height: 1, background: 'rgba(255,255,255,0.08)' }} />}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,211,238,0.15))', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', marginBottom: '1rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Step {s.step}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '0.4rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '5rem 2rem', maxWidth: 1050, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>Transparent Pricing</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>No six-figure contracts. Start today.</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>14-day free trial. No credit card required.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: p.popular ? 'linear-gradient(160deg, rgba(8,145,178,0.12), rgba(59,130,246,0.07))' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.popular ? 'rgba(34,211,238,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '1.75rem', position: 'relative', transform: p.popular ? 'scale(1.03)' : 'none' }}>
              {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 14px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: p.color, letterSpacing: '-0.04em' }}>{p.price}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: '#94a3b8', alignItems: 'flex-start' }}>
                    <span style={{ color: '#22d3ee', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '0.7rem', background: p.popular ? 'linear-gradient(135deg, #3b82f6, #22d3ee)' : 'rgba(255,255,255,0.07)', border: p.popular ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', boxShadow: p.popular ? '0 6px 24px rgba(59,130,246,0.3)' : 'none' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(34,211,238,0.04))', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.875rem' }}>Ready to pilot your security posture?</h2>
          <p style={{ color: '#64748b', marginBottom: '1.75rem', fontSize: '0.9rem' }}>Upload your first scan in minutes. No credit card required.</p>
          <Link href="/login" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2.5rem', borderRadius: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(59,130,246,0.35)', display: 'inline-block' }}>
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '1rem' }}>Posture<span style={{ color: '#22d3ee' }}>Pilot</span> <span style={{ color: '#334155', fontWeight: 500, fontSize: '0.78rem' }}>· Configure · Monitor · Report · Secure</span></span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map(item => (
            <a key={item} href="#" style={{ color: '#475569', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 500 }}>{item}</a>
          ))}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#334155' }}>© 2026 PosturePilot. All rights reserved.</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes ppFloat { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-50%,calc(-50% - 8px))} }
        @keyframes ppPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
      `}</style>
    </div>
  );
}
