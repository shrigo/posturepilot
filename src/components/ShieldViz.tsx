'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/* ── Count-up hook ── */
function useCountUp(target: number, dur = 1600, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s: number | null = null, r: number;
    const t = setTimeout(() => {
      const fn = (ts: number) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) r = requestAnimationFrame(fn); else setV(target);
      };
      r = requestAnimationFrame(fn);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(r); };
  }, [target, dur, delay]);
  return v;
}

/*
 * Source image: pp_hr.gif — 1800 × 1800 px (square)
 * Display size: 700 × 700 (viewBox 700 × 700)
 * Scale factor: 700 / 1800 = 0.3889
 *
 * Panel positions (measured in source px → scaled to viewBox):
 *
 *   TL panel (left of world map):
 *     src  x: 165–335,  y: 190–540
 *     vb   x: 64–130,   y: 74–210
 *
 *   TC panel (world map — large):
 *     src  x: 340–880,  y: 190–540
 *     vb   x: 132–342,  y: 74–210
 *     center vb: 237, 142
 *
 *   TR panel (shield icon):
 *     src  x: 890–1150, y: 190–430
 *     vb   x: 346–447,  y: 74–167
 *     center vb: 397, 120
 *
 *   BL panel (bottom-left, empty):
 *     src  x: 165–335,  y: 545–720
 *     vb   x: 64–130,   y: 212–280
 *     center vb: 97, 246
 *
 *   BC panel (bottom-center — line chart area):
 *     src  x: 340–880,  y: 545–720
 *     vb   x: 132–342,  y: 212–280
 *     center vb: 237, 246
 *
 *   BR panel (bottom-right — donut area):
 *     src  x: 890–1150, y: 430–720
 *     vb   x: 346–447,  y: 167–280
 *     center vb: 397, 223
 */

