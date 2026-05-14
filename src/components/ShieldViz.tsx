'use client';
import { useEffect, useState } from 'react';

export default function ShieldViz() {
  const [bars, setBars] = useState([0,0,0,0,0]);
  const [donut1, setDonut1] = useState(0);
  const [linePoints, setLinePoints] = useState('30,60 30,60');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setBars([40,65,50,80,60]); setDonut1(220); }, 400);
    const t2 = setTimeout(() => setLinePoints('10,55 30,48 50,52 70,38 90,42 110,30 130,34 150,20'), 600);
    const iv = setInterval(() => setTick(n => n+1), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, []);

  const liveBar = bars.map((b,i) => tick%2===0 ? b : b + (i%2===0?2:-2));

  return (
    <svg viewBox="0 0 500 560" width="100%" style={{maxWidth:520,filter:'drop-shadow(0 20px 60px rgba(0,114,255,0.25))'}}>
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1565c0"/>
          <stop offset="100%" stopColor="#00bcd4"/>
        </linearGradient>
        <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(21,101,192,0.08)"/>
          <stop offset="100%" stopColor="rgba(0,188,212,0.04)"/>
        </linearGradient>
        <clipPath id="sc">
          <path d="M250,8 L460,95 L480,270 L370,445 L250,545 L130,445 L20,270 L40,95 Z"/>
        </clipPath>
        <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#00bcd4"/>
        </linearGradient>
        <linearGradient id="do1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0072ff"/><stop offset="100%" stopColor="#00bcd4"/>
        </linearGradient>
        <linearGradient id="do2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00bcd4"/><stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>

      {/* Shield fill */}
      <path d="M250,8 L460,95 L480,270 L370,445 L250,545 L130,445 L20,270 L40,95 Z" fill="url(#sg2)"/>

      {/* 6 Panels clipped inside shield */}
      <g clipPath="url(#sc)">
        {/* Row 1 */}
        {/* Panel TL */}
        <rect x="30" y="95" width="140" height="145" rx="10" fill="white" opacity="0.92"/>
        {/* Donut chart */}
        <circle cx="80" cy="155" r="32" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
        <circle cx="80" cy="155" r="32" fill="none" stroke="url(#do1)" strokeWidth="10"
          strokeDasharray={`${donut1} 300`} strokeDashoffset="-10"
          strokeLinecap="round" style={{transition:'stroke-dasharray 1.2s ease',transformOrigin:'80px 155px',transform:'rotate(-90deg)'}}/>
        <text x="80" y="159" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0072ff">74%</text>
        <rect x="38" y="198" width="55" height="5" rx="3" fill="#dbeafe"/>
        <rect x="38" y="208" width="40" height="5" rx="3" fill="#dbeafe"/>
        <rect x="38" y="218" width="48" height="5" rx="3" fill="#dbeafe"/>

        {/* Panel TC */}
        <rect x="180" y="95" width="140" height="145" rx="10" fill="white" opacity="0.92"/>
        {/* World map dots */}
        {[[195,130],[210,125],[225,135],[240,128],[255,133],[265,140],[220,145],[235,155],[250,148],[205,155],[270,130],[260,152]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="2.5" fill={i===4?"#dc2626":i===7?"#ea580c":"#93c5fd"} opacity="0.8"/>
        ))}
        <text x="248" y="115" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600">GLOBAL THREAT MAP</text>
        <rect x="188" y="200" width="55" height="5" rx="3" fill="#dbeafe"/>
        <rect x="188" y="210" width="40" height="5" rx="3" fill="#dbeafe"/>

        {/* Panel TR */}
        <rect x="330" y="95" width="140" height="145" rx="10" fill="white" opacity="0.92"/>
        {/* Shield checkmark */}
        <path d="M400,130 L420,140 L420,160 Q420,180 400,190 Q380,180 380,160 L380,140 Z" fill="none" stroke="url(#sg)" strokeWidth="3"/>
        <polyline points="390,160 397,168 413,150" fill="none" stroke="#00bcd4" strokeWidth="3" strokeLinecap="round"/>
        <text x="400" y="205" textAnchor="middle" fontSize="9" fontWeight="700" fill="#059669">COMPLIANT</text>
        <rect x="338" y="215" width="50" height="5" rx="3" fill="#dcfce7"/>
        <rect x="338" y="225" width="35" height="5" rx="3" fill="#dcfce7"/>

        {/* Row 2 */}
        {/* Panel BL */}
        <rect x="30" y="250" width="140" height="145" rx="10" fill="white" opacity="0.92"/>
        {/* Bar chart */}
        {liveBar.map((h,i)=>(
          <rect key={i} x={42+i*24} y={370-h*0.8} width="16" height={h*0.8} rx="4"
            fill="url(#bar1)" style={{transition:'y 0.6s ease,height 0.6s ease'}}/>
        ))}
        <line x1="38" y1="372" x2="165" y2="372" stroke="#e2e8f0" strokeWidth="1"/>

        {/* Panel BC */}
        <rect x="180" y="250" width="140" height="145" rx="10" fill="white" opacity="0.92"/>
        {/* Line chart */}
        <polyline points={linePoints.split(' ').map((p,i)=>{const[x,y]=p.split(',');return `${180+parseInt(x)+10},${310+parseInt(y)}`}).join(' ')}
          fill="none" stroke="url(#sg)" strokeWidth="2.5" strokeLinecap="round"
          style={{transition:'all 1s ease'}}/>
        {linePoints.split(' ').map((p,i)=>{const[x,y]=p.split(',');return(
          <circle key={i} cx={180+parseInt(x)+10} cy={310+parseInt(y)} r="3" fill="#0072ff" style={{transition:'all 1s ease'}}/>
        )})}
        <line x1="188" y1="375" x2="312" y2="375" stroke="#e2e8f0" strokeWidth="1"/>
        <text x="248" y="268" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600">RISK TREND ▲</text>

        {/* Panel BR */}
        <rect x="330" y="250" width="140" height="145" rx="10" fill="white" opacity="0.92"/>
        {/* Ring chart */}
        <circle cx="400" cy="320" r="35" fill="none" stroke="#e2e8f0" strokeWidth="12"/>
        <circle cx="400" cy="320" r="35" fill="none" stroke="url(#do2)" strokeWidth="12"
          strokeDasharray="185 220" strokeLinecap="round"
          style={{transformOrigin:'400px 320px',transform:'rotate(-90deg)'}}/>
        <text x="400" y="324" textAnchor="middle" fontSize="11" fontWeight="800" fill="#7c3aed">91%</text>
        <text x="400" y="336" textAnchor="middle" fontSize="6" fill="#94a3b8">SLA</text>
        <rect x="338" y="360" width="50" height="5" rx="3" fill="#ede9fe"/>
        <rect x="338" y="370" width="35" height="5" rx="3" fill="#ede9fe"/>

        {/* Person silhouette */}
        <ellipse cx="250" cy="465" rx="28" ry="32" fill="#b0bec5" opacity="0.7"/>
        <circle cx="250" cy="428" r="18" fill="#90a4ae" opacity="0.8"/>
        {/* Keyboard hints */}
        <rect x="170" y="460" width="70" height="12" rx="4" fill="#cfd8dc" opacity="0.6"/>
        <rect x="260" y="460" width="70" height="12" rx="4" fill="#cfd8dc" opacity="0.6"/>
      </g>

      {/* Shield border */}
      <path d="M250,8 L460,95 L480,270 L370,445 L250,545 L130,445 L20,270 L40,95 Z"
        fill="none" stroke="url(#sg)" strokeWidth="4"/>

      {/* Corner accent lines */}
      <path d="M250,8 L460,95" stroke="#00bcd4" strokeWidth="2" opacity="0.6"/>
      <path d="M250,8 L40,95"  stroke="#1565c0" strokeWidth="2" opacity="0.6"/>
    </svg>
  );
}
