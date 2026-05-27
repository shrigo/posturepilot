'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useClient } from '@/context/ClientContext';

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

function smoothPath(pts:[number,number][],tension=0.2):string{
  if(pts.length<2) return '';
  let d=`M${pts[0][0]},${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)];
    const p1=pts[i];
    const p2=pts[i+1];
    const p3=pts[Math.min(pts.length-1,i+2)];
    const cp1x=p1[0]+(p2[0]-p0[0])*tension;
    const cp1y=p1[1]+(p2[1]-p0[1])*tension;
    const cp2x=p2[0]-(p3[0]-p1[0])*tension;
    const cp2y=p2[1]-(p3[1]-p1[1])*tension;
    d+=` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const XS = [236,264,292,320,348];
const PATTERNS = [
  [430,418,424,410,400], // risk: gradual improvement  ▼
  [400,412,420,430,438], // risk: upward worsening     ▲
  [430,420,436,412,404], // risk: spike then settle     ▼
];
// Opposite direction to PATTERNS — inversely correlated
const PATCH_PATTERNS = [
  [400,412,418,426,434], // patch rate: declining (inverse of risk improving)
  [438,428,418,410,402], // patch rate: improving (inverse of risk worsening)
  [404,418,408,428,436], // patch rate: opposite spike
];

export default function ShieldViz(){
  const [bars,setBars]=useState([0,0,0,0,0]);
  const [d1,setD1]=useState(0);
  const [d2,setD2]=useState(0);
  const [ys,setYs]=useState(PATTERNS[0]);
  const [ys2,setYs2]=useState(PATCH_PATTERNS[0]);
  const [patIdx,setPatIdx]=useState(0);
  // Line + dot refs for RAF-driven animation
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const dot1Refs = useRef<(SVGCircleElement|null)[]>([null,null,null]);
  const dot2Refs = useRef<(SVGCircleElement|null)[]>([null,null,null]);
  const rafStartRef = useRef(0);
  const lineVisibleRef = useRef(false);
  const pctTextRef = useRef<SVGTextElement>(null);
  const len1Ref = useRef(140);
  const len2Ref = useRef(140);
  const [dots,setDots]=useState<boolean[]>(Array(12).fill(false));
  const [scan,setScan]=useState(0);
  const [pulse,setPulse]=useState(false);
  const [tk,setTk]=useState(0);
  const [activeBullet,setActiveBullet]=useState(0);
  const [trStep,setTrStep]=useState(0);
  const [mTk,setMTk]=useState(false);
  const [mounted,setMounted]=useState(false);
  const startTimeRef = useRef(Date.now());
  const patIdxRef = useRef(0);

  const pts  = XS.map((x,i)=>[x,ys[i]]  as [number,number]);
  const pts2 = XS.map((x,i)=>[x,ys2[i]] as [number,number]);
  const lp   = smoothPath(pts);
  const lp2  = smoothPath(pts2);

  // Cache path lengths — recompute only when path changes, not every RAF frame
  useEffect(()=>{
    if(line1Ref.current){
      const l = line1Ref.current.getTotalLength();
      len1Ref.current = l;
      line1Ref.current.style.strokeDasharray = `${l}`;
      line1Ref.current.style.strokeDashoffset = `${l}`;
    }
  },[lp]);
  useEffect(()=>{
    if(line2Ref.current){
      const l = line2Ref.current.getTotalLength();
      len2Ref.current = l;
      line2Ref.current.style.strokeDasharray = `${l}`;
      line2Ref.current.style.strokeDashoffset = `${l}`;
    }
  },[lp2]);
  const sym = ys[ys.length-1]<ys[0]?'▼':'▲';
  const val = Math.abs(Math.round((ys[0]-ys[ys.length-1])/ys[0]*100));
  const good = ys[ys.length-1]<ys[0];

  const { currentClient, isUnderAttack } = useClient();
  const activeScore = isUnderAttack ? 42 : currentClient.score;
  const postureVal = useCountUp(activeScore, 1500, 500);
  const slaVal  = useCountUp(91,1400,800);
  const [brSla,setBrSla]=useState(91);

  useEffect(()=>{
    setMounted(true);
    setTimeout(()=>{ setBars([38,62,46,76,52]); setD1(Math.round(138.23 * activeScore / 100)); setD2(110); }, 700);
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

  // Single RAF loop — drives line drawing + dots with perfect sync, no CSS animation
  useEffect(()=>{
    const CYCLE = 12000, DASH = 140;
    const DS = 0.05, DE = 0.42, HE = 0.72, FE = 0.88; // draw/hold/fade phase boundaries
    const DOT_AT = [DS, (DS+DE)/2, DE]; // dot appears when line tip reaches 0%, 50%, 100% of draw

    const getState = (p:number, len:number)=>{
      if(p < DS) return {dash:len, op:0};
      if(p <= DE) return {dash:len*(1-(p-DS)/(DE-DS)), op:1};
      if(p <= HE) return {dash:0, op:1};
      if(p <= FE) return {dash:0, op:1-(p-HE)/(FE-HE)};
      return {dash:len, op:0};
    };

    let rafId:number;
    const tick = (ts:number)=>{
      if(!rafStartRef.current) rafStartRef.current = ts;
      const elapsed = ts - rafStartRef.current;
      const p1 = (elapsed % CYCLE) / CYCLE;
      const p2 = ((elapsed - 600 + CYCLE) % CYCLE) / CYCLE; // line2 starts 600ms AFTER line1

      // ONE shared fade value — all elements disappear simultaneously
      const sharedOp = p1 < DS ? 0
        : p1 <= HE ? 1
        : p1 <= FE ? 1-(p1-HE)/(FE-HE)
        : 0;

      const len1 = len1Ref.current;
      const len2 = len2Ref.current;

      // Line 1: hidden→drawing→held→fading→reset hidden
      const dash1 = p1 < DS  ? len1
        : p1 <= DE ? len1*(1-(p1-DS)/(DE-DS))
        : p1 <= FE ? 0
        : len1; // invisible phase: reset for next cycle
      if(line1Ref.current){
        line1Ref.current.style.strokeDashoffset=`${dash1}`;
        line1Ref.current.style.opacity=`${p1>=DS ? sharedOp : 0}`;
      }

      // Line 2: same but on p2 clock
      const dash2 = p2 < DS  ? len2
        : p2 <= DE ? len2*(1-(p2-DS)/(DE-DS))
        : p2 <= FE ? 0
        : len2; // invisible phase: reset for next cycle
      if(line2Ref.current){
        line2Ref.current.style.strokeDashoffset=`${dash2}`;
        line2Ref.current.style.opacity=`${p2>=DS ? sharedOp : 0}`;
      }

      // All dots use shared fade — disappear with lines
      DOT_AT.forEach((threshold,i)=>{
        if(dot1Refs.current[i]) dot1Refs.current[i]!.style.opacity=`${p1>=threshold ? sharedOp : 0}`;
        if(dot2Refs.current[i]) dot2Refs.current[i]!.style.opacity=`${p2>=threshold ? sharedOp : 0}`;
      });

      // % label — follows indigo line tip, all RAF-driven
      const pat = PATTERNS[patIdxRef.current];
      let tipX = XS[4] + 10 + 6; // default: end of line
      let tipY = pat[4] - 147 - 8;
      let pctVal = Math.max(1,Math.abs(Math.round((pat[0]-pat[pat.length-1])/pat[0]*100)));
      let pctGood = pat[pat.length-1] < pat[0];
      if(p1 >= DS && p1 <= DE){
        const f=(p1-DS)/(DE-DS), pos=f*(XS.length-1);
        const idx=Math.min(Math.floor(pos),XS.length-2), fr=pos-idx;
        tipX = XS[idx]+(XS[idx+1]-XS[idx])*fr + 10 + 6;
        tipY = pat[idx]+(pat[idx+1]-pat[idx])*fr - 147 - 8;
        const y = pat[idx]+(pat[idx+1]-pat[idx])*fr;
        pctVal = Math.max(1,Math.round(Math.abs((pat[0]-y)/pat[0]*100)));
        pctGood = y < pat[0];
      }
      if(pctTextRef.current){
        const show = sharedOp > 0 && p1 >= DS;
        pctTextRef.current.setAttribute('x',`${tipX}`);
        pctTextRef.current.setAttribute('y',`${tipY}`);
        pctTextRef.current.textContent = `${pctGood?'▼':'▲'} ${pctVal}%`;
        pctTextRef.current.style.fill = pctGood?'#16a34a':'#ef4444';
        pctTextRef.current.style.opacity = show?`${sharedOp}`:'0';
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(rafId);
  },[]);

  // Slow updates — pattern cycling + % counter (200ms is fine here)
  useEffect(()=>{
    const CYCLE = 12000, DS = 0.05, DE = 0.42, INV = 0.88;
    const iv = setInterval(()=>{
      const elapsed = Date.now() - startTimeRef.current;
      const progress = (elapsed % CYCLE) / CYCLE;

      // Swap only when BOTH lines are fully invisible (p1>=0.93 guarantees p2>=0.88)
      if(progress >= 0.93){
        const newIdx = Math.floor(elapsed/CYCLE) % PATTERNS.length;
        if(newIdx !== patIdxRef.current){
          patIdxRef.current = newIdx;
          setYs(PATTERNS[newIdx]); setYs2(PATCH_PATTERNS[newIdx]); setPatIdx(newIdx);
        }
      }

      // % counter now fully RAF-driven via pctTextRef — nothing to do here
    },200);
    return ()=> clearInterval(iv);
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
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444"/>
            <stop offset="50%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#eab308"/>
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
            @keyframes pctFade { 0%{opacity:0} 42%{opacity:0} 45%{opacity:1} 72%{opacity:1} 86%{opacity:0} 100%{opacity:0} }
          `}</style>
        </defs>

        {/* ── TL: Donut cx=168, cy=142, r=22 (10% smaller) ── */}
        <circle cx="168" cy="142" r="22" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6"/>
        <circle cx="168" cy="142" r="22" fill="none" stroke="url(#sg)" strokeWidth="6"
          strokeDasharray={`${Math.round(138.23 * postureVal / 100)} 200`} strokeLinecap="round" filter="url(#gw)"
          style={{transformOrigin:'168px 142px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)',
            stroke: postureVal > 80 ? '#16a34a' : postureVal > 60 ? '#fbbf24' : '#ef4444'}}/>
        <text x="168" y="139" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900"
          fill={postureVal > 80 ? '#16a34a' : postureVal > 60 ? '#fbbf24' : '#ef4444'}
          style={{fontFamily:'Inter,sans-serif'}}>{postureVal}%</text>
        <text x="168" y="149" textAnchor="middle" dominantBaseline="middle" fontSize="7.5"
          fill={postureVal > 80 ? '#15803d' : '#4f46e5'} fontWeight="900" letterSpacing="0.05em">POSTURE</text>

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
            const BAR_COLORS = ['url(#bg)','#f97316','#eab308','#ef4444','#16a34a'];
            return(
              <rect key={i} x={143+i*12} y={baseY-h*0.87} width="8" height={h*0.87} rx="2"
                fill={BAR_COLORS[i]} opacity="0.9" filter="url(#gw)"
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

        {/* ── BC: Two lines — Risk (indigo) + Patch Rate (red), RAF driven ── */}
        <g transform="translate(10, -147)">
          <path ref={line1Ref} d={lp} fill="none" stroke="url(#lg)" strokeWidth="1.9"
            strokeLinecap="round" strokeLinejoin="round" filter="url(#gw)"
            strokeDasharray="140" strokeDashoffset="140"
            style={{opacity:0, willChange:'opacity'}}/>
          <path ref={line2Ref} d={lp2} fill="none" stroke="#ef4444" strokeWidth="1.9"
            strokeLinecap="round" strokeLinejoin="round" filter="url(#gw)"
            strokeDasharray="140" strokeDashoffset="140"
            style={{opacity:0, willChange:'opacity'}}/>
          {[0,2,4].map((idx,i)=>(
            <circle key={idx} ref={el=>{ dot1Refs.current[i]=el; }}
              cx={pts[idx][0]} cy={pts[idx][1]} r="3.5"
              fill="#4f46e5" stroke="white" strokeWidth="1.5" filter="url(#gw)"
              style={{opacity:0}}/>
          ))}
          {[0,2,4].map((idx,i)=>(
            <circle key={`p${idx}`} ref={el=>{ dot2Refs.current[i]=el; }}
              cx={pts2[idx][0]} cy={pts2[idx][1]} r="3.5"
              fill="#ef4444" stroke="white" strokeWidth="1.5" filter="url(#gw)"
              style={{opacity:0}}/>
          ))}
        </g>
        {/* % label — follows indigo line tip, RAF-driven */}
        <text ref={pctTextRef} fontSize="8" fontWeight="800" textAnchor="start"
          style={{fontFamily:'Inter,sans-serif',opacity:0}}/>
        {/* BC bullets — indigo=Risk, red=Patch Rate */}
        <circle cx="235" cy="305" r="3" fill="#4f46e5" opacity="0.9"/>
        <text x="241" y="308" fontSize="9" fill="#4f46e5" fontWeight="700"
          style={{fontFamily:'Inter,sans-serif'}}>30-Day</text>
        <text x="241" y="318" fontSize="9" fill="#4f46e5" fontWeight="600" opacity="0.7"
          style={{fontFamily:'Inter,sans-serif'}}>Risk</text>
        <circle cx="350" cy="305" r="3" fill="#ef4444" opacity="0.9"/>
        <text x="356" y="308" fontSize="9" fill="#ef4444" fontWeight="700"
          style={{fontFamily:'Inter,sans-serif'}}>Patch</text>
        <text x="356" y="318" fontSize="9" fill="#ef4444" fontWeight="600" opacity="0.7"
          style={{fontFamily:'Inter,sans-serif'}}>Rate</text>

        {/* ── BR: Ring cx=445, cy=280, r=22 ── */}
        <circle cx="445" cy="280" r="22" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6"/>
        <circle cx="445" cy="280" r="22" fill="none" stroke="url(#dg)" strokeWidth="6"
          strokeDasharray={`${d2} 138`} strokeLinecap="round" filter="url(#gw)"
          style={{transformOrigin:'445px 280px',transform:'rotate(-90deg)',
            transition:'stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)',
            stroke:brSla>=90?'#16a34a':'url(#dg)'}}/>
        <g transform="rotate(5, 445, 280)">
          <text x="445" y="276" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900"
            fill={brSla>=90?'#16a34a':'#7c3aed'}
            style={{fontFamily:'Inter,sans-serif',transition:'all 0.8s ease'}}>{brSla}%</text>
          <text x="445" y="287" textAnchor="middle" dominantBaseline="middle" fontSize="9"
            fill={brSla>=90?'#15803d':'#4f46e5'} fontWeight="700">SLA</text>
        </g>
        {/* BR bullet — matches ring color */}
        <g transform="rotate(7, 413, 313)">
          <circle cx="413" cy="313" r="3" fill={brSla>=90?'#16a34a':'#7c3aed'} opacity="0.9"/>
          <text x="419" y="317" fontSize="9" fill={brSla>=90?'#16a34a':'#7c3aed'} fontWeight="700"
            style={{fontFamily:'Inter,sans-serif',transition:'fill 0.8s ease'}}>Compliance</text>
        </g>

        {/* LIVE badge */}
        <circle cx="570" cy="44" r="8" fill="#22c55e" opacity={pulse?1:0.5}
          style={{transition:'opacity 0.4s'}}/>
        <text x="583" y="49" fontSize="11" fill="#16a34a" fontWeight="800"
          style={{fontFamily:'Inter,sans-serif'}}>LIVE</text>
      </svg>
    </div>
  );
}
