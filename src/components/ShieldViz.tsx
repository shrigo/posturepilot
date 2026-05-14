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
  const [ln,setLn]=useState('270,420 270,420');
  const [dots,setDots]=useState<boolean[]>(Array(12).fill(false));
  const [scan,setScan]=useState(0);
  const [pulse,setPulse]=useState(false);
  const [tk,setTk]=useState(0);

  const riskVal = useCountUp(74,1500,500);
  const slaVal  = useCountUp(91,1400,800);

  useEffect(()=>{
    setTimeout(()=>{ setBars([40,65,48,78,55]); setD1(186); setD2(176); }, 700);
    setTimeout(()=>setLn('262,435 278,420 294,426 310,409 326,415 342,398 358,404 374,386'), 900);
    const sv = setInterval(()=>setScan(n=>(n+1)%100), 55);
    const dv = setInterval(()=>setDots(Array(12).fill(0).map(()=>Math.random()>0.45)), 1800);
    const pv = setInterval(()=>{ setPulse(true); setTimeout(()=>setPulse(false),700); }, 2800);
    const tv = setInterval(()=>setTk(n=>n+1), 3400);
    return()=>{ clearInterval(sv); clearInterval(dv); clearInterval(pv); clearInterval(tv); };
  },[]);

  const lb = bars.map((b,i)=>Math.max(10, b+(tk%5===i?(Math.random()>0.5?10:-8):0)));

  /*
    Positions from actual purple pixel analysis of pp_hr.gif (1800x1800 → 620px display):
    TL Donut:   cx=170, cy=188,  ring_r≈66px (but draw smaller: ~32px to fit inside)
    TR Shield:  cx=449, cy=188
    BL Bars:    x=70-235, bar_base_y=495, bar_top_y=279
    BR Ring:    cx=473, cy=387,  ring_r≈88px (draw ~38px)
    TC Map:     cx≈310, cy≈188  (center column, top row)
    BC Line:    cx≈310, cy≈387  (center column, bottom row)
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
            <stop offset="0%" stopColor="#6d28d9"/><stop offset="60%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#818cf8"/>
          </linearGradient>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* ── TL: Donut — cx=170, cy=188 (from actual purple pixels) ── */}
        <circle cx="170" cy="188" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9"/>
        <circle cx="170" cy="188" r="32" fill="none" stroke="url(#dg)" strokeWidth="9"
          strokeDasharray={`${d1} 210`} strokeLinecap="round" filter="url(#glow)"
          style={{transformOrigin:'170px 188px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="170" y="193" textAnchor="middle" fontSize="11" fontWeight="900" fill="#4f46e5"
          style={{fontFamily:'Inter,sans-serif'}}>{riskVal}%</text>
        <text x="170" y="205" textAnchor="middle" fontSize="6.5" fill="#6d28d9" fontWeight="700">RISK</text>

        {/* ── TC: World map — cx=310, cy=188 ── */}
        {/* Scanning sweep */}
        <line x1={210+(scan/100)*200} y1="128" x2={210+(scan/100)*200} y2="260"
          stroke="#4f46e5" strokeWidth="1.5" opacity="0.3"/>
        {[
          [228,155],[242,147],[256,152],[270,144],[284,149],[298,140],[312,145],[326,137],
          [240,168],[258,162],[276,170],[294,158],[312,166],[330,153]
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i===4?"5":i===10?"4.5":"2.5"}
            fill={i===4?"#ef4444":i===10?"#f97316":"#818cf8"}
            opacity={dots[i]?0.95:0.3}
            filter={i===4||i===10?"url(#glow)":undefined}
            style={{transition:'opacity 0.6s ease'}}/>
        ))}
        <circle cx="284" cy="149" r={pulse?12:7} fill="none" stroke="#ef4444"
          strokeWidth="1" opacity={pulse?0:0.55}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>

        {/* ── TR: Shield pulse — cx=449, cy=188 ── */}
        <circle cx="449" cy="182" r={pulse?28:20} fill="none" stroke="#4f46e5"
          strokeWidth="1.5" opacity={pulse?0:0.4}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>
        <text x="449" y="236" textAnchor="middle" fontSize="7.5" fontWeight="800"
          fill={pulse?"#059669":"#4f46e5"} filter={pulse?"url(#glow)":undefined}
          style={{fontFamily:'Inter,sans-serif',transition:'fill 0.3s'}}>
          {pulse?"✓ SECURE":"PROTECTED"}
        </text>

        {/* ── BL: Bar chart — base y=490, bars in x=80-230 ── */}
        <line x1="78" y1="490" x2="232" y2="490" stroke="rgba(79,70,229,0.25)" strokeWidth="1.5"/>
        {lb.map((h,i)=>(
          <rect key={i} x={88+i*27} y={490-h*2.0} width="20" height={h*2.0} rx="4"
            fill="url(#bg)" opacity="0.88" filter="url(#glow)"
            style={{transition:'y 0.65s cubic-bezier(0.4,0,0.2,1),height 0.65s cubic-bezier(0.4,0,0.2,1)'}}/>
        ))}
        {['C','H','M','L','I'].map((l,i)=>(
          <text key={l} x={98+i*27} y="502" textAnchor="middle" fontSize="7" fill="#6d28d9" fontWeight="700">{l}</text>
        ))}

        {/* ── BC: Line chart — cx=310, cy=387, y range 330-490 ── */}
        {[350,370,390,410,430,450].map(y=>(
          <line key={y} x1="210" y1={y} x2="410" y2={y} stroke="rgba(79,70,229,0.07)" strokeWidth="1"/>
        ))}
        <polyline points={ln} fill="none" stroke="url(#lg)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
          style={{transition:'points 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        {ln.split(' ').map((pt,i)=>{const[x,y]=pt.split(',');return(
          <circle key={i} cx={+x} cy={+y} r="4.5" fill="#4f46e5" stroke="white" strokeWidth="1.5"
            filter="url(#glow)" style={{transition:'all 1.3s cubic-bezier(0.4,0,0.2,1)'}}/>
        )})}
        <line x1="210" y1="490" x2="410" y2="490" stroke="rgba(79,70,229,0.25)" strokeWidth="1.5"/>
        <text x="405" y="330" textAnchor="end" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>▼ 24%</text>

        {/* ── BR: Ring — cx=473, cy=387 (from actual purple pixels) ── */}
        <circle cx="473" cy="387" r="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="11"/>
        <circle cx="473" cy="387" r="38" fill="none" stroke="url(#dg)" strokeWidth="11"
          strokeDasharray={`${d2} 260`} strokeLinecap="round" filter="url(#glow)"
          style={{transformOrigin:'473px 387px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <text x="473" y="392" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7c3aed"
          style={{fontFamily:'Inter,sans-serif'}}>{slaVal}%</text>
        <text x="473" y="406" textAnchor="middle" fontSize="6.5" fill="#4f46e5" fontWeight="700">SLA</text>

        {/* LIVE badge */}
        <circle cx="570" cy="44" r="5" fill="#22c55e" opacity={pulse?1:0.5}
          style={{transition:'opacity 0.4s'}}/>
        <text x="580" y="48" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>LIVE</text>
      </svg>
    </div>
  );
}
