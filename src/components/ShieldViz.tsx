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
  const [ln,setLn]=useState('232,388 232,388');
  const [dots,setDots]=useState<boolean[]>(Array(14).fill(false));
  const [scan,setScan]=useState(0);
  const [pulse,setPulse]=useState(false);
  const [tk,setTk]=useState(0);

  const riskVal = useCountUp(74,1500,400);
  const slaVal  = useCountUp(91,1400,700);

  useEffect(()=>{
    // stagger bar growth
    setTimeout(()=>setBars([42,68,50,82,58]),600);
    // donut rings
    setTimeout(()=>{setD1(190);setD2(182);},700);
    // line chart draw-in
    setTimeout(()=>setLn('232,430 252,415 272,420 292,403 312,407 332,392 352,396 372,378'),900);
    // scanning map
    const sv=setInterval(()=>setScan(n=>(n+1)%100),60);
    // dot flicker
    const dv=setInterval(()=>setDots(Array(14).fill(0).map(()=>Math.random()>0.45)),1800);
    // shield pulse
    const pv=setInterval(()=>{setPulse(true);setTimeout(()=>setPulse(false),700);},2600);
    // bar live flicker
    const tv=setInterval(()=>setTk(n=>n+1),3200);
    return()=>{clearInterval(sv);clearInterval(dv);clearInterval(pv);clearInterval(tv);};
  },[]);

  // live bar heights
  const lb=bars.map((b,i)=>Math.max(12, b + (tk%5===i ? (Math.random()>0.5?8:-8) : 0)));

  return(
    <div style={{position:'relative',width:'100%',maxWidth:620,margin:'0 auto'}}>
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={620} height={620} unoptimized
        style={{width:'100%',height:'auto',display:'block',
          filter:'drop-shadow(0 8px 40px rgba(79,70,229,0.18))'}}
        priority/>

      {/* SVG overlay — viewBox matches display size 620x620 */}
      <svg viewBox="0 0 620 620"
        style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none'}}>
        <defs>
          <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9"/>
            <stop offset="50%" stopColor="#4f46e5"/>
            <stop offset="100%" stopColor="#818cf8"/>
          </linearGradient>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── TL PANEL: Donut chart — center (145,226) ── */}
        {/* Outer track */}
        <circle cx="145" cy="210" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="11"/>
        {/* Animated ring */}
        <circle cx="145" cy="210" r="36" fill="none" stroke="url(#dg)" strokeWidth="11"
          strokeDasharray={`${d1} 260`} strokeLinecap="round" filter="url(#glow)"
          style={{transformOrigin:'145px 210px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        {/* Count-up text */}
        <text x="145" y="215" textAnchor="middle" fontSize="13" fontWeight="900" fill="#4f46e5"
          style={{fontFamily:'Inter,sans-serif'}}>{riskVal}%</text>
        <text x="145" y="227" textAnchor="middle" fontSize="7" fill="#6d28d9" fontWeight="700">RISK</text>

        {/* ── TC PANEL: World map dots — center (310,226) ── */}
        {/* Scanning sweep line */}
        <line x1={213+(scan/100)*193} y1="144" x2={213+(scan/100)*193} y2="308"
          stroke="#4f46e5" strokeWidth="1.5" opacity="0.35"/>
        {/* Threat dots */}
        {[
          [240,170],[255,162],[268,175],[283,165],[298,170],[313,158],[328,163],[343,150],
          [260,188],[278,182],[296,190],[314,178],[332,185],[350,172]
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i===4?"5.5":i===10?"4.5":"2.5"}
            fill={i===4?"#ef4444":i===10?"#f97316":"#818cf8"}
            opacity={dots[i]?0.95:0.3}
            filter={i===4||i===10?"url(#glow)":undefined}
            style={{transition:'opacity 0.6s ease'}}/>
        ))}
        {/* Pulse rings on threat dots */}
        <circle cx="298" cy="170" r={pulse?14:8} fill="none" stroke="#ef4444"
          strokeWidth="1" opacity={pulse?0:0.5}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>

        {/* ── TR PANEL: Shield check — center (477,226) ── */}
        {/* Outer glow pulse */}
        <circle cx="477" cy="204" r={pulse?32:24} fill="none" stroke="#4f46e5"
          strokeWidth="1.5" opacity={pulse?0:0.4}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>
        {/* Status text */}
        <text x="477" y="262" textAnchor="middle" fontSize="8.5" fontWeight="800"
          fill={pulse?"#059669":"#4f46e5"} filter={pulse?"url(#glow)":undefined}
          style={{fontFamily:'Inter,sans-serif',transition:'fill 0.3s'}}>
          {pulse?"✓ SECURE":"PROTECTED"}
        </text>

        {/* ── BL PANEL: Bar chart — center (145,396) ── */}
        {/* Baseline */}
        <line x1="80" y1="468" x2="210" y2="468" stroke="rgba(79,70,229,0.2)" strokeWidth="1.5"/>
        {/* Bars */}
        {lb.map((h,i)=>(
          <rect key={i} x={88+i*23} y={468-h*1.5} width="16" height={h*1.5} rx="4"
            fill="url(#bg)" opacity="0.85" filter="url(#glow)"
            style={{transition:'y 0.65s cubic-bezier(0.4,0,0.2,1),height 0.65s cubic-bezier(0.4,0,0.2,1)'}}/>
        ))}
        {/* Bar labels */}
        {['C','H','M','L','I'].map((l,i)=>(
          <text key={l} x={96+i*23} y="478" textAnchor="middle" fontSize="7" fill="#6d28d9" fontWeight="700">{l}</text>
        ))}

        {/* ── BC PANEL: Line chart — center (310,396) ── */}
        {/* Grid */}
        {[340,360,380,400,420,440].map(y=>(
          <line key={y} x1="222" y1={y} x2="398" y2={y} stroke="rgba(79,70,229,0.08)" strokeWidth="1"/>
        ))}
        {/* Animated line */}
        <polyline points={ln} fill="none" stroke="url(#lg)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
          style={{transition:'points 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        {/* Dots on line */}
        {ln.split(' ').map((pt,i)=>{const[x,y]=pt.split(',');return(
          <circle key={i} cx={+x} cy={+y} r="5" fill="#4f46e5" stroke="white" strokeWidth="2"
            filter="url(#glow)" style={{transition:'all 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        )})}
        {/* Trend label */}
        <text x="390" y="342" textAnchor="end" fontSize="8.5" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>▼ 24%</text>

        {/* ── BR PANEL: Ring chart — center (477,396) ── */}
        <circle cx="477" cy="385" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12"/>
        <circle cx="477" cy="385" r="36" fill="none" stroke="url(#dg)" strokeWidth="12"
          strokeDasharray={`${d2} 260`} strokeLinecap="round" filter="url(#glow)"
          style={{transformOrigin:'477px 385px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="477" y="390" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7c3aed"
          style={{fontFamily:'Inter,sans-serif'}}>{slaVal}%</text>
        <text x="477" y="403" textAnchor="middle" fontSize="7" fill="#4f46e5" fontWeight="700">SLA</text>

        {/* LIVE badge */}
        <circle cx="565" cy="50" r="5" fill="#22c55e" opacity={pulse?1:0.5}
          style={{transition:'opacity 0.4s'}}/>
        <text x="575" y="54" fontSize="8.5" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>LIVE</text>
      </svg>
    </div>
  );
}
