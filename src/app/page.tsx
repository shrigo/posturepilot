'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const METRICS = [
  { label: 'Risk Score',    value: '74',   unit: '/100', color: '#f87171', trend: 'down', delta: '-3' },
  { label: 'Critical CVEs', value: '23',   unit: '',     color: '#fb923c', trend: 'down', delta: '-5' },
  { label: 'Patched Today', value: '147',  unit: '',     color: '#34d399', trend: 'up',   delta: '+12' },
  { label: 'SLA Compliance',value: '91',   unit: '%',    color: '#00d4ff', trend: 'up',   delta: '+2%' },
  { label: 'MTTA',          value: '28',   unit: 'min',  color: '#a78bfa', trend: 'down', delta: '-4m' },
  { label: 'Open Findings', value: '847',  unit: '',     color: '#fbbf24', trend: 'down', delta: '-32' },
];

const BARS = [38, 62, 45, 78, 55, 90, 67, 82, 59, 94, 71, 88];

const DASHBOARDS = [
  { icon: '🛡️', label: 'Cyber Posture',   color: '#00d4ff' },
  { icon: '☁️', label: 'Cloud Security',  color: '#7c3aed' },
  { icon: '🌐', label: 'Network',          color: '#00ff88' },
  { icon: '📋', label: 'Info Security',   color: '#3b82f6' },
  { icon: '📊', label: 'Security KPIs',   color: '#fbbf24' },
  { icon: '🔐', label: 'App Security',    color: '#f87171' },
  { icon: '📡', label: 'Traffic Monitor', color: '#22d3ee' },
  { icon: '🖥️', label: 'Server Health',  color: '#a78bfa' },
  { icon: '🤖', label: 'AI Risk',         color: '#fb923c', isNew: true },
];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    const iv = setInterval(() => setTick(t => t + 1), 2000);

    const canvas = canvasRef.current;
    if (!canvas) return () => { window.removeEventListener('scroll', onScroll); clearInterval(iv); };
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.5)'; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(0,212,255,${0.1*(1-d/130)})`; ctx.lineWidth = 0.4; ctx.stroke(); }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', resize); clearInterval(iv); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg,#020d1a 0%,#050f24 50%,#030b1e 100%)', color: '#f1f5f9', fontFamily: "'Inter',sans-serif", overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', height: 64, background: scrolled ? 'rgba(2,13,26,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,212,255,0.08)' : 'none', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/posturepilot.jpg" alt="PosturePilot" width={150} height={50} style={{ objectFit: 'contain', filter: 'brightness(1.1)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Features','Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#00d4ff'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#475569'}
            >{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none', padding: '0.5rem 1rem' }}>Sign in</Link>
          <Link href="/login" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>Try Free →</Link>
        </div>
      </nav>

      {/* HERO — split layout */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', maxWidth: 1300, margin: '0 auto', padding: '5rem 2.5rem 3rem' }}>
        {/* LEFT */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20, padding: '0.35rem 0.875rem', fontSize: '0.7rem', fontWeight: 700, color: '#00d4ff', marginBottom: '1.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', display: 'inline-block', animation: 'glow 2s infinite' }} />
            Live · 9 Dashboards · Posture Intelligence
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.8rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: '1.25rem' }}>
            Your Security<br />
            <span style={{ background: 'linear-gradient(90deg,#00d4ff,#7c3aed,#00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'gradShift 4s ease infinite' }}>Command Center</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 440 }}>
            Upload Qualys · Tenable · Nessus scan results and get a board-ready cybersecurity command center in 5 minutes. Triple-Filter Triage built in.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '2.5rem' }}>
            <Link href="/login" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', padding: '0.8rem 1.75rem', borderRadius: 10, textDecoration: 'none', boxShadow: '0 0 32px rgba(0,212,255,0.35)' }}>Start Free Trial →</Link>
            <Link href="/dashboard" style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem', padding: '0.8rem 1.5rem', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(0,212,255,0.12)' }}>View Demo</Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {[['9','Dashboards'],['200+','Formats'],['80%','Less Reporting']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, background: 'linear-gradient(135deg,#00d4ff,#00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
                <div style={{ fontSize: '0.68rem', color: '#1e3a5f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Command Center Preview */}
        <div style={{ position: 'relative' }}>
          {/* Outer glow */}
          <div style={{ position: 'absolute', inset: -30, background: 'radial-gradient(ellipse,rgba(0,212,255,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ background: 'rgba(5,15,36,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 18, padding: '1.25rem', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(0,212,255,0.1), 0 40px 80px rgba(0,0,0,0.5)' }}>
            {/* Header bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#1e3a5f', letterSpacing: '0.05em' }}>POSTUREPILOT · COMMAND CENTER · LIVE</div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'glow 2s infinite' }} />
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1rem' }}>
              {METRICS.map((m, i) => (
                <div key={m.label} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${m.color}20`, borderRadius: 10, padding: '0.75rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${m.color},transparent)`, opacity: 0.5 }} />
                  <div style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{m.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: m.color, letterSpacing: '-0.03em', fontFamily: 'monospace' }}>{m.value}</span>
                    <span style={{ fontSize: '0.65rem', color: '#334155' }}>{m.unit}</span>
                  </div>
                  <div style={{ fontSize: '0.58rem', color: m.trend === 'up' ? '#34d399' : '#f87171', fontWeight: 700, marginTop: '0.15rem' }}>
                    {m.trend === 'up' ? '▲' : '▼'} {m.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Sparkline bar chart */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: 10, padding: '0.875rem', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Findings Trend · 12 Weeks</span>
                <span style={{ fontSize: '0.6rem', color: '#34d399', fontWeight: 700 }}>▼ 24% resolved</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i === BARS.length - 1 ? 'linear-gradient(180deg,#00d4ff,#7c3aed)' : `rgba(0,212,255,${0.2 + h/200})`, borderRadius: '3px 3px 0 0', height: `${h}%`, transition: 'height 0.5s ease', boxShadow: i === BARS.length - 1 ? '0 0 10px rgba(0,212,255,0.5)' : 'none' }} />
                ))}
              </div>
            </div>

            {/* Severity breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem' }}>
              {[['Critical','23','#f87171'],['High','89','#fb923c'],['Medium','312','#fbbf24'],['Low','423','#34d399']].map(([sev,cnt,col]) => (
                <div key={sev} style={{ background: `${col}10`, border: `1px solid ${col}25`, borderRadius: 8, padding: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: col as string, fontFamily: 'monospace' }}>{cnt}</div>
                  <div style={{ fontSize: '0.58rem', color: '#334155', fontWeight: 700, textTransform: 'uppercase' }}>{sev}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARDS GRID */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Full Coverage</div>
          <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>9 Dashboards. One Platform.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '0.875rem' }}>
          {DASHBOARDS.map(d => (
            <Link key={d.label} href={`/dashboard/${d.label.toLowerCase().replace(/ /g,'-').replace('network','network').replace('info-security','infosec').replace('security-kpis','kpi').replace('app-security','appsec').replace('traffic-monitor','traffic').replace('server-health','server').replace('ai-risk','ai-risk').replace('cyber-posture','posture').replace('cloud-security','cloud')}`}
              style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: `1px solid ${d.color}18`, borderRadius: 12, padding: '1rem 1.25rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s', position: 'relative' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = `${d.color}0d`; el.style.borderColor = `${d.color}45`; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 0 24px ${d.color}18`; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.02)'; el.style.borderColor = `${d.color}18`; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
            >
              {d.isNew && <div style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg,#fb923c,#7c3aed)', color: '#fff', fontSize: '0.55rem', fontWeight: 800, padding: '2px 7px', borderRadius: 8 }}>NEW</div>}
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0' }}>{d.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '0.3rem' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                <span style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 600 }}>Live</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>No six-figure contracts</h2>
          <p style={{ color: '#334155', marginTop: '0.5rem', fontSize: '0.85rem' }}>14-day free trial · No card required</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
          {[
            { name:'Starter', price:'$149', color:'#00d4ff', features:['1 user','CSV & manual entry','500 findings','All 9 dashboards'], cta:'Start Free Trial' },
            { name:'Professional', price:'$399', color:'#7c3aed', features:['5 users · 3 sources','Qualys · Tenable · Nessus','10K findings','API access'], cta:'Start Free Trial', popular:true },
            { name:'MSSP', price:'$999', color:'#00ff88', features:['Unlimited users','Multi-tenant clients','White-label','Dedicated support'], cta:'Contact Sales' },
          ].map(p => (
            <div key={p.name} style={{ background: p.popular ? `linear-gradient(160deg,${p.color}12,rgba(0,212,255,0.04))` : 'rgba(255,255,255,0.02)', border: `1px solid ${p.color}${p.popular ? '45' : '18'}`, borderRadius: 16, padding: '1.75rem', position: 'relative', transform: p.popular ? 'scale(1.03)' : 'none', backdropFilter: 'blur(10px)', boxShadow: p.popular ? `0 0 40px ${p.color}12` : 'none' }}>
              {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem', fontSize: '1rem' }}>{p.name}</div>
              <div style={{ marginBottom: '1.25rem' }}><span style={{ fontSize: '2rem', fontWeight: 900, color: p.color, letterSpacing: '-0.04em', textShadow: `0 0 20px ${p.color}50` }}>{p.price}</span><span style={{ fontSize: '0.75rem', color: '#334155' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {p.features.map(f => <li key={f} style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', gap: '0.4rem' }}><span style={{ color: p.color }}>✓</span>{f}</li>)}
              </ul>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '0.7rem', background: p.popular ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : `${p.color}15`, border: p.popular ? 'none' : `1px solid ${p.color}30`, borderRadius: 10, color: p.popular ? '#fff' : p.color, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(0,212,255,0.06)', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontWeight: 800 }}>Posture<span style={{ color: '#00d4ff' }}>Pilot</span><span style={{ color: '#1e3a5f', fontWeight: 400, fontSize: '0.75rem' }}> · Configure · Monitor · Report · Secure</span></span>
        <div style={{ fontSize: '0.7rem', color: '#1e293b' }}>© 2026 PosturePilot · posturepilot.io</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} html{scroll-behavior:smooth}
        @keyframes glow{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes gradShift{0%{background-position:0%}50%{background-position:100%}100%{background-position:0%}}
      `}</style>
    </div>
  );
}
