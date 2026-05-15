'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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

const XS = [236,264,292,320,348];
const PATTERNS = [
  [430,418,424,410,400], // gradual improvement  ▼ green
  [400,412,420,430,438], // upward worsening     ▲ red
  [430,420,436,412,404], // spike up then settle  ▼ green
];

export default function ShieldViz(){
  const [bars,setBars]=useState([0,0,0,0,0]);
  const [d1,setD1]=useState(0);
  const [d2,setD2]=useState(0);
  const [ys,setYs]=useState(PATTERNS[0]);
  const [patIdx,setPatIdx]=useState(0);
  const lineRef = useRef<SVGPolylineElement>(null);
  const [pct,setPct]=useState(7);
  const [pctGood,setPctGood]=useState(true);
  const [dots,setDots]=useState<boolean[]>(Array(12).fill(false));
  const [scan,setScan]=useState(0);
  const [pulse,setPulse]=useState(false);
  const [tk,setTk]=useState(0);
  const [activeBullet,setActiveBullet]=useState(0);
  const [trStep,setTrStep]=useState(0);
  const [mTk,setMTk]=useState(false);
  const [mounted,setMounted]=useState(false);

  const ln = XS.map((x,i)=>`${x},${ys[i]}`).join(' ');
  const sym = ys[ys.length-1]<ys[0]?'▼':'▲';
  const val = Math.abs(Math.round((ys[0]-ys[ys.length-1])/ys[0]*100));
  const good = ys[ys.length-1]<ys[0];

  const riskVal = useCountUp(74,1500,500);
  const slaVal  = useCountUp(91,1400,800);
  const [brSla,setBrSla]=useState(91);

  useEffect(()=>{
    setMounted(true);
    setTimeout(()=>{ setBars([38,62,46,76,52]); setD1(184); setD2(110); }, 700);
    const sv = setInterval(()=>setScan(n=>(n+1)%100), 55);
    const dv = setInterval(()=>setDots(Array(12).fill(0).map(()=>Math.random()>0.45)), 1800);
    const pv = setInterval(()=>{ setPulse(true); setTimeout(()=>setPulse(false),700); }, 2800);
    const tv = setInterval(()=>setTk(n=>n+1), 3400);
    const bv = setInterval(()=>setActiveBullet(n=>(n+1)%3), 20000);
    const mv = setInterval(()=>setMTk(n=>!n), 5500);

    const rv = setInterval(()=>setBrSla(prev=>{
      const next=Math.max(85,Math.min(98,prev+Math.round((Math.random()-0.45)*4)));
      setD2(Math.round(138.2*next/100));
      return next;
    }), 3000);
    return()=>{ clearInterval(sv); clearInterval(dv); clearInterval(pv); clearInterval(tv); clearInterval(bv); clearInterval(mv); clearInterval(rv); };
  },[]);

  // Self-scheduling tick: 950ms per step, 2500ms hold on master tick
  useEffect(()=>{
    const delay = trStep===3 ? 2500 : 950;
    const t = setTimeout(()=>setTrStep(n=>(n+1)%4), delay);
    return()=>clearTimeout(t);
  },[trStep]);

  // Swap pattern exactly at animation cycle boundary (opacity=0) — no jerk
  useEffect(()=>{
    const el = lineRef.current;
    if(!el) return;
    const onIter = ()=>setPatIdx(n=>{ const next=(n+1)%PATTERNS.length; setYs(PATTERNS[next]); return next; });
    el.addEventListener('animationiteration', onIter);
    return()=>el.removeEventListener('animationiteration', onIter);
  },[]);

  if(!mounted) return(
    <div style={{position:'relative',width:'100%',maxWidth:713,margin:'0 auto'}}>
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={713} height={713} unoptimized
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
    <div style={{position:'relative',width:'100%',maxWidth:713,margin:'0 auto'}}>
      <Image src="/pp_hr.gif" alt="PosturePilot Command Center"
        width={713} height={713} unoptimized
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
          <style>{`
            @keyframes pp-outerPulse {
              0%   { opacity: 0.55; }
              100% { opacity: 0; }
            }
            @keyframes lineDrawCycle {
              0%   { stroke-dashoffset: 125; opacity: 0; }
              5%   { stroke-dashoffset: 125; opacity: 1; }
              42%  { stroke-dashoffset: 0;   opacity: 1; }
              72%  { stroke-dashoffset: 0;   opacity: 1; }
              88%  { stroke-dashoffset: 0;   opacity: 0; }
              100% { stroke-dashoffset: 125; opacity: 0; }
            }
            @keyframes dot0 { 0%{opacity:0} 1%{opacity:0}  3%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
            @keyframes dot1 { 0%{opacity:0} 7%{opacity:0}  9%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
            @keyframes dot2 { 0%{opacity:0} 14%{opacity:0} 16%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
            @keyframes dot3 { 0%{opacity:0} 24%{opacity:0} 26%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
            @keyframes dot4 { 0%{opacity:0} 34%{opacity:0} 36%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
            @keyframes pctFade { 0%{opacity:0} 42%{opacity:0} 45%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
          `}</style>
        </defs>

        {/* ── TL: Donut cx=168, cy=142, r=22 (10% smaller) ── */}
        <circle cx="168" cy="142" r="22" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6"/>
        <circle cx="168" cy="142" r="22" fill="none" stroke="url(#dg)" strokeWidth="6"
          strokeDasharray={`${d1} 200`} strokeLinecap="round" filter="url(#gw)"
          style={{transformOrigin:'168px 142px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)',
            stroke:riskVal>70?'#f97316':'url(#dg)'}}/>
        <text x="170" y="139" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900"
          fill={riskVal>70?'#f97316':'#4f46e5'}
          style={{fontFamily:'Inter,sans-serif'}}>{riskVal}%</text>
        <text x="168" y="149" textAnchor="middle" dominantBaseline="middle" fontSize="9"
          fill={riskVal>70?'#ea580c':'#6d28d9'} fontWeight="700">RISK</text>

        {/* TL bullets — tilted 10° up, 1-min cycle animation */}
        <g transform="rotate(-3, 150, 199)">
          {[
            {cy:185, color:'#ef4444', label:'Critical'},
            {cy:199, color:'#f97316', label:'High'},
            {cy:213, color:'#eab308', label:'Medium'},
          ].map(({cy,color,label},i)=>{
            const isActive = activeBullet===i;
            return(
              <g key={i} style={{transition:'all 0.8s ease'}}>
                <circle cx="150" cy={cy} r={isActive?6:4}
                  fill={color} opacity={isActive?1:0.5}
                  filter={isActive?'url(#gw)':undefined}
                  style={{transition:'r 0.8s ease, opacity 0.8s ease'}}/>
                {/* Outer pulse ring on active */}
                {isActive&&<circle cx="150" cy={cy} r="10"
                  fill="none" stroke={color} strokeWidth="1.2" opacity="0.35"
                  style={{animation:'pp-outerPulse 1.2s ease-out infinite'}}/>}
                <text x="159" y={cy+4} fontSize="9" fill={color}
                  fontWeight={isActive?'900':'700'}
                  opacity={isActive?1:0.6}
                  style={{fontFamily:'Inter,sans-serif',transition:'all 0.8s ease'}}>
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── TC: World map cx=310, cy=175 ── */}
        <line x1={225+(scan/100)*170} y1="104" x2={225+(scan/100)*170} y2="226"
          stroke="#4f46e5" strokeWidth="1.5" opacity="0.28"/>
        {[
          [228,152],[242,144],[256,149],[270,141],[348,159],[298,137],[312,142],[326,134],
          [238,165],[256,159],[324,177],[292,155],[310,163],[328,151]
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i===4?"5":i===10?"4.5":"2.5"}
            fill={i===4?"#ef4444":i===10?"#f97316":"#818cf8"}
            opacity={dots[i]?0.95:0.28}
            filter={i===4||i===10?"url(#gw)":undefined}
            style={{transition:'opacity 0.6s ease'}}/>
        ))}
        <circle cx="348" cy="159" r={pulse?13:7} fill="none" stroke="#ef4444"
          strokeWidth="1" opacity={pulse?0:0.5}
          style={{transition:'r 0.7s ease,opacity 0.7s ease'}}/>

        {/* ── TR: 3 tick marks — 5° tilt down ── */}
        <g transform="rotate(3, 421, 197)">
          {['Scanned','Protected','Secure'].map((label,i)=>{
            const y = 183+i*14;
            const active = trStep>i;
            return(
              <g key={i}>
                <path d={`M${413},${y} l3,3 l6,-6`}
                  fill="none"
                  stroke={active?'#059669':'#c4b5fd'}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="12" strokeDashoffset={active?0:12}
                  filter={active?'url(#gw)':undefined}
                  style={{transition:active?'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1),stroke 0.3s ease':'none'}}
                />
                <text x="429" y={y+4} fontSize="9" fontWeight="700"
                  fill={active?'#059669':'#c4b5fd'}
                  opacity={active?1:0.38}
                  style={{fontFamily:'Inter,sans-serif',transition:active?'all 0.4s ease':'none'}}>
                  {label}
                </text>
              </g>
            );
          })}
        </g>
        {/* Master tick — draws in, fades out (no reverse) */}
        <g transform="translate(448,144) scale(0.9) translate(-448,-144)">
          <path d="M439,144 l6,6 l13,-13"
            fill="none"
            stroke="#059669"
            strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="29"
            strokeDashoffset={trStep>=3 ? 0 : 29}
            filter="url(#gw)"
            style={{
              opacity: trStep>=3 ? 1 : 0,
              transition: trStep>=3
                ? 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease'
                : 'opacity 0.5s ease'
            }}
          />
        </g>

        {/* ── BL: Bars — 3° tilt, staircase, 10px up ── */}
        <g transform="rotate(1, 173, 318)">
          {lb.map((h,i)=>{
            const baseY = 318 - i*2;
            return(
              <rect key={i} x={143+i*12} y={baseY-h*0.87} width="8" height={h*0.87} rx="2"
                fill={i===1||i===3?'#ef4444':'url(#bg)'} opacity="0.9" filter="url(#gw)"
                style={{transition:'y 0.65s cubic-bezier(0.4,0,0.2,1),height 0.65s cubic-bezier(0.4,0,0.2,1)'}}/>
            );
          })}
        </g>
        {/* BL bullet — tilted 8° up */}
        <g transform="rotate(-8, 144, 329)">
          <circle cx="144" cy="329" r="3" fill="#6d28d9" opacity="0.9"/>
          <text x="150" y="333" fontSize="9" fill="#6d28d9" fontWeight="700"
            style={{fontFamily:'Inter,sans-serif'}}>CVE Severity</text>
        </g>

        {/* ── BC: Line chart — draw-in cycle ── */}
        <g transform="translate(10, -147)">
          <polyline ref={lineRef} points={ln} fill="none" stroke="url(#lg)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" filter="url(#gw)"
            strokeDasharray="125"
            style={{animation:'lineDrawCycle 12s linear infinite'}}
          />
          {ln.split(' ').map((pt,i)=>{const[x,y]=pt.split(',');return(
            <circle key={i} cx={+x} cy={+y} r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5"
              filter="url(#gw)"
              style={{animation:`dot${i} 12s linear infinite`}}/>
          )})}
        </g>
        {/* % label — fixed position, outside translate group */}
        <text x="391" y="242" textAnchor="end" fontSize="8" fontWeight="800"
          fill={good?'#16a34a':'#ef4444'}
          style={{fontFamily:'Inter,sans-serif',transition:'fill 0.6s ease'}}>{sym} {val}%</text>
        {/* BC bullets — horizontal, two-line each */}
        <circle cx="235" cy="305" r="3" fill="#4f46e5" opacity="0.9"/>
        <text x="241" y="308" fontSize="9" fill="#4f46e5" fontWeight="700"
          style={{fontFamily:'Inter,sans-serif'}}>30-Day</text>
        <text x="241" y="318" fontSize="9" fill="#4f46e5" fontWeight="600" opacity="0.7"
          style={{fontFamily:'Inter,sans-serif'}}>Trend</text>
        <circle cx="350" cy="305" r="3" fill="#7c3aed" opacity="0.9"/>
        <text x="356" y="308" fontSize="9" fill="#7c3aed" fontWeight="700"
          style={{fontFamily:'Inter,sans-serif'}}>Patch</text>
        <text x="356" y="318" fontSize="9" fill="#7c3aed" fontWeight="600" opacity="0.7"
          style={{fontFamily:'Inter,sans-serif'}}>Rate</text>

        {/* ── BR: Ring cx=445, cy=280, r=22 ── */}
        <circle cx="445" cy="280" r="22" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6"/>
        <circle cx="445" cy="280" r="22" fill="none" stroke="url(#dg)" strokeWidth="6"
          strokeDasharray={`${d2} 138`} strokeLinecap="round" filter="url(#gw)"
          style={{transformOrigin:'445px 280px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)'}}/>
        <g transform="rotate(5, 445, 280)">
          <text x="445" y="276" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900" fill="#7c3aed"
            style={{fontFamily:'Inter,sans-serif',transition:'all 0.8s ease'}}>{brSla}%</text>
          <text x="445" y="287" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#4f46e5" fontWeight="700">SLA</text>
        </g>
        {/* BR bullet — 5° tilt up */}
        <g transform="rotate(7, 413, 313)">
          <circle cx="413" cy="313" r="3" fill="#7c3aed" opacity="0.9"/>
          <text x="419" y="317" fontSize="9" fill="#7c3aed" fontWeight="700"
            style={{fontFamily:'Inter,sans-serif'}}>Compliance</text>
        </g>

        {/* LIVE badge */}
        <circle cx="570" cy="44" r="5" fill="#22c55e" opacity={pulse?1:0.5}
          style={{transition:'opacity 0.4s'}}/>
        <text x="580" y="48" fontSize="8" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>LIVE</text>
      </svg>
    </div>
  );
}