export default function ShieldViz() {
  const [bars,   setBars]   = useState([0, 0, 0, 0, 0]);
  const [d1,     setD1]     = useState(0);
  const [dots,   setDots]   = useState<boolean[]>(Array(12).fill(false));
  const [scan,   setScan]   = useState(0);
  const [pulse,  setPulse]  = useState(false);
  const [tk,     setTk]     = useState(0);
  const [trStep, setTrStep] = useState(0);
  const [linePts, setLinePts] = useState('132,260 160,248 188,255 216,242 244,250 272,237 300,244 328,233 342,240');
  const [lineTrend, setLineTrend] = useState<'up' | 'down'>('down');
  const [linePct,   setLinePct]   = useState(24);
  const [mounted, setMounted] = useState(false);

  const riskVal = useCountUp(74, 1500, 600);
  const slaVal  = useCountUp(91, 1400, 800);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setBars([45, 70, 55, 82, 60]);
      setD1(Math.round(2 * Math.PI * 22 * 0.74)); // 74% of r=22 ring
    }, 700);

    const sv  = setInterval(() => setScan(n => (n + 1) % 100), 50);
    const dv  = setInterval(() => setDots(Array(12).fill(0).map(() => Math.random() > 0.38)), 1700);
    const pv  = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 700); }, 2800);
    const tv  = setInterval(() => setTk(n => n + 1), 3200);
    const trv = setInterval(() => setTrStep(n => (n + 1) % 4), 950);

    // Live line chart (BC panel: x 132–342, y 212–280)
    const xs = [132, 160, 188, 216, 244, 272, 300, 328, 342];
    let prevPct = 24;
    const lv = setInterval(() => {
      const pts = xs.map((x, i) => {
        const base = 260 - i * 3;
        const y = Math.round(base + (Math.random() - 0.5) * 16);
        return `${x},${Math.max(216, Math.min(276, y))}`;
      }).join(' ');
      setLinePts(pts);
      const np = Math.round(14 + Math.random() * 22);
      setLineTrend(np < prevPct ? 'down' : 'up');
      setLinePct(np);
      prevPct = np;
    }, 2400);

    return () => {
      clearInterval(sv); clearInterval(dv); clearInterval(pv);
      clearInterval(tv); clearInterval(trv); clearInterval(lv);
    };
  }, []);

  // Live bar flicker
  const lb = bars.map((b, i) => Math.max(6, b + (tk % 5 === i ? (Math.random() > 0.5 ? 10 : -8) : 0)));

  /* SSR fallback */
  if (!mounted) return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 700, margin: '0 auto' }}>
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={700} height={700} priority unoptimized
        style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 700, margin: '0 auto' }}>

      {/* ── Actual GIF logo ── */}
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={700} height={700} priority unoptimized
        style={{ width: '100%', height: 'auto', display: 'block',
          filter: 'drop-shadow(0 8px 48px rgba(79,70,229,0.22))' }} />

      {/* ── Animated SVG overlay — viewBox matches display 700×700 ── */}
      <svg viewBox="0 0 700 700"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="dg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="bg3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="gw3">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <style>{`
            @keyframes pp3-lineIn {
              from { stroke-dashoffset: 340; }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes pp3-ringPulse {
              0%,80%,100% { opacity:1; }
              88%          { opacity:0.5; }
              94%          { opacity:1; }
            }
            @keyframes pp3-blink {
              0%,100% { opacity:0.9; }
              50%     { opacity:0.45; }
            }
          `}</style>
        </defs>

        {/* ══════════════════════════════════════════════════════
            TL PANEL — Donut chart
            Panel vb approx: x 64–130, y 74–210
            Center: 97, 130
        ══════════════════════════════════════════════════════ */}
        {/* Donut track */}
        <circle cx="97" cy="128" r="22" fill="none"
          stroke="rgba(255,255,255,0.22)" strokeWidth="7" />
        {/* Donut fill — animated */}
        <circle cx="97" cy="128" r="22" fill="none"
          stroke="url(#dg3)" strokeWidth="7"
          strokeDasharray={`${d1} 200`} strokeLinecap="round"
          filter="url(#gw3)"
          style={{
            transformOrigin: '97px 128px', transform: 'rotate(-90deg)',
            transition: 'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)',
            animation: 'pp3-ringPulse 75s ease-in-out infinite'
          }} />
        {/* Center value */}
        <text x="97" y="132" textAnchor="middle" fontSize="10" fontWeight="900"
          fill="#4f46e5" style={{ fontFamily: 'Inter,sans-serif' }}>{riskVal}%</text>
        <text x="97" y="143" textAnchor="middle" fontSize="6.5" fontWeight="700"
          fill="#6d28d9" style={{ fontFamily: 'Inter,sans-serif' }}>RISK</text>

        {/* Legend bullets below donut */}
        <circle cx="68" cy="164" r="3.5" fill="#ef4444" opacity="0.95" />
        <text x="74" y="168" fontSize="8" fill="#dc2626" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>Critical</text>
        <circle cx="68" cy="178" r="3.5" fill="#f97316" opacity="0.95" />
        <text x="74" y="182" fontSize="8" fill="#ea580c" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>High</text>
        <circle cx="68" cy="192" r="3.5" fill="#eab308" opacity="0.95" />
        <text x="74" y="196" fontSize="8" fill="#ca8a04" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>Med</text>

        {/* ══════════════════════════════════════════════════════
            TC PANEL — World map (large center panel)
            Panel vb approx: x 132–342, y 74–210
        ══════════════════════════════════════════════════════ */}
        {/* Sweep scan line */}
        <line
          x1={132 + (scan / 100) * 210} y1="78"
          x2={132 + (scan / 100) * 210} y2="206"
          stroke="#7c3aed" strokeWidth="1.5" opacity="0.25" />

        {/* Threat dots */}
        {[
          [148, 120], [172, 108], [196, 116], [220, 104], [244, 112],
          [268, 100], [292, 108], [316, 96],  [154, 148], [198, 156],
          [242, 143], [286, 151],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy}
            r={i === 5 ? 5.5 : i === 9 ? 4.5 : 2.8}
            fill={i === 5 ? '#ef4444' : i === 9 ? '#f97316' : '#818cf8'}
            opacity={dots[i] ? 0.95 : 0.22}
            filter={i === 5 || i === 9 ? 'url(#gw3)' : undefined}
            style={{ transition: 'opacity 0.5s ease' }}
          />
        ))}

        {/* Pulse ring around hotspot */}
        <circle cx="268" cy="100" r={pulse ? 14 : 7}
          fill="none" stroke="#ef4444" strokeWidth="1"
          opacity={pulse ? 0 : 0.55}
          style={{ transition: 'r 0.7s ease, opacity 0.7s ease' }} />

        {/* ══════════════════════════════════════════════════════
            TR PANEL — Status ticks (shield icon area)
            Panel vb approx: x 346–447, y 74–167
        ══════════════════════════════════════════════════════ */}
        {['Scanned', 'Protected', 'Secure'].map((label, i) => {
          const y = 105 + i * 18;
          const active = trStep > i;
          return (
            <g key={i}>
              <path d={`M${354},${y - 1} l3.5,3.5 l7.5,-7.5`}
                fill="none"
                stroke={active ? '#059669' : '#c4b5fd'}
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="17" strokeDashoffset={active ? 0 : 17}
                filter={active ? 'url(#gw3)' : undefined}
                style={{ transition: 'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease' }}
              />
              <text x="370" y={y + 1} fontSize="8.5" fontWeight="700"
                fill={active ? '#059669' : '#c4b5fd'}
                opacity={active ? 1 : 0.38}
                style={{ fontFamily: 'Inter,sans-serif', transition: 'all 0.4s ease' }}>
                {label}
              </text>
            </g>
          );
        })}
        {/* Master tick */}
        <path d="M380,84 l6,6 l13,-13"
          fill="none"
          stroke={trStep >= 3 ? '#059669' : '#c4b5fd'}
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="26" strokeDashoffset={trStep >= 3 ? 0 : 26}
          filter={trStep >= 3 ? 'url(#gw3)' : undefined}
          style={{ transition: 'stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease' }}
        />

        {/* ══════════════════════════════════════════════════════
            BL PANEL — Bar chart
            Panel vb approx: x 64–130, y 212–280
        ══════════════════════════════════════════════════════ */}
        {lb.map((h, i) => {
          const baseY = 275;
          const barH = Math.round(h * 0.44);
          return (
            <rect key={i}
              x={68 + i * 13} y={baseY - barH}
              width="9" height={barH} rx="2"
              fill="url(#bg3)" opacity="0.92"
              filter="url(#gw3)"
              style={{ transition: 'y 0.6s cubic-bezier(0.4,0,0.2,1), height 0.6s cubic-bezier(0.4,0,0.2,1)' }}
            />
          );
        })}
        {/* BL legend */}
        <circle cx="68" cy="286" r="2.8" fill="#7c3aed" opacity="0.9" />
        <text x="74" y="289" fontSize="7" fill="#6d28d9" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>CVE Severity</text>

        {/* ══════════════════════════════════════════════════════
            BC PANEL — Line chart
            Panel vb approx: x 132–342, y 212–280
        ══════════════════════════════════════════════════════ */}
        <polyline points={linePts}
          fill="none" stroke="url(#lg3)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          filter="url(#gw3)"
          strokeDasharray="340"
          style={{
            transition: 'points 1.2s cubic-bezier(0.4,0,0.2,1)',
            animation: 'pp3-lineIn 1.5s ease-out forwards'
          }}
        />
        {linePts.split(' ').map((pt, i) => {
          const [x, y] = pt.split(',');
          return (
            <circle key={i} cx={+x} cy={+y} r="3.5"
              fill="#4f46e5" stroke="white" strokeWidth="1.5"
              filter="url(#gw3)"
              style={{ transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)' }}
            />
          );
        })}
        {/* Trend badge */}
        <text x="338" y="222" textAnchor="end" fontSize="8.5" fontWeight="800"
          fill={lineTrend === 'down' ? '#16a34a' : '#f97316'}
          style={{ fontFamily: 'Inter,sans-serif', transition: 'fill 0.6s ease' }}>
          {lineTrend === 'down' ? '▼' : '▲'} {linePct}%
        </text>
        {/* BC legend */}
        <circle cx="136" cy="287" r="2.8" fill="#4f46e5" opacity="0.9" />
        <text x="142" y="290" fontSize="7" fill="#4338ca" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>Threats</text>
        <circle cx="185" cy="287" r="2.8" fill="#16a34a" opacity="0.9" />
        <text x="191" y="290" fontSize="7" fill="#15803d" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>Mitigated</text>

        {/* ══════════════════════════════════════════════════════
            BR PANEL — SLA ring
            Panel vb approx: x 346–447, y 167–280
            Center: 397, 223
        ══════════════════════════════════════════════════════ */}
        {/* Track */}
        <circle cx="397" cy="222" r="24" fill="none"
          stroke="rgba(255,255,255,0.22)" strokeWidth="8" />
        {/* Animated fill */}
        <circle cx="397" cy="222" r="24" fill="none"
          stroke="url(#dg3)" strokeWidth="8"
          strokeDasharray={`${Math.round(2 * Math.PI * 24 * slaVal / 100)} 200`}
          strokeLinecap="round" filter="url(#gw3)"
          style={{
            transformOrigin: '397px 222px', transform: 'rotate(-90deg)',
            transition: 'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)',
            animation: 'pp3-ringPulse 75s ease-in-out infinite'
          }} />
        {/* Center label */}
        <text x="397" y="226" textAnchor="middle" fontSize="11" fontWeight="900"
          fill="#4f46e5" style={{ fontFamily: 'Inter,sans-serif' }}>{slaVal}%</text>
        <text x="397" y="238" textAnchor="middle" fontSize="7" fontWeight="700"
          fill="#6d28d9" style={{ fontFamily: 'Inter,sans-serif' }}>SLA</text>

        {/* BR legend */}
        <circle cx="368" cy="258" r="2.8" fill="#16a34a" opacity="0.9" />
        <text x="374" y="261" fontSize="7" fill="#15803d" fontWeight="700"
          style={{ fontFamily: 'Inter,sans-serif' }}>Compliance</text>

        {/* ══════════════════════════════════════════════════════
            LIVE indicator — top right
        ══════════════════════════════════════════════════════ */}
        <circle cx="648" cy="30" r="5.5" fill="#22c55e"
          opacity={pulse ? 1 : 0.5}
          style={{ transition: 'opacity 0.4s' }} />
        <text x="658" y="34" fontSize="8.5" fill="#16a34a" fontWeight="800"
          style={{ fontFamily: 'Inter,sans-serif' }}>LIVE</text>
      </svg>
    </div>
  );
}
