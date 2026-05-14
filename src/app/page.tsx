'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const dashboards = [
  { icon: '🛡️', name: 'Cyber Posture',     desc: 'Overall risk score, threat level & active threat intel feed.' },
  { icon: '☁️', name: 'Cloud Security',    desc: 'IAM risk, storage exposure & cloud misconfigurations.' },
  { icon: '🌐', name: 'Network Security',  desc: 'Firewall events, blocked IPs, IDS alerts & VPN sessions.' },
  { icon: '📋', name: 'Info Security',     desc: 'SOC2, ISO 27001, NIST & PCI compliance progress.' },
  { icon: '📊', name: 'Security KPIs',     desc: 'MTTA, MTTR, Patch SLA & team performance tracking.' },
  { icon: '🔐', name: 'App Security',      desc: 'SAST/DAST findings, OWASP Top 10 & container security.' },
  { icon: '📡', name: 'Traffic Monitor',   desc: 'Inbound/outbound traffic, protocol mix & anomaly detection.' },
  { icon: '🖥️', name: 'Server Health',    desc: 'CPU, memory, disk utilization & per-server health status.' },
  { icon: '🤖', name: 'AI Risk',           desc: 'OWASP LLM Top 10, shadow AI detection & EU AI Act compliance.', isNew: true },
];

const stats = [
  { value: '9', label: 'Security Dashboards' },
  { value: '200+', label: 'Scanner Formats' },
  { value: '5 min', label: 'To First Dashboard' },
  { value: '80%', label: 'Less Manual Reporting' },
];

const plans = [
  {
    name: 'Starter', price: '$149', period: '/month',
    color: '#3b82f6', desc: 'Perfect for small security teams getting visibility.',
    features: ['1 user · 1 data source', 'Manual entry & CSV upload', '500 findings stored', 'All 9 dashboards', 'PDF export'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional', price: '$399', period: '/month',
    color: '#0891b2', desc: 'Ideal for security teams with multiple scan sources.', popular: true,
    features: ['5 users · 3 data sources', 'Webhook ingestion (Qualys, Tenable, Nessus)', '10,000 findings stored', 'Scheduled email reports', 'API access'],
    cta: 'Start Free Trial',
  },
  {
    name: 'MSSP', price: '$999', period: '/month',
    color: '#7c3aed', desc: 'For MSSPs managing multiple client accounts.',
    features: ['Unlimited users', 'Multi-tenant client accounts', 'White-label option', 'All integrations + API pull', 'Dedicated support'],
    cta: 'Contact Sales',
  },
];

const steps = [
  { step: '01', icon: '📤', title: 'Upload Your Scan',     desc: 'Drag and drop your Qualys XML, Nessus .nessus, or any CSV export. Our parser handles it automatically.' },
  { step: '02', icon: '⚡', title: 'Instant Normalization', desc: 'Findings are deduplicated, enriched with CVSS + EPSS scores, and mapped across all 9 dashboard modules.' },
  { step: '03', icon: '📊', title: 'Share the Dashboard',  desc: 'Share a live URL with your CISO, board, or clients. No Excel. No screenshots. Just clarity.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ background: '#06091a', color: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: 64,
        background: scrolled ? 'rgba(6,9,26,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Image src="/posturepilot-logo.png" alt="PosturePilot" width={150} height={50} style={{ objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
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
          <Link href="/login" style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem' }}>
            Sign in
          </Link>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
            color: '#fff', fontSize: '0.875rem', fontWeight: 700,
            padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
          }}>
            Try Free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative' }}>
        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, padding: '0.375rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: '#93c5fd', marginBottom: '1.5rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Now with AI Risk & Governance Dashboard
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 840, marginBottom: '1.25rem' }}>
          Your Cybersecurity Posture,<br />
          <span style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Finally Under Control
          </span>
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: 580, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Upload your Qualys, Tenable, or Nessus scan results and get a board-ready
          cybersecurity command center in under 5 minutes. No setup. No Excel. No six-figure contract.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff',
            fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2rem',
            borderRadius: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}>
            Start Free Trial →
          </Link>
          <Link href="/dashboard" style={{
            background: 'rgba(255,255,255,0.05)', color: '#f1f5f9',
            fontWeight: 600, fontSize: '1rem', padding: '0.875rem 2rem',
            borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            View Live Demo
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trusted by banner ──────────────────────── */}
      <section style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
          Built for teams using
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {['Qualys VMDR', 'Tenable.io', 'Nessus Pro', 'OpenVAS', 'CrowdStrike', 'AWS Security Hub'].map(tool => (
            <div key={tool} style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', letterSpacing: '0.02em' }}>{tool}</div>
          ))}
        </div>
      </section>

      {/* ── Features / 9 Dashboards ────────────────── */}
      <section id="features" style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>9 Dashboards. One Platform.</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Everything your security team needs to see
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
            From cloud misconfigs to AI governance — PosturePilot aggregates your entire security posture into one command center.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {dashboards.map(d => (
            <div key={d.name} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '1.5rem',
              transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
              cursor: 'default', position: 'relative',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {d.isNew && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#7c3aed', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '2px 7px', borderRadius: 20, letterSpacing: '0.06em' }}>NEW</div>
              )}
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '0.4rem' }}>{d.name}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ───────────────────────────── */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Dead Simple Onboarding</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>From scan file to dashboard in 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {steps.map((s, i) => (
              <div key={s.step} style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 24, left: 'calc(100% - 1rem)', width: '2rem', height: 1, background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
                )}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(34,211,238,0.2))', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', marginBottom: '1rem' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Step {s.step}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────── */}
      <section id="pricing" style={{ padding: '6rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Transparent Pricing</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>No six-figure contracts. Start today.</h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>14-day free trial. No credit card required.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {plans.map(p => (
            <div key={p.name} style={{
              background: p.popular ? `linear-gradient(160deg, rgba(8,145,178,0.15), rgba(59,130,246,0.08))` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${p.popular ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 16, padding: '2rem',
              position: 'relative', transform: p.popular ? 'scale(1.03)' : 'none',
            }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '3px 14px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f1f5f9', marginBottom: '0.375rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: p.color, letterSpacing: '-0.04em' }}>{p.price}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.75rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: '#94a3b8', alignItems: 'flex-start' }}>
                    <span style={{ color: '#22d3ee', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" style={{
                display: 'block', textAlign: 'center', padding: '0.75rem',
                background: p.popular ? 'linear-gradient(135deg, #3b82f6, #22d3ee)' : 'rgba(255,255,255,0.07)',
                border: p.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                textDecoration: 'none', boxShadow: p.popular ? '0 6px 24px rgba(59,130,246,0.3)' : 'none',
              }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(34,211,238,0.05))', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Ready to pilot your security posture?
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem' }}>
            Upload your first scan in minutes. No credit card required.
          </p>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', color: '#fff',
            fontWeight: 700, fontSize: '1rem', padding: '1rem 2.5rem',
            borderRadius: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
            display: 'inline-block',
          }}>
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9' }}>Posture<span style={{ color: '#22d3ee' }}>Pilot</span></span>
          <span style={{ color: '#334155', fontSize: '0.8rem' }}>· Configure · Monitor · Report · Secure</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map(item => (
            <a key={item} href="#" style={{ color: '#475569', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 500 }}>{item}</a>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#334155' }}>© 2026 PosturePilot. All rights reserved.</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
