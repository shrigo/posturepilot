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
  const [ln,setLn]=useState('236,442 252,426 268,432 284,414 300,420 316,402 332,408 348,388');
  const [dots,setDots]=useState<boolean[]>(Array(12).fill(false));
  const [scan,setScan]=useState(0);
  const [pulse,setPulse]=useState(false);
  const [tk,setTk]=useState(0);
  const [mounted,setMounted]=useState(false);

  const riskVal = useCountUp(74,1500,500);
  const slaVal  = useCountUp(91,1400,800);

  useEffect(()=>{
    setMounted(true);
    setTimeout(()=>{ setBars([38,62,46,76,52]); setD1(184); setD2(174); }, 700);
    const sv = setInterval(()=>setScan(n=>(n+1)%100), 55);
    const dv = setInterval(()=>setDots(Array(12).fill(0).map(()=>Math.random()>0.45)), 1800);
    const pv = setInterval(()=>{ setPulse(true); setTimeout(()=>setPulse(false),700); }, 2800);
    const tv = setInterval(()=>setTk(n=>n+1), 3400);
    return()=>{ clearInterval(sv); clearInterval(dv); clearInterval(pv); clearInterval(tv); };
  },[]);

  if(!mounted) return(
    <div style={{position:'relative',width:'100%',maxWidth:620,margin:'0 auto'}}>
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={620} height={620} unoptimized
        style={{width:'100%',height:'auto',display:'block',filter:'drop-shadow(0 8px 40px rgba(79,70,229,0.18))'}}
        priority/>
    </div>
  );

  const lb = bars.map((b,i)=>Math.max(8, b+(tk%5===i?(Math.random()>0.5?9:-7):0)));

  /*
   Calibrated from PIL pixel analysis of pp_hr.gif at 620px display:
   TL Donut:  cx=153, cy=172, r=28
   TC Map:    cx=310, cy=175
   TR Shield: cx=470, cy=172
   BL Bars:   x=133+i*21, width=16, baseline_y=455
   BC Line:   x=236-348, y=388-442
   BR Ring:   cx=480, cy=335, r=34
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
            <stop offset="0%" stopColor="#6d28d9"/><stop offset="60%" stopColor="#4f46e5"/>
            <stop offset="100%" stopColor="#818cf8"/>
          </linearGradient>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <filter id="gw"><feGaussianBlur stdDeviation="1.4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── TL: Donut cx=153, cy=172, r=28 ── */}
        <circle cx="153" cy="172" r="28" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="8"/>
        <circle cx="153" cy="172" r="28" fill="none" stroke="url(#dg)" strokeWidth="8"
          strokeDasharray={`${d1} 200`} strokeLinecap="round" filter="url(#gw)"
          style={{transformOrigin:'153px 172px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="153" y="176" textAnchor="middle" fontSize="10" fontWeight="900" fill="#4f46e5"
          style={{fontFamily:'Inter,sans-serif'}}>{riskVal}%</text>
        <text x="153" y="187" textAnchor="middle" fontSize="6" fill="#6d28d9" fontWeight="700">RISK</text>

        {/* ── TC: World map cx=310, cy=175 ── */}
        <line x1={210+(scan/100)*200} y1="128" x2={210+(scan/100)*200} y2="255"
          stroke="#4f46e5" strokeWidth="1.5" opacity="0.28"/>
        {[
          [228,152],[242,144],[256,149],[270,141],[284,146],[298,137],[312,142],[326,134],
          [238,165],[256,159],[274,167],[292,155],[310,163],[328,151]
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i===4?"5":i===10?"4.5":"2.5"}
            fill={i===4?"#ef4444":i===10?"#f97316":"#818cf8"}
            opacity={dots[i]?0.95:0.28}
            filter={i===4||i===10?"url(#gw)":undefined}
            style={{transition:'opacity 0.6s ease'}}/>
        ))}
        <circle cx="284" cy="146" r={pulse?13:7} fill="none" stroke="#ef4444"
          strokeWidth="1" opacity={pulse?0:0.5}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>

        {/* ── TR: Shield pulse cx=470, cy=172 ── */}
        <circle cx="470" cy="166" r={pulse?30:20} fill="none" stroke="#4f46e5"
          strokeWidth="1.5" opacity={pulse?0:0.38}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>
        <text x="470" y="224" textAnchor="middle" fontSize="7.5" fontWeight="800"
          fill={pulse?"#059669":"#4f46e5"} filter={pulse?"url(#gw)":undefined}
          style={{fontFamily:'Inter,sans-serif',transition:'fill 0.3s'}}>
          {pulse?"✓ SECURE":"PROTECTED"}
        </text>

        {/* ── BL: Bars — x=133+i*21, baseline y=455 ── */}
        <line x1="126" y1="455" x2="222" y2="455" stroke="rgba(79,70,229,0.2)" strokeWidth="1.5"/>
        {lb.map((h,i)=>(
          <rect key={i} x={133+i*21} y={455-h*1.8} width="15" height={h*1.8} rx="3"
            fill="url(#bg)" opacity="0.9" filter="url(#gw)"
            style={{transition:'y 0.65s cubic-bezier(0.4,0,0.2,1),height 0.65s cubic-bezier(0.4,0,0.2,1)'}}/>
        ))}

        {/* ── BC: Line chart ── */}
        <polyline points={ln} fill="none" stroke="url(#lg)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#gw)"
          style={{transition:'points 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        {ln.split(' ').map((pt,i)=>{const[x,y]=pt.split(',');return(
          <circle key={i} cx={+x} cy={+y} r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5"
            filter="url(#gw)" style={{transition:'all 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        )})}
        <text x="346" y="382" textAnchor="end" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>▼ 24%</text>

        {/* ── BR: Ring cx=480, cy=335, r=34 ── */}
        <circle cx="480" cy="335" r="34" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10"/>
        <circle cx="480" cy="335" r="34" fill="none" stroke="url(#dg)" strokeWidth="10"
          strokeDasharray={`${d2} 230`} strokeLinecap="round" filter="url(#gw)"
          style={{transformOrigin:'480px 335px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="480" y="340" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7c3aed"
          style={{fontFamily:'Inter,sans-serif'}}>{slaVal}%</text>
        <text x="480" y="353" textAnchor="middle" fontSize="6.5" fill="#4f46e5" fontWeight="700">SLA</text>

        {/* LIVE badge */}
        <circle cx="570" cy="44" r="5" fill="#22c55e" opacity={pulse?1:0.5}
          style={{transition:'opacity 0.4s'}}/>
        <text x="580" y="48" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>LIVE</text>
      </svg>
    </div>
  );
}
