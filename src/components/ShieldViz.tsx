'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function useCountUp(target:number,dur=1600,delay=0){
  const [v,setV]=useState(0);
  useEffect(()=>{
    let s:number|null=null,r:number;
    const t=setTimeout(()=>{
      const fn=(ts:number)=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1);setV(Math.floor((1-Math.pow(1-p,3))*target));if(p<1)r=requestAnimationFrame(fn);else setV(target);};
      r=requestAnimationFrame(fn);
    },delay);
    return()=>{clearTimeout(t);cancelAnimationFrame(r);};
  },[target,dur,delay]);
  return v;
}

export default function ShieldViz(){
  const [bars,setBars]=useState([0,0,0,0,0]);
  const [d1,setD1]=useState(0);
  const [d2,setD2]=useState(0);
  const [ln,setLn]=useState('272,350 272,350');
  const [dots,setDots]=useState<boolean[]>(Array(12).fill(false));
  const [scan,setScan]=useState(0);
  const [pulse,setPulse]=useState(false);
  const [tk,setTk]=useState(0);

  const riskVal = useCountUp(74,1500,500);
  const slaVal  = useCountUp(91,1400,800);

  useEffect(()=>{
    setTimeout(()=>{ setBars([40,65,48,78,55]); setD1(188); setD2(178); }, 700);
    setTimeout(()=>setLn('272,368 286,355 300,360 314,345 328,350 342,335 356,340 370,322'), 900);
    const sv = setInterval(()=>setScan(n=>(n+1)%100), 55);
    const dv = setInterval(()=>setDots(Array(12).fill(0).map(()=>Math.random()>0.45)), 1800);
    const pv = setInterval(()=>{ setPulse(true); setTimeout(()=>setPulse(false),700); }, 2800);
    const tv = setInterval(()=>setTk(n=>n+1), 3400);
    return()=>{ clearInterval(sv); clearInterval(dv); clearInterval(pv); clearInterval(tv); };
  },[]);

  const lb = bars.map((b,i)=>Math.max(10, b+(tk%5===i?(Math.random()>0.5?9:-7):0)));

  /*
    Exact panel centers from PIL analysis of pp_hr.gif (1800x1800 → 620px display):
    TL-Donut:  cx=188, cy=198   (w=149, h=139)
    TC-Map:    cx=328, cy=198   (w=133, h=139)
    TR-Shield: cx=450, cy=198   (w=109, h=139)
    BL-Bars:   cx=188, cy=350   (w=149, h=166)
    BC-Line:   cx=328, cy=350   (w=133, h=166)
    BR-Ring:   cx=450, cy=350   (w=109, h=166)
  */

  return(
    <div style={{position:'relative',width:'100%',maxWidth:620,margin:'0 auto'}}>
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={620} height={620} unoptimized
        style={{width:'100%',height:'auto',display:'block',
          filter:'drop-shadow(0 8px 40px rgba(79,70,229,0.18))'}}
        priority/>

      <svg viewBox="0 0 620 620"
        style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none'}}>
        <defs>
          <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9"/><stop offset="50%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#818cf8"/>
          </linearGradient>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* ── TL: Donut — cx=188, cy=198 ── */}
        <circle cx="188" cy="192" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="9"/>
        <circle cx="188" cy="192" r="30" fill="none" stroke="url(#dg)" strokeWidth="9"
          strokeDasharray={`${d1} 210`} strokeLinecap="round" filter="url(#glow)"
          style={{transformOrigin:'188px 192px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="188" y="196" textAnchor="middle" fontSize="11" fontWeight="900" fill="#4f46e5"
          style={{fontFamily:'Inter,sans-serif'}}>{riskVal}%</text>
        <text x="188" y="207" textAnchor="middle" fontSize="6.5" fill="#6d28d9" fontWeight="700">RISK</text>

        {/* ── TC: World map — cx=328, cy=198 ── */}
        {/* Scanning line */}
        <line x1={262+(scan/100)*133} y1="128" x2={262+(scan/100)*133} y2="267"
          stroke="#4f46e5" strokeWidth="1.5" opacity="0.35"/>
        {/* Threat dots */}
        {[
          [278,158],[292,150],[306,155],[320,147],[334,152],[348,142],[362,148],
          [285,172],[299,166],[313,174],[327,162],[341,168],[355,158]
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i===3?"5":i===9?"4":"2.5"}
            fill={i===3?"#ef4444":i===9?"#f97316":"#818cf8"}
            opacity={dots[i]?0.95:0.3}
            filter={i===3||i===9?"url(#glow)":undefined}
            style={{transition:'opacity 0.6s ease'}}/>
        ))}
        <circle cx="320" cy="147" r={pulse?12:7} fill="none" stroke="#ef4444"
          strokeWidth="1" opacity={pulse?0:0.6}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>

        {/* ── TR: Shield pulse — cx=450, cy=198 ── */}
        <circle cx="450" cy="190" r={pulse?28:20} fill="none" stroke="#4f46e5"
          strokeWidth="1.5" opacity={pulse?0:0.45}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>
        <text x="450" y="240" textAnchor="middle" fontSize="8" fontWeight="800"
          fill={pulse?"#059669":"#4f46e5"} filter={pulse?"url(#glow)":undefined}
          style={{fontFamily:'Inter,sans-serif',transition:'fill 0.3s'}}>
          {pulse?"✓ SECURE":"PROTECTED"}
        </text>

        {/* ── BL: Bar chart — cx=188, cy=350 (bars at bottom of panel: y baseline=415) ── */}
        <line x1="118" y1="415" x2="258" y2="415" stroke="rgba(79,70,229,0.25)" strokeWidth="1.5"/>
        {lb.map((h,i)=>(
          <rect key={i} x={123+i*24} y={415-h*1.4} width="17" height={h*1.4} rx="4"
            fill="url(#bg)" opacity="0.88" filter="url(#glow)"
            style={{transition:'y 0.65s cubic-bezier(0.4,0,0.2,1),height 0.65s cubic-bezier(0.4,0,0.2,1)'}}/>
        ))}
        {['C','H','M','L','I'].map((l,i)=>(
          <text key={l} x={131+i*24} y="425" textAnchor="middle" fontSize="7" fill="#6d28d9" fontWeight="700">{l}</text>
        ))}

        {/* ── BC: Line chart — cx=328, cy=350 ── */}
        {[330,345,360,375,390].map(y=>(
          <line key={y} x1="264" y1={y} x2="394" y2={y} stroke="rgba(79,70,229,0.07)" strokeWidth="1"/>
        ))}
        <polyline points={ln} fill="none" stroke="url(#lg)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
          style={{transition:'points 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        {ln.split(' ').map((pt,i)=>{const[x,y]=pt.split(',');return(
          <circle key={i} cx={+x} cy={+y} r="4.5" fill="#4f46e5" stroke="white" strokeWidth="1.5"
            filter="url(#glow)" style={{transition:'all 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        )})}
        <line x1="264" y1="415" x2="394" y2="415" stroke="rgba(79,70,229,0.25)" strokeWidth="1.5"/>
        <text x="388" y="302" textAnchor="end" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>▼ 24%</text>

        {/* ── BR: Ring chart — cx=450, cy=350 ── */}
        <circle cx="450" cy="340" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10"/>
        <circle cx="450" cy="340" r="30" fill="none" stroke="url(#dg)" strokeWidth="10"
          strokeDasharray={`${d2} 210`} strokeLinecap="round" filter="url(#glow)"
          style={{transformOrigin:'450px 340px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="450" y="344" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7c3aed"
          style={{fontFamily:'Inter,sans-serif'}}>{slaVal}%</text>
        <text x="450" y="356" textAnchor="middle" fontSize="6.5" fill="#4f46e5" fontWeight="700">SLA</text>

        {/* LIVE badge */}
        <circle cx="570" cy="44" r="5" fill="#22c55e" opacity={pulse?1:0.5}
          style={{transition:'opacity 0.4s'}}/>
        <text x="580" y="48" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>LIVE</text>
      </svg>
    </div>
  );
}
