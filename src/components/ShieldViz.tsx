'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function useCountUp(target:number,dur=1600,delay=0){
  const [v,setV]=useState(0);
  useEffect(()=>{
    let s:number|null=null,r:number;
    const t=setTimeout(()=>{
      const step=(ts:number)=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1);setV(Math.floor((1-Math.pow(1-p,3))*target));if(p<1)r=requestAnimationFrame(step);else setV(target);};
      r=requestAnimationFrame(step);
    },delay);
    return()=>{clearTimeout(t);cancelAnimationFrame(r);};
  },[target,dur,delay]);
  return v;
}

function useLive(base:number,range:number,ms=3500){
  const [v,setV]=useState(base);
  useEffect(()=>{const iv=setInterval(()=>setV(base+Math.floor((Math.random()*2-1)*range)),ms);return()=>clearInterval(iv);},[base,range,ms]);
  return v;
}

export default function ShieldViz(){
  const [bars,setBars]=useState([0,0,0,0,0]);
  const [d1,setD1]=useState(0);
  const [d2,setD2]=useState(0);
  const [ln,setLn]=useState('315,340 315,340');
  const [dots,setDots]=useState<number[]>([]);
  const [tk,setTk]=useState(0);
  const [pulse,setPulse]=useState(false);

  const risk=useCountUp(74,1500,300);
  const sla=useCountUp(91,1400,600);
  const liveBar=useLive(0,3,3800);

  useEffect(()=>{
    setTimeout(()=>{setBars([38,62,48,80,56]);setD1(190);setD2(178);},600);
    setTimeout(()=>setLn('290,345 305,333 320,338 335,324 350,328 365,314 380,318 395,304'),900);
    setDots(Array.from({length:12},()=>Math.random()));
    const iv=setInterval(()=>{setTk(n=>n+1);setDots(Array.from({length:12},()=>Math.random()));},3500);
    const pv=setInterval(()=>{setPulse(true);setTimeout(()=>setPulse(false),600);},2800);
    return()=>{clearInterval(iv);clearInterval(pv);};
  },[]);

  const lb=bars.map((b,i)=>Math.max(8,b+(i===tk%5?liveBar:0)));

  /* Approximate panel centers on the 1280x1254 logo at display 540px wide
     Scale: 540/1280 = 0.422
     Panel positions on source image (approximate):
     TL donut center:  ~(265, 310)  → display (112, 131)
     TC world map:     ~(640, 280)  → display (270, 118)
     TR shield:        ~(1010, 310) → display (428, 131)
     BL bars:          ~(265, 600)  → display (112, 253)
     BC line:          ~(640, 600)  → display (270, 253)
     BR ring:          ~(1010, 600) → display (428, 253)
  */

  const W=540, H=528; // display dimensions (540 wide, proportional)

  return(
    <div style={{position:'relative',width:'100%',maxWidth:W,margin:'0 auto'}}>
      {/* Logo with transparent background */}
      <Image src="/posturepilot-nobg.png" alt="PosturePilot Command Center"
        width={W} height={H} style={{width:'100%',height:'auto',display:'block'}} priority/>

      {/* Animated SVG overlay */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{position:'absolute',top:0,left:0,width:'100%',height:'auto',pointerEvents:'none'}}>
        <defs>
          <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
        </defs>

        {/* TL — Animated donut ring */}
        <circle cx="113" cy="176" r="34" fill="none" stroke="#e5e7eb" strokeWidth="9" opacity="0.5"/>
        <circle cx="113" cy="176" r="34" fill="none" stroke="url(#dg)" strokeWidth="9"
          strokeDasharray={`${d1} 220`} strokeLinecap="round"
          style={{transformOrigin:'113px 176px',transform:'rotate(-90deg)',transition:'stroke-dasharray 1.5s ease'}}/>
        <text x="113" y="181" textAnchor="middle" fontSize="12" fontWeight="900" fill="#4f46e5">{risk}%</text>

        {/* TC — Pulsing threat dots on map */}
        {[[242,148],[258,140],[272,152],[286,144],[300,148],[314,138],[258,156],[272,162],[286,154],[300,160],[314,150],[272,168]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i===3?"5":"2.5"}
            fill={i===3?"#ea580c":i===7?"#dc2626":"#a5b4fc"}
            opacity={dots[i]>0.7?1:0.5}
            style={{transition:'opacity 0.8s ease'}}/>
        ))}
        {/* Scanning line on map */}
        <line x1={232+(tk%20)*8} y1="128" x2={232+(tk%20)*8} y2="178"
          stroke="#4f46e5" strokeWidth="1" opacity="0.4"
          style={{transition:'x1 0.5s linear,x2 0.5s linear'}}/>

        {/* TR — Shield pulse */}
        <circle cx="428" cy="176" r={pulse?28:24} fill="none" stroke="#4f46e5"
          strokeWidth="1.5" opacity={pulse?0.3:0}
          style={{transition:'r 0.4s ease,opacity 0.4s ease'}}/>
        <text x="428" y="210" textAnchor="middle" fontSize="8.5" fontWeight="800"
          fill={pulse?"#059669":"#4f46e5"} style={{transition:'fill 0.3s'}}>
          {pulse?"✓ SECURE":"COMPLIANT"}
        </text>

        {/* BL — Animated bars */}
        {lb.map((h,i)=>(
          <rect key={i} x={82+i*22} y={320-h*1.6} width="16" height={h*1.6} rx="4"
            fill="url(#bg)" opacity="0.85"
            style={{transition:'y 0.6s ease,height 0.6s ease'}}/>
        ))}
        <line x1="76" y1="322" x2="196" y2="322" stroke="#c4b5fd" strokeWidth="1" opacity="0.5"/>

        {/* BC — Animated line chart */}
        {[290,305,320,335,350,365,380,395].map((_,i)=>(
          <line key={i} x1={290+i*15} y1="305" x2={290+i*15} y2="360" stroke="#e5e7eb" strokeWidth="0.8" opacity="0.4"/>
        ))}
        <polyline points={ln} fill="none" stroke="url(#lg)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          style={{transition:'points 1.2s ease'}}/>
        {ln.split(' ').map((p,i)=>{const[x,y]=p.split(',');return(
          <circle key={i} cx={+x} cy={+y} r="4.5" fill="#4f46e5" stroke="white" strokeWidth="2"
            style={{transition:'all 1.2s ease'}}/>
        )})}
        <line x1="284" y1="360" x2="400" y2="360" stroke="#c4b5fd" strokeWidth="1" opacity="0.5"/>
        <text x="395" y="308" textAnchor="end" fontSize="8" fill="#16a34a" fontWeight="700">▼ {24+tk%4}%</text>

        {/* BR — Animated ring */}
        <circle cx="428" cy="318" r="34" fill="none" stroke="#e5e7eb" strokeWidth="10" opacity="0.5"/>
        <circle cx="428" cy="318" r="34" fill="none" stroke="url(#dg)" strokeWidth="10"
          strokeDasharray={`${d2} 220`} strokeLinecap="round"
          style={{transformOrigin:'428px 318px',transform:'rotate(-90deg)',transition:'stroke-dasharray 1.5s ease'}}/>
        <text x="428" y="323" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7c3aed">{sla}%</text>
        <text x="428" y="337" textAnchor="middle" fontSize="7" fill="#6d28d9" fontWeight="600">SLA</text>

        {/* Live indicator */}
        <circle cx="490" cy="62" r="4.5" fill="#22c55e"
          opacity={pulse?1:0.5} style={{transition:'opacity 0.4s'}}/>
        <text x="500" y="66" fontSize="8" fill="#22c55e" fontWeight="700">LIVE</text>
      </svg>
    </div>
  );
}
