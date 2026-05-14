'use client';
import { useEffect, useState } from 'react';

export default function ShieldViz() {
  const [bars, setBars] = useState([0,0,0,0,0]);
  const [donut1, setDonut1] = useState(0);
  const [ring2, setRing2] = useState(0);
  const [line, setLine] = useState('234,168 234,168');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setBars([38,60,48,75,55]); setDonut1(195); setRing2(180); }, 500);
    const t2 = setTimeout(() => setLine('234,168 252,158 270,162 288,148 306,152 324,140 342,143 360,130'), 700);
    const iv = setInterval(() => setTick(n => n+1), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, []);

  const lb = bars.map((b,i) => tick%2===0 ? b : Math.max(20, b+(i%2===0?3:-3)));

  return (
    <svg viewBox="0 0 600 640" width="100%" style={{maxWidth:540,filter:'drop-shadow(0 24px 60px rgba(0,114,255,0.3))'}}>
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1565c0"/>
          <stop offset="100%" stopColor="#00bcd4"/>
        </linearGradient>
        <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f4ff"/>
          <stop offset="100%" stopColor="#f0fffe"/>
        </linearGradient>
        <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="50%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#00bcd4"/>
        </linearGradient>
        <linearGradient id="do1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#00bcd4"/>
        </linearGradient>
        <linearGradient id="do2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00bcd4"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="personGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#90a4ae"/>
          <stop offset="100%" stopColor="#b0bec5"/>
        </linearGradient>
      </defs>

      {/* Shield body fill */}
      <path d="M300,18 L75,18 L8,135 L8,355 L108,528 L300,618 L492,528 L592,355 L592,135 L525,18 Z"
        fill="url(#sg2)"/>

      {/* === ROW 1 PANELS (y: 30 to 215) === */}

      {/* Panel 1 TL — Donut Chart */}
      <rect x="28" y="30" width="168" height="185" rx="10" fill="white" opacity="0.95"
        style={{filter:'drop-shadow(0 2px 8px rgba(0,114,255,0.08))'}}/>
      {/* Donut */}
      <circle cx="100" cy="110" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12"/>
      <circle cx="100" cy="110" r="38" fill="none" stroke="url(#do1)" strokeWidth="12"
        strokeDasharray={`${donut1} 300`} strokeLinecap="round"
        style={{transformOrigin:'100px 110px',transform:'rotate(-90deg)',transition:'stroke-dasharray 1.4s ease'}}/>
      <text x="100" y="115" textAnchor="middle" fontSize="13" fontWeight="800" fill="#3b82f6">74%</text>
      <rect x="38" y="162" width="65" height="6" rx="3" fill="#ede9fe"/>
      <rect x="38" y="174" width="48" height="6" rx="3" fill="#dbeafe"/>
      <rect x="38" y="186" width="56" height="6" rx="3" fill="#dcfce7"/>
      <text x="155" y="42" textAnchor="end" fontSize="7.5" fill="#94a3b8" fontWeight="700">RISK</text>

      {/* Panel 2 TC — World Map */}
      <rect x="212" y="30" width="176" height="185" rx="10" fill="white" opacity="0.95"
        style={{filter:'drop-shadow(0 2px 8px rgba(0,114,255,0.08))'}}/>
      <text x="300" y="50" textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="700">GLOBAL THREAT MAP</text>
      {/* Simplified world map outline dots */}
      {[
        [225,75],[232,70],[240,72],[248,68],[256,71],[264,68],[272,73],[280,70],[288,73],
        [232,82],[240,80],[248,78],[256,82],[264,80],[272,78],[280,82],[288,80],
        [225,90],[232,88],[240,92],[248,90],[256,88],[264,92],[272,90],[280,88],
        [232,100],[240,98],[248,102],[256,100],[264,98],[272,102],[280,100],
        [228,108],[236,106],[244,110],[252,108],[260,106],[268,110],[276,108],
        [232,116],[240,114],[248,118],[256,116],[264,114],[272,118],
        [240,125],[248,123],[256,127],[264,125],[272,123],
        [248,133],[256,131],[264,135],[272,133],
        [256,141],[264,139],[272,143],
        [264,149],[272,147],
      ].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="1.8" fill="#93c5fd" opacity="0.7"/>
      ))}
      {/* Threat markers */}
      <circle cx="252" cy="90" r="4.5" fill="#dc2626" opacity="0.9"/>
      <circle cx="264" cy="80" r="3.5" fill="#ea580c" opacity="0.85"/>
      <circle cx="240" cy="110" r="3.5" fill="#16a34a" opacity="0.85"/>
      <circle cx="276" cy="100" r="3" fill="#7c3aed" opacity="0.85"/>
      <rect x="222" y="162" width="60" height="6" rx="3" fill="#dbeafe"/>
      <rect x="222" y="174" width="45" height="6" rx="3" fill="#dbeafe"/>

      {/* Panel 3 TR — Shield/Checkmark */}
      <rect x="404" y="30" width="168" height="185" rx="10" fill="white" opacity="0.95"
        style={{filter:'drop-shadow(0 2px 8px rgba(0,114,255,0.08))'}}/>
      {/* Shield icon */}
      <path d="M488,70 L515,82 L515,110 Q515,135 488,148 Q461,135 461,110 L461,82 Z"
        fill="none" stroke="url(#sg)" strokeWidth="3.5"/>
      <polyline points="476,110 485,122 503,100" fill="none" stroke="#00bcd4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="488" y="167" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#059669">COMPLIANT</text>
      <rect x="450" y="178" width="60" height="6" rx="3" fill="#dcfce7"/>
      <rect x="450" y="190" width="45" height="6" rx="3" fill="#ede9fe"/>
      <rect x="450" y="202" width="50" height="6" rx="3" fill="#dbeafe"/>

      {/* === ROW 2 PANELS (y: 225 to 400) === */}

      {/* Panel 4 BL — Bar Chart */}
      <rect x="28" y="225" width="168" height="175" rx="10" fill="white" opacity="0.95"
        style={{filter:'drop-shadow(0 2px 8px rgba(0,114,255,0.08))'}}/>
      <text x="112" y="243" textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="700">FINDINGS BY SEVERITY</text>
      {lb.map((h,i)=>(
        <rect key={i} x={42+i*26} y={370-h*1.1} width="18" height={h*1.1} rx="4"
          fill="url(#bar1)" style={{transition:'y 0.7s ease,height 0.7s ease'}}/>
      ))}
      <line x1="35" y1="372" x2="188" y2="372" stroke="#e2e8f0" strokeWidth="1.5"/>
      {['C','H','M','L','I'].map((l,i)=>(
        <text key={l} x={51+i*26} y="382" textAnchor="middle" fontSize="7" fill="#94a3b8">{l}</text>
      ))}

      {/* Panel 5 BC — Line Chart */}
      <rect x="212" y="225" width="176" height="175" rx="10" fill="white" opacity="0.95"
        style={{filter:'drop-shadow(0 2px 8px rgba(0,114,255,0.08))'}}/>
      <text x="300" y="244" textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="700">RISK TREND</text>
      {/* Grid lines */}
      {[270,290,310,330,350].map(y=>(
        <line key={y} x1="222" y1={y} x2="380" y2={y} stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      <polyline points={line} fill="none" stroke="url(#sg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        style={{transition:'points 1s ease'}}/>
      {line.split(' ').map((pt,i)=>{const[x,y]=pt.split(',');return(
        <circle key={i} cx={parseFloat(x)} cy={parseFloat(y)} r="4" fill="#0072ff" stroke="white" strokeWidth="1.5"
          style={{transition:'all 1s ease'}}/>
      )})}
      <line x1="222" y1="372" x2="380" y2="372" stroke="#e2e8f0" strokeWidth="1.5"/>
      <text x="370" y="244" textAnchor="end" fontSize="8" fill="#16a34a" fontWeight="700">▼ 24%</text>

      {/* Panel 6 BR — Ring Chart */}
      <rect x="404" y="225" width="168" height="175" rx="10" fill="white" opacity="0.95"
        style={{filter:'drop-shadow(0 2px 8px rgba(0,114,255,0.08))'}}/>
      <circle cx="488" cy="305" r="42" fill="none" stroke="#e2e8f0" strokeWidth="14"/>
      <circle cx="488" cy="305" r="42" fill="none" stroke="url(#do2)" strokeWidth="14"
        strokeDasharray={`${ring2} 300`} strokeLinecap="round"
        style={{transformOrigin:'488px 305px',transform:'rotate(-90deg)',transition:'stroke-dasharray 1.4s ease'}}/>
      <text x="488" y="309" textAnchor="middle" fontSize="14" fontWeight="900" fill="#7c3aed">91%</text>
      <text x="488" y="323" textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">SLA</text>
      <rect x="450" y="355" width="55" height="6" rx="3" fill="#ede9fe"/>
      <rect x="450" y="367" width="40" height="6" rx="3" fill="#dbeafe"/>

      {/* === PERSON + KEYBOARD (bottom section) === */}
      {/* Left keyboard */}
      <rect x="60" y="418" width="130" height="16" rx="6" fill="#cfd8dc" opacity="0.7"/>
      <rect x="68" y="440" width="112" height="12" rx="5" fill="#b0bec5" opacity="0.5"/>
      {/* Right keyboard */}
      <rect x="410" y="418" width="130" height="16" rx="6" fill="#cfd8dc" opacity="0.7"/>
      <rect x="420" y="440" width="112" height="12" rx="5" fill="#b0bec5" opacity="0.5"/>
      {/* Person body */}
      <ellipse cx="300" cy="480" rx="36" ry="42" fill="url(#personGrad)" opacity="0.85"/>
      {/* Person head */}
      <circle cx="300" cy="430" r="24" fill="#90a4ae" opacity="0.9"/>

      {/* Shield border — drawn LAST so it's on top */}
      <path d="M300,18 L75,18 L8,135 L8,355 L108,528 L300,618 L492,528 L592,355 L592,135 L525,18 Z"
        fill="none" stroke="url(#sg)" strokeWidth="5"/>
    </svg>
  );
}
