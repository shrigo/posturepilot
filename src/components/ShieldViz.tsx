'use client';
import { useEffect, useState } from 'react';

export default function ShieldViz() {
  const [b,setB]=useState([0,0,0,0,0]);
  const [d1,setD1]=useState(0);
  const [d2,setD2]=useState(0);
  const [ln,setLn]=useState('242,158 242,158');
  const [tk,setTk]=useState(0);

  useEffect(()=>{
    setTimeout(()=>{setB([38,60,48,76,54]);setD1(198);setD2(185);},500);
    setTimeout(()=>setLn('222,160 236,150 250,154 264,141 278,145 292,132 306,136 320,122'),700);
    const iv=setInterval(()=>setTk(n=>n+1),3200);
    return()=>clearInterval(iv);
  },[]);

  const lb=b.map((v,i)=>tk%2===0?v:Math.max(18,v+(i%2===0?4:-3)));

  /* Shield path matching logo exactly:
     center-top notch, flat shoulders, wide sides, rounded bottom */
  const S='M300,22 L118,68 L32,185 Q18,380 110,518 Q200,600 300,608 Q400,600 490,518 Q582,380 568,185 L482,68 Z';

  return(
    <svg viewBox="0 0 600 630" width="100%" style={{maxWidth:520,filter:'drop-shadow(0 20px 60px rgba(100,60,220,0.28))'}}>
      <defs>
        {/* Blue-to-purple gradient matching logo */}
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb"/>
          <stop offset="50%" stopColor="#4f46e5"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eff6ff"/>
          <stop offset="100%" stopColor="#f5f3ff"/>
        </linearGradient>
        <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="dg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9"/>
          <stop offset="50%" stopColor="#4f46e5"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f46e5"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="pGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d3a8c"/>
          <stop offset="100%" stopColor="#1e2560"/>
        </linearGradient>
        <filter id="pshadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#4f46e5" floodOpacity="0.15"/></filter>
      </defs>

      {/* Shield fill */}
      <path d={S} fill="url(#sg2)"/>

      {/* ── ROW 1: y 82–252 ── */}

      {/* P1 TL — Donut */}
      <rect x="52" y="82" width="152" height="170" rx="12" fill="white" filter="url(#pshadow)"/>
      <circle cx="120" cy="148" r="36" fill="none" stroke="#e5e7eb" strokeWidth="11"/>
      <circle cx="120" cy="148" r="36" fill="none" stroke="url(#dg1)" strokeWidth="11"
        strokeDasharray={`${d1} 260`} strokeLinecap="round"
        style={{transformOrigin:'120px 148px',transform:'rotate(-90deg)',transition:'stroke-dasharray 1.4s ease'}}/>
      <text x="120" y="153" textAnchor="middle" fontSize="12" fontWeight="800" fill="#4f46e5">74%</text>
      <rect x="62" y="198" width="60" height="6" rx="3" fill="#ede9fe"/>
      <rect x="62" y="210" width="45" height="6" rx="3" fill="#ddd6fe"/>
      <rect x="62" y="222" width="52" height="6" rx="3" fill="#c4b5fd"/>

      {/* P2 TC — World map */}
      <rect x="218" y="82" width="164" height="170" rx="12" fill="white" filter="url(#pshadow)"/>
      <text x="300" y="100" textAnchor="middle" fontSize="7.5" fill="#9ca3af" fontWeight="700" letterSpacing="1">THREAT MAP</text>
      {/* World dots */}
      {[[228,118],[236,113],[244,116],[252,112],[260,115],[268,112],[276,116],[284,113],[292,116],[300,113],
        [236,124],[244,121],[252,125],[260,121],[268,125],[276,121],[284,125],[292,121],
        [236,131],[244,128],[252,132],[260,128],[268,132],[276,128],[284,132],
        [244,138],[252,135],[260,139],[268,135],[276,139],
        [252,145],[260,142],[268,146],[276,142],
        [260,152],[268,149],[276,153]
      ].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="1.8" fill="#a5b4fc" opacity="0.75"/>
      ))}
      <circle cx="256" cy="125" r="5" fill="#dc2626" opacity="0.9"/>
      <circle cx="270" cy="115" r="4" fill="#ea580c" opacity="0.85"/>
      <circle cx="244" cy="138" r="3.5" fill="#16a34a" opacity="0.85"/>
      <circle cx="282" cy="128" r="3.5" fill="#7c3aed" opacity="0.8"/>
      <rect x="228" y="200" width="60" height="6" rx="3" fill="#ede9fe"/>
      <rect x="228" y="212" width="45" height="6" rx="3" fill="#ddd6fe"/>

      {/* P3 TR — Shield checkmark */}
      <rect x="396" y="82" width="152" height="170" rx="12" fill="white" filter="url(#pshadow)"/>
      <path d="M472,112 L502,125 L502,155 Q502,180 472,192 Q442,180 442,155 L442,125 Z"
        fill="none" stroke="url(#sg)" strokeWidth="3.5"/>
      <polyline points="458,155 469,167 488,143" fill="none" stroke="#4f46e5" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"/>
      <text x="472" y="207" textAnchor="middle" fontSize="9" fontWeight="800" fill="#059669">COMPLIANT</text>
      <rect x="424" y="218" width="60" height="6" rx="3" fill="#dcfce7"/>
      <rect x="424" y="230" width="45" height="6" rx="3" fill="#ede9fe"/>
      <rect x="424" y="242" width="52" height="6" rx="3" fill="#dbeafe"/>

      {/* ── ROW 2: y 262–398 ── */}

      {/* P4 BL — Bar chart */}
      <rect x="52" y="262" width="152" height="136" rx="12" fill="white" filter="url(#pshadow)"/>
      <text x="128" y="280" textAnchor="middle" fontSize="7.5" fill="#9ca3af" fontWeight="700" letterSpacing="1">SEVERITY</text>
      {lb.map((h,i)=>(
        <rect key={i} x={65+i*24} y={370-h} width="17" height={h} rx="4"
          fill="url(#bg1)" style={{transition:'y 0.7s ease,height 0.7s ease'}}/>
      ))}
      <line x1="60" y1="372" x2="195" y2="372" stroke="#e5e7eb" strokeWidth="1.5"/>
      {['C','H','M','L','I'].map((l,i)=>(
        <text key={l} x={73+i*24} y="382" textAnchor="middle" fontSize="7" fill="#9ca3af">{l}</text>
      ))}

      {/* P5 BC — Line chart */}
      <rect x="218" y="262" width="164" height="136" rx="12" fill="white" filter="url(#pshadow)"/>
      <text x="300" y="280" textAnchor="middle" fontSize="7.5" fill="#9ca3af" fontWeight="700" letterSpacing="1">RISK TREND</text>
      {[295,310,325,340,355,370].map(y=>(
        <line key={y} x1="226" y1={y} x2="374" y2={y} stroke="#f3f4f6" strokeWidth="1"/>
      ))}
      <polyline points={ln} fill="none" stroke="url(#lg1)" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
        style={{transition:'points 1.2s ease'}}/>
      {ln.split(' ').map((p,i)=>{const[x,y]=p.split(',');return(
        <circle key={i} cx={+x} cy={+y} r="4.5" fill="#4f46e5" stroke="white" strokeWidth="2"
          style={{transition:'all 1.2s ease'}}/>
      )})}
      <line x1="226" y1="372" x2="374" y2="372" stroke="#e5e7eb" strokeWidth="1.5"/>
      <text x="365" y="278" textAnchor="end" fontSize="8" fill="#16a34a" fontWeight="700">▼ 24%</text>

      {/* P6 BR — Ring */}
      <rect x="396" y="262" width="152" height="136" rx="12" fill="white" filter="url(#pshadow)"/>
      <circle cx="472" cy="318" r="38" fill="none" stroke="#e5e7eb" strokeWidth="13"/>
      <circle cx="472" cy="318" r="38" fill="none" stroke="url(#dg2)" strokeWidth="13"
        strokeDasharray={`${d2} 260`} strokeLinecap="round"
        style={{transformOrigin:'472px 318px',transform:'rotate(-90deg)',transition:'stroke-dasharray 1.4s ease'}}/>
      <text x="472" y="323" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2563eb">91%</text>
      <text x="472" y="337" textAnchor="middle" fontSize="7.5" fill="#9ca3af" fontWeight="600">SLA</text>
      <rect x="422" y="358" width="60" height="6" rx="3" fill="#dbeafe"/>
      <rect x="422" y="370" width="45" height="6" rx="3" fill="#ede9fe"/>

      {/* ── PERSON + KEYBOARD ── */}
      {/* Left keyboard */}
      <rect x="72" y="418" width="138" height="15" rx="6" fill="#c7d2fe" opacity="0.7"/>
      <rect x="80" y="438" width="120" height="11" rx="5" fill="#a5b4fc" opacity="0.5"/>
      {/* Right keyboard */}
      <rect x="390" y="418" width="138" height="15" rx="6" fill="#c7d2fe" opacity="0.7"/>
      <rect x="400" y="438" width="120" height="11" rx="5" fill="#a5b4fc" opacity="0.5"/>
      {/* Chair back */}
      <rect x="274" y="415" width="52" height="60" rx="14" fill="url(#pGrad)" opacity="0.9"/>
      {/* Head */}
      <circle cx="300" cy="402" r="26" fill="url(#pGrad)" opacity="0.95"/>
      {/* Body */}
      <ellipse cx="300" cy="488" rx="38" ry="44" fill="url(#pGrad)" opacity="0.85"/>

      {/* Shield border on top */}
      <path d={S} fill="none" stroke="url(#sg)" strokeWidth="5.5"/>
    </svg>
  );
}
