import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import AmbassadorNav from '../../components/AmbassadorNav';

const F = "'Plus Jakarta Sans', sans-serif";

/* ─── Icons ─── */
const CheckIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>;
const UploadIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>;
const CloseIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>;
const LockIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>;
const VideoIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const UsersIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const BookIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>;
const PenIcon      = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const MicIcon      = () => <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93H2c0 4.97 3.53 9.09 8 9.93V22h4v-4.07c4.47-.84 8-4.96 8-9.93h-2c0 4.08-3.06 7.44-7 7.93V16h-2v-.07z"/></svg>;

const CAT = {
  'Social Media': { icon: <InstagramIcon/>, color:'#DB2777', dark:'#F472B6', p:['#7C1D4E','#DB2777','#F472B6'], glow:'#DB2777' },
  'Referral':     { icon: <UsersIcon/>,     color:'#059669', dark:'#34D399', p:['#064E3B','#059669','#34D399'], glow:'#059669' },
  'Learning':     { icon: <BookIcon/>,      color:'#2563EB', dark:'#60A5FA', p:['#1E3A8A','#2563EB','#93C5FD'], glow:'#2563EB' },
  'Content':      { icon: <PenIcon/>,       color:'#D97706', dark:'#FCD34D', p:['#78350F','#D97706','#FCD34D'], glow:'#D97706' },
  'Event':        { icon: <MicIcon/>,       color:'#7C3AED', dark:'#A78BFA', p:['#3B0764','#7C3AED','#C4B5FD'], glow:'#7C3AED' },
  'Secret':       { icon: '?',             color:'#F59E0B', dark:'#FCD34D', p:['#78350F','#F59E0B','#FDE68A'], glow:'#F59E0B' },
  'Community':    { icon: <UsersIcon/>,     color:'#0891B2', dark:'#22D3EE', p:['#164E63','#0891B2','#67E8F9'], glow:'#0891B2' },
};

/* ── Astronaut on Rocket ── */
function AstronautOnRocket({ gender, xp }) {
  return (
    <g>
      <text x="30" y="-18" textAnchor="middle" fontSize="8.5" fontWeight="900"
        fill="#FCD34D" fontFamily={F}
        style={{ filter:'drop-shadow(0 0 5px rgba(252,211,77,1))' }}>
        {(xp||0).toLocaleString()}
      </text>
      <ellipse cx="24" cy="20" rx="24" ry="9.5" fill="url(#rkBody)"/>
      <path d="M46 20 C54 20 60 16 62 13 C61 20 61 23 62 27 C60 24 54 20 46 20Z" fill="url(#rkNose)"/>
      <ellipse cx="30" cy="14" rx="14" ry="3.5" fill="white" opacity="0.1" transform="rotate(-5 30 14)"/>
      <ellipse cx="2" cy="20" rx="5" ry="7.5" fill="url(#rkEngine)"/>
      <ellipse cx="-7" cy="20" rx="9" ry="5.5" fill="url(#rkFlame)" filter="url(#rkFlameGlow)" opacity="0.95"/>
      <ellipse cx="-12" cy="20" rx="6" ry="3.5" fill="#FDE68A" opacity="0.8"/>
      <ellipse cx="-16" cy="20" rx="3.5" ry="2" fill="white" opacity="0.6"/>
      <path d="M10 27 L4 40 L16 31Z" fill="url(#rkFin)"/>
      <path d="M10 13 L4 0 L16 9Z" fill="url(#rkFin)"/>
      <path d="M42 24 L38 33 L46 28Z" fill="url(#rkFin)" opacity="0.85"/>
      <circle cx="32" cy="18" r="6.5" fill="url(#rkWindow)" stroke="#C4B5FD" strokeWidth="1.3"/>
      <circle cx="32" cy="18" r="5" fill="#12103A" opacity="0.65"/>
      <rect x="18" y="12" width="2" height="16" rx="1" fill="white" opacity="0.1"/>
      <ellipse cx="30" cy="10" rx="7.5" ry="5.5" fill={gender==='female'?'#818CF8':'#6366F1'}/>
      <path d="M23 11 Q19 15 18 19" stroke={gender==='female'?'#818CF8':'#6366F1'} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <circle cx="17.5" cy="20.5" r="2.5" fill={gender==='female'?'#A5B4FC':'#C4B5FD'}/>
      <path d="M37 11 Q41 15 42 19" stroke={gender==='female'?'#818CF8':'#6366F1'} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <circle cx="42.5" cy="20.5" r="2.5" fill={gender==='female'?'#A5B4FC':'#C4B5FD'}/>
      <path d="M25 14 Q21 20 19 26" stroke={gender==='female'?'#818CF8':'#6366F1'} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="18.5" cy="27.5" rx="3" ry="2" fill={gender==='female'?'#F9A8D4':'#A5B4FC'}/>
      <path d="M35 14 Q39 20 41 26" stroke={gender==='female'?'#818CF8':'#6366F1'} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="41.5" cy="27.5" rx="3" ry="2" fill={gender==='female'?'#F9A8D4':'#A5B4FC'}/>
      <circle cx="30" cy="2" r="11" fill="url(#rkHelm)" stroke="#A78BFA" strokeWidth="1.5"/>
      <ellipse cx="25.5" cy="-4" rx="4.5" ry="3.5" fill="white" opacity="0.22" transform="rotate(-25 25.5 -4)"/>
      {gender === 'female' ? (
        <>
          <path d="M20.5 -3 Q22 -12 30 -12.5 Q38 -12 39.5 -3" fill="#7C3AED" opacity="0.9"/>
          <path d="M20.5 -3 Q17.5 2 18.5 7" fill="#7C3AED" opacity="0.85"/>
          <path d="M39.5 -3 Q42.5 2 41.5 7" fill="#7C3AED" opacity="0.85"/>
          <ellipse cx="30" cy="3.5" rx="7.5" ry="8" fill="#FDDCB5"/>
          <circle cx="26.5" cy="2" r="1.8" fill="#1E1B4B"/>
          <circle cx="33.5" cy="2" r="1.8" fill="#1E1B4B"/>
          <circle cx="27.2" cy="1.2" r="0.65" fill="white"/>
          <circle cx="34.2" cy="1.2" r="0.65" fill="white"/>
          <path d="M24.8 0 Q25.5 -1.5 26.5 0" stroke="#1E1B4B" strokeWidth="0.7" fill="none"/>
          <path d="M32.5 0 Q33.5 -1.5 34.5 0" stroke="#1E1B4B" strokeWidth="0.7" fill="none"/>
          <path d="M26.5 6.5 Q30 10 33.5 6.5" stroke="#C06020" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          <ellipse cx="24" cy="6" rx="2.2" ry="1.2" fill="#F9A8D4" opacity="0.7"/>
          <ellipse cx="36" cy="6" rx="2.2" ry="1.2" fill="#F9A8D4" opacity="0.7"/>
        </>
      ) : (
        <>
          <path d="M20.5 -3 Q22 -12 30 -12.5 Q38 -12 39.5 -3 Q37 -6.5 30 -6.5 Q23 -6.5 20.5 -3Z" fill="#2D1810" opacity="0.9"/>
          <ellipse cx="30" cy="3.5" rx="7.5" ry="8" fill="#FDDCB5"/>
          <circle cx="26.5" cy="2" r="1.9" fill="#1E1B4B"/>
          <circle cx="33.5" cy="2" r="1.9" fill="#1E1B4B"/>
          <circle cx="27.3" cy="1.1" r="0.7" fill="white"/>
          <circle cx="34.3" cy="1.1" r="0.7" fill="white"/>
          <path d="M24.5 -0.5 Q26.5 -2.5 28.5 -0.5" stroke="#2D1810" strokeWidth="1" fill="none"/>
          <path d="M31.5 -0.5 Q33.5 -2.5 35.5 -0.5" stroke="#2D1810" strokeWidth="1" fill="none"/>
          <path d="M26.5 6.5 Q30 9.5 33.5 6.5" stroke="#C06020" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </>
      )}
      <circle cx="30" cy="2" r="11" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
    </g>
  );
}

function SharedDefs() {
  return (
    <defs>
      <linearGradient id="rkBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#4338CA"/>
        <stop offset="55%"  stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#5B21B6"/>
      </linearGradient>
      <linearGradient id="rkNose" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#DDD6FE"/>
      </linearGradient>
      <linearGradient id="rkFin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#5B21B6"/>
        <stop offset="100%" stopColor="#2E1065"/>
      </linearGradient>
      <linearGradient id="rkEngine" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%"   stopColor="#FCD34D"/>
        <stop offset="100%" stopColor="#F97316"/>
      </linearGradient>
      <linearGradient id="rkFlame" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%"   stopColor="#F97316"/>
        <stop offset="55%"  stopColor="#EF4444"/>
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
      </linearGradient>
      <radialGradient id="rkHelm" cx="38%" cy="32%">
        <stop offset="0%"   stopColor="#C4B5FD" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.9"/>
      </radialGradient>
      <radialGradient id="rkWindow" cx="35%" cy="35%">
        <stop offset="0%"   stopColor="#818CF8" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.8"/>
      </radialGradient>
      <filter id="rkGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.85"/>
      </filter>
      <filter id="rkFlameGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="-4" dy="0" stdDeviation="5" floodColor="#F97316" floodOpacity="0.95"/>
      </filter>
    </defs>
  );
}

/* ─── 3D Planet ─── */
function Planet3D({ cat, size, completed, active, isSecret }) {
  const c  = CAT[cat] || CAT['Event'];
  const id = `pl_${(cat||'x').replace(/[\s]/g,'_')}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} overflow="visible" style={{ display:'block' }}>
      <defs>
        <radialGradient id={`${id}g`} cx="33%" cy="28%" r="68%">
          <stop offset="0%"   stopColor={c.p[2]}/><stop offset="50%"  stopColor={c.p[1]}/><stop offset="100%" stopColor={c.p[0]}/>
        </radialGradient>
        <radialGradient id={`${id}sh`} cx="30%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.3"/><stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${id}dk`} cx="72%" cy="75%" r="50%">
          <stop offset="0%"   stopColor="black" stopOpacity="0.55"/><stop offset="100%" stopColor="black" stopOpacity="0"/>
        </radialGradient>
        <filter id={`${id}glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation={active?9:4} floodColor={c.glow} floodOpacity={active?0.85:0.4}/>
        </filter>
        <clipPath id={`${id}clip`}><circle cx="50" cy="50" r="40"/></clipPath>
      </defs>
      {active && !completed && (
        <circle cx="50" cy="50" r="48" fill="none" stroke={c.glow} strokeWidth="1.5" opacity="0.35"
          style={{ animation:'pulseRing 2.5s ease-out infinite' }}/>
      )}
      <circle cx="50" cy="50" r="40" fill={`url(#${id}g)`} filter={`url(#${id}glow)`}
        opacity={completed?1:active?1:isSecret?0.45:0.28}/>
      <g clipPath={`url(#${id}clip)`} opacity="0.16">
        <ellipse cx="50" cy="32" rx="48" ry="9"  fill="white" transform="rotate(-15 50 32)"/>
        <ellipse cx="50" cy="55" rx="48" ry="6"  fill="black" transform="rotate(-10 50 55)"/>
        <ellipse cx="50" cy="70" rx="48" ry="7"  fill="white" transform="rotate(-5 50 70)"/>
      </g>
      <circle cx="50" cy="50" r="40" fill={`url(#${id}sh)`} clipPath={`url(#${id}clip)`}/>
      <circle cx="50" cy="50" r="40" fill={`url(#${id}dk)`} clipPath={`url(#${id}clip)`}/>
      <ellipse cx="50" cy="63" rx="57" ry="13" fill="none"
        stroke={c.p[2]} strokeWidth="5.5" opacity={completed?0.72:active?0.58:0.15}/>
      <ellipse cx="50" cy="63" rx="57" ry="13" fill="none"
        stroke={c.p[2]} strokeWidth="5.5" opacity={completed?0.72:active?0.58:0.15}
        clipPath={`url(#${id}clip)`} strokeDasharray="179 0 0 0"/>
      {completed && (
        <>
          <circle cx="50" cy="50" r="21" fill="rgba(0,0,0,0.52)"/>
          <path d="M38 50 L46 58 L64 40" stroke="#4ADE80" strokeWidth="4.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
            style={{ filter:'drop-shadow(0 0 6px #4ADE80)' }}/>
        </>
      )}
      {isSecret && !completed && (
        <>
          <circle cx="50" cy="50" r="21" fill="rgba(0,0,0,0.65)"/>
          <text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="900"
            fill="#FCD34D" style={{ filter:'drop-shadow(0 0 8px #FCD34D)' }}>?</text>
        </>
      )}
    </svg>
  );
}

const STARS = Array.from({ length: 110 }, () => ({
  x: Math.random()*100, y: Math.random()*100,
  r: Math.random()*1.7+0.25, op: Math.random()*0.65+0.1,
  d: Math.random()*5, dur: 1.8+Math.random()*3,
}));

/* ─── XP Burst ─── */
function XPBurst({ points, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:'fixed', top:'38%', left:'55%', zIndex:9999, pointerEvents:'none',
      fontFamily:F, animation:'xpBurst 2.2s cubic-bezier(0.16,1,0.3,1) forwards',
      display:'flex', flexDirection:'column', alignItems:'center',
    }}>
      <div style={{
        fontSize:62, fontWeight:900, letterSpacing:'-0.02em',
        background:'linear-gradient(135deg,#FCD34D,#F97316,#EF4444)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        filter:'drop-shadow(0 0 32px rgba(245,158,11,0.95))',
      }}>+{points}</div>
      <div style={{ fontSize:13, fontWeight:800, color:'#FCD34D', letterSpacing:'0.3em',
        textTransform:'uppercase', filter:'drop-shadow(0 0 8px rgba(245,158,11,0.8))' }}>XP EARNED</div>
    </div>
  );
}

/* ─── Proof Modal ─── */
function ProofModal({ task, onSubmit, onClose, isDark }) {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [note, setNote]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();
  const cat     = CAT[task.category] || CAT['Event'];

  const handleFile = e => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      const r = new FileReader(); r.onload = ev => setPreview(ev.target.result); r.readAsDataURL(f);
    } else setPreview('video');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    onSubmit(task, { file, note });
  };

  const bg  = isDark ? '#080614' : '#fff';
  const bdr = isDark ? '#2A2550' : '#EDE9FE';
  const tc  = isDark ? '#E8E0FF' : '#111827';
  const sc  = isDark ? '#7C6FD0' : '#6B7280';
  const ib  = isDark ? '#1A1735' : '#F5F3FF';

  return (
    <div style={{ position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,0.82)',
      backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',
      animation:'fadeIn 0.2s ease' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:420,borderRadius:28,overflow:'hidden',background:bg,
        border:`1px solid ${bdr}`,boxShadow:'0 40px 80px rgba(0,0,0,0.65)',
        animation:'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ height:5,background:`linear-gradient(90deg,${cat.p.join(',')})` }}/>
        <div style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18 }}>
            <div>
              <p style={{ fontSize:9,fontWeight:800,color:cat.dark,textTransform:'uppercase',letterSpacing:'0.2em',fontFamily:F,marginBottom:3 }}>Submit Proof</p>
              <h3 style={{ fontSize:15,fontWeight:900,color:tc,fontFamily:F,lineHeight:1.3 }}>{task.title}</h3>
            </div>
            <button onClick={onClose} style={{ width:30,height:30,borderRadius:99,border:'none',cursor:'pointer',background:ib,color:sc,display:'flex',alignItems:'center',justifyContent:'center' }}><CloseIcon/></button>
          </div>
          <div onClick={() => fileRef.current?.click()}
            style={{ border:`2px dashed ${file?cat.color:bdr}`,borderRadius:16,padding:'20px 18px',
              textAlign:'center',cursor:'pointer',background:file?`${cat.p[0]}22`:ib,
              transition:'all 0.3s',marginBottom:12 }}>
            <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:'none' }} onChange={handleFile}/>
            {preview ? (
              preview==='video'
                ? <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}><VideoIcon/><p style={{ fontSize:11,fontWeight:700,color:cat.dark,fontFamily:F }}>{file?.name}</p><p style={{ fontSize:10,color:sc,fontFamily:F }}>Click to change</p></div>
                : <div><img src={preview} alt="proof" style={{ width:'100%',maxHeight:155,objectFit:'cover',borderRadius:10 }}/><p style={{ fontSize:10,color:sc,fontFamily:F,marginTop:6 }}>Click to change</p></div>
            ) : (
              <><div style={{ marginBottom:8 }}><UploadIcon/></div>
              <p style={{ fontSize:12,fontWeight:800,color:tc,fontFamily:F,marginBottom:3 }}>Upload Photo or Video</p>
              <p style={{ fontSize:10,color:sc,fontFamily:F }}>JPG · PNG · MP4 · MOV</p></>
            )}
          </div>
          <textarea placeholder="Note for admin (optional)..." value={note} onChange={e => setNote(e.target.value)} rows={2}
            style={{ width:'100%',borderRadius:12,border:`1.5px solid ${bdr}`,background:ib,color:tc,
              fontFamily:F,fontSize:11,padding:'9px 12px',resize:'none',outline:'none',
              boxSizing:'border-box',marginBottom:14 }}/>
          <button onClick={handleSubmit} disabled={!file||submitting} style={{
            width:'100%',padding:'12px 0',borderRadius:13,border:'none',
            cursor:file&&!submitting?'pointer':'not-allowed',fontFamily:F,
            fontSize:12,fontWeight:900,color:'white',
            background:file&&!submitting?`linear-gradient(135deg,${cat.p.join(',')})`:'rgba(99,102,241,0.18)',
            boxShadow:file&&!submitting?`0 8px 24px ${cat.glow}55`:'none',
            display:'flex',alignItems:'center',justifyContent:'center',gap:7,
          }}>
            {submitting
              ? <><span style={{ width:12,height:12,border:'2px solid rgba(255,255,255,0.3)',
                  borderTopColor:'white',borderRadius:'50%',animation:'spin 0.6s linear infinite',
                  display:'inline-block' }}/> Submitting...</>
              : <><CheckIcon/> Submit for Review · +{task.points} XP</>}
          </button>
          <p style={{ fontSize:9,color:sc,fontFamily:F,textAlign:'center',marginTop:9 }}>
            Admin verifies proof before XP is awarded
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN
════════════════════════════════════════════ */
export default function Tasks() {
  const { tasks, completeTask } = useData();
  // ── Pull updateUser so we can sync AuthContext after task completion ──
  const { user, updateUser }    = useAuth();
  const navigate                = useNavigate();
  const [isDark]                = useState(() => localStorage.getItem('astraliq-theme') === 'dark');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProof, setShowProof]       = useState(false);
  const [completedIds, setCompletedIds] = useState(() =>
    (tasks||[]).filter(t => t.status==='completed').map(t => t.id)
  );
  const [pendingIds, setPendingIds] = useState([]);
  const [burst, setBurst]           = useState(null);
  const [rocketX, setRocketX]       = useState(14);
  const [rocketY, setRocketY]       = useState(12);
  const [flying, setFlying]         = useState(false);

  const gender  = user?.gender ?? 'male';
  const earnedXP = completedIds.reduce((s,id) => s + ((tasks||[]).find(t=>t.id===id)?.points??0), 0);

  const journeyTasks = [
    ...(tasks||[]).filter(t => completedIds.includes(t.id)),
    ...(tasks||[]).filter(t => !completedIds.includes(t.id) && !pendingIds.includes(t.id) && !t.isSecret),
    ...(tasks||[]).filter(t => t.isSecret && !completedIds.includes(t.id)),
  ];

  const getPlanetPos = useCallback((i) => {
    const COLS = 3;
    const row  = Math.floor(i / COLS);
    const col  = i % COLS;
    const flipped = row % 2 === 1;
    const c    = flipped ? (COLS-1-col) : col;
    const xs   = [14, 50, 86];
    return { x: xs[c], y: 10 + row * 24 };
  }, []);

  useEffect(() => {
    const lastDone = journeyTasks.reduce((acc,t,i) => completedIds.includes(t.id)?i:acc, -1);
    const idx  = Math.max(lastDone, 0);
    const pos  = getPlanetPos(idx);
    setRocketX(pos.x);
    setRocketY(pos.y);
  }, []); // eslint-disable-line

  const flyTo = useCallback(async (idx) => {
    const pos = getPlanetPos(idx);
    setFlying(true);
    setRocketX(pos.x);
    setRocketY(pos.y);
    await new Promise(r => setTimeout(r, 1100));
    setFlying(false);
  }, [getPlanetPos]);

  const handleProofSubmit = useCallback(async (task, proof) => {
    const taskIdx = journeyTasks.findIndex(jt => jt.id === task.id);
    setShowProof(false);
    setSelectedTask(null);

    await flyTo(taskIdx);
    setPendingIds(prev => [...prev, task.id]);

    setTimeout(async () => {
      // ── Pass updateUser so DataContext can sync AuthContext immediately ──
      completeTask(user?.id ?? 'a1', task.id, updateUser);
      setCompletedIds(prev => [...prev, task.id]);
      setPendingIds(prev => prev.filter(id => id !== task.id));
      setBurst({ points: task.points });

      const nextIdx = taskIdx + 1;
      if (nextIdx < journeyTasks.length) {
        await new Promise(r => setTimeout(r, 700));
        await flyTo(nextIdx);
      }
    }, 1800);
  }, [journeyTasks, flyTo, completeTask, user, updateUser]);

  const completedCount = completedIds.length;
  const activeCount    = journeyTasks.filter(jt =>
    !completedIds.includes(jt.id) && !jt.isSecret && !pendingIds.includes(jt.id)
  ).length;

  return (
    <div style={{ minHeight:'100vh', background:'#04030E', fontFamily:F }}>
      <style>{`
        @keyframes xpBurst {
          0%{opacity:0;transform:translate(-50%,-50%) scale(0.3) rotate(-8deg)}
          18%{opacity:1;transform:translate(-50%,-65%) scale(1.25) rotate(3deg)}
          65%{opacity:1;transform:translate(-50%,-90%) scale(1)}
          100%{opacity:0;transform:translate(-50%,-145%) scale(0.7)}
        }
        @keyframes twinkle {
          0%,100%{opacity:var(--sop,0.3);transform:scale(1)}
          50%{opacity:calc(var(--sop,0.3)*3.5);transform:scale(1.6)}
        }
        @keyframes rocketBob {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-7px)}
        }
        @keyframes pulseRing {
          0%{transform:scale(1);opacity:0.75}
          100%{transform:scale(2.3);opacity:0}
        }
        @keyframes trailFlow {
          0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-24}
        }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{
          from{opacity:0;transform:translateY(28px) scale(0.95)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pendingPulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>

      <AmbassadorNav isDark={isDark}/>
      {burst && <XPBurst points={burst.points} onDone={() => setBurst(null)}/>}
      {showProof && selectedTask && (
        <ProofModal task={selectedTask} onSubmit={handleProofSubmit} onClose={() => setShowProof(false)} isDark={isDark}/>
      )}

      <div style={{ marginLeft:224, display:'flex', height:'100vh', overflow:'hidden' }}>

        {/* ══ SPACE CANVAS ══ */}
        <div style={{ flex:1, position:'relative', overflow:'auto' }}>

          {/* HUD top bar */}
          <div style={{
            position:'sticky',top:0,zIndex:100,
            display:'flex',alignItems:'center',gap:10,padding:'12px 22px',
            background:'linear-gradient(180deg,rgba(4,3,14,0.98) 60%,transparent 100%)',
            backdropFilter:'blur(10px)',
          }}>
            <button onClick={() => navigate('/ambassador/dashboard')} style={{
              padding:'6px 14px',borderRadius:99,
              border:'1px solid rgba(167,139,250,0.22)',
              background:'rgba(79,70,229,0.1)',color:'#A78BFA',
              fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:F,
            }}>← Back</button>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:9,fontWeight:800,color:'#7C6FD0',textTransform:'uppercase',letterSpacing:'0.2em' }}>Mission Control</span>
              <span style={{ fontSize:17,fontWeight:900,color:'#E8E0FF',marginLeft:10 }}>Space Journey</span>
            </div>
            {[
              {label:'Conquered', value:completedCount, color:'#4ADE80'},
              {label:'Active',    value:activeCount,    color:'#A78BFA'},
              {label:'XP Earned', value:earnedXP,       color:'#FCD34D'},
            ].map((s,i) => (
              <div key={i} style={{ padding:'5px 14px',borderRadius:99,
                background:'rgba(24,20,56,0.85)',border:'1px solid rgba(167,139,250,0.1)',
                backdropFilter:'blur(8px)',textAlign:'center' }}>
                <p style={{ fontSize:8,fontWeight:800,color:s.color,textTransform:'uppercase',letterSpacing:'0.15em',fontFamily:F }}>{s.label}</p>
                <p style={{ fontSize:15,fontWeight:900,color:s.color,lineHeight:1,fontFamily:F }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Space background */}
          <div style={{
            position:'absolute',inset:0,pointerEvents:'none',
            background:'radial-gradient(ellipse at 22% 30%,rgba(79,70,229,0.08) 0%,transparent 52%), radial-gradient(ellipse at 78% 68%,rgba(219,39,119,0.06) 0%,transparent 52%), linear-gradient(180deg,#04030F 0%,#0A0818 55%,#050312 100%)',
          }}/>

          {/* Stars */}
          {STARS.map((s,i) => (
            <div key={i} style={{
              position:'absolute',left:`${s.x}%`,top:`${s.y}%`,
              width:s.r*2,height:s.r*2,borderRadius:'50%',background:'white',
              '--sop':s.op,opacity:s.op,
              animation:`twinkle ${s.dur}s ease-in-out ${s.d}s infinite`,pointerEvents:'none',
            }}/>
          ))}

          {/* Nebulae */}
          {[
            {x:'12%',y:'22%',w:260,h:170,c:'rgba(124,58,237,0.08)'},
            {x:'62%',y:'52%',w:210,h:155,c:'rgba(219,39,119,0.06)'},
            {x:'38%',y:'74%',w:240,h:165,c:'rgba(37,99,235,0.06)'},
          ].map((n,i) => (
            <div key={i} style={{ position:'absolute',left:n.x,top:n.y,width:n.w,height:n.h,
              borderRadius:'50%',background:`radial-gradient(ellipse,${n.c},transparent)`,
              pointerEvents:'none' }}/>
          ))}

          {/* Planet + Rocket SVG layer */}
          <div style={{ position:'relative', minHeight:`${Math.max(620, Math.ceil(journeyTasks.length/3)*24+18)}vh` }}>
            <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none' }}
              preserveAspectRatio="none">
              <SharedDefs/>

              {/* Connection paths */}
              {journeyTasks.map((task,i) => {
                if (i===0) return null;
                const from = getPlanetPos(i-1);
                const to   = getPlanetPos(i);
                const seg  = completedIds.includes(task.id) && completedIds.includes(journeyTasks[i-1]?.id);
                const cx   = from.x+(to.x-from.x)*0.5;
                return (
                  <g key={i}>
                    {seg && <path d={`M${from.x}% ${from.y}% C${cx}% ${from.y+3}% ${cx}% ${to.y-3}% ${to.x}% ${to.y}%`}
                      stroke="rgba(124,58,237,0.28)" strokeWidth="8" fill="none"/>}
                    <path d={`M${from.x}% ${from.y}% C${cx}% ${from.y+3}% ${cx}% ${to.y-3}% ${to.x}% ${to.y}%`}
                      stroke={seg?'#7C3AED':'rgba(255,255,255,0.055)'} strokeWidth={seg?2:1.5}
                      strokeDasharray={seg?'8 4':'3 8'} fill="none"
                      style={seg?{animation:'trailFlow 1.5s linear infinite'}:{}}/>
                  </g>
                );
              })}

              {/* Rocket */}
              <g style={{
                transition: flying ? 'transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none',
                transform: `translate(calc(${rocketX}% - 30px), calc(${rocketY}% - 50px))`,
              }}>
                <g style={{ animation: flying ? 'none' : 'rocketBob 3s ease-in-out infinite' }}
                  filter="url(#rkGlow)">
                  <AstronautOnRocket gender={gender} xp={earnedXP}/>
                </g>
              </g>
            </svg>

            {/* Planet divs */}
            {journeyTasks.map((task,i) => {
              const pos       = getPlanetPos(i);
              const cat       = CAT[task.category] || CAT['Event'];
              const isDone    = completedIds.includes(task.id);
              const isPending = pendingIds.includes(task.id);
              const isActive  = !isDone && !isPending && !task.isSecret;
              const isSel     = selectedTask?.id === task.id;
              const sz        = isDone?82:isActive?92:isPending?78:60;

              return (
                <div key={task.id} style={{
                  position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`,
                  transform:'translate(-50%,-50%)',
                  zIndex:isSel?20:8, cursor:isActive?'pointer':'default',
                }} onClick={() => isActive && setSelectedTask(isSel?null:task)}>

                  {isPending && (
                    <div style={{
                      position:'absolute',top:-34,left:'50%',transform:'translateX(-50%)',
                      padding:'3px 10px',borderRadius:99,
                      background:'rgba(252,211,77,0.12)',border:'1px solid #FCD34D',
                      fontSize:9,fontWeight:800,color:'#FCD34D',fontFamily:F,
                      animation:'pendingPulse 1.5s ease-in-out infinite',whiteSpace:'nowrap',
                    }}>Pending Review</div>
                  )}

                  <Planet3D cat={task.isSecret?'Secret':task.category} size={sz}
                    completed={isDone} active={isActive} isSecret={task.isSecret&&!isPending}/>

                  <div style={{ position:'absolute',top:`calc(100% + 10px)`,left:'50%',
                    transform:'translateX(-50%)',textAlign:'center',width:104,pointerEvents:'none' }}>
                    <p style={{ fontSize:10,fontWeight:800,fontFamily:F,lineHeight:1.3,
                      color:isDone?'#4ADE80':isPending?'#FCD34D':isActive?'rgba(255,255,255,0.92)':'rgba(255,255,255,0.25)',
                      textShadow:isActive?'0 1px 12px rgba(0,0,0,1)':'none' }}>
                      {task.isSecret?'???':task.title.length>20?task.title.slice(0,20)+'…':task.title}
                    </p>
                    <p style={{ fontSize:9,fontWeight:900,fontFamily:F,marginTop:2,
                      color:isDone?'#4ADE80':isPending?'#FCD34D':(cat.dark??cat.color) }}>
                      {isDone?'Done':isPending?'In Review':`+${task.points} XP`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{
          width:282,flexShrink:0,height:'100vh',overflowY:'auto',
          background:'rgba(5,3,16,0.97)',
          borderLeft:'1px solid rgba(124,58,237,0.09)',
          display:'flex',flexDirection:'column',
        }}>
          <div style={{ padding:'18px 17px 12px',borderBottom:'1px solid rgba(124,58,237,0.07)' }}>
            <p style={{ fontSize:9,fontWeight:800,color:'#6D5ED6',textTransform:'uppercase',letterSpacing:'0.2em',fontFamily:F,marginBottom:2 }}>Missions</p>
            <p style={{ fontSize:15,fontWeight:900,color:'#E8E0FF',fontFamily:F }}>All Tasks</p>
          </div>

          <div style={{ flex:1,overflowY:'auto',padding:'10px 11px',display:'flex',flexDirection:'column',gap:7 }}>
            {journeyTasks.map(task => {
              const cat       = CAT[task.category]||CAT['Event'];
              const isDone    = completedIds.includes(task.id);
              const isPending = pendingIds.includes(task.id);
              const isActive  = !isDone && !isPending && !task.isSecret;
              const isSel     = selectedTask?.id===task.id;
              return (
                <div key={task.id}
                  onClick={() => isActive && setSelectedTask(isSel?null:task)}
                  style={{
                    display:'flex',alignItems:'center',gap:9,
                    padding:'9px 11px',borderRadius:13,
                    cursor:isActive?'pointer':'default',
                    background:isSel?`${cat.p[0]}44`:isDone?'rgba(74,222,128,0.05)':isPending?'rgba(252,211,77,0.05)':'rgba(255,255,255,0.022)',
                    border:`1px solid ${isSel?cat.glow+'44':'rgba(255,255,255,0.038)'}`,
                    transition:'all 0.18s',
                    opacity:task.isSecret&&!isDone&&!isPending?0.42:1,
                  }}
                  onMouseEnter={e => { if(isActive) e.currentTarget.style.background=`${cat.p[0]}28`; }}
                  onMouseLeave={e => { if(isActive) e.currentTarget.style.background=isSel?`${cat.p[0]}44`:'rgba(255,255,255,0.022)'; }}
                >
                  <div style={{ width:27,height:27,borderRadius:8,flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    background:isDone?'rgba(74,222,128,0.13)':isPending?'rgba(252,211,77,0.09)':`${cat.p[0]}44`,
                    color:isDone?'#4ADE80':isPending?'#FCD34D':(cat.dark??cat.color) }}>
                    {isDone?<CheckIcon/>:isPending?'⏳':task.isSecret?<LockIcon/>:cat.icon}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ fontSize:11,fontWeight:800,fontFamily:F,
                      color:isDone?'#4ADE80':isPending?'#FCD34D':'#E8E0FF',
                      whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>
                      {task.isSecret?'Secret Mission':task.title}
                    </p>
                    <p style={{ fontSize:9,fontWeight:600,color:isDone?'#4ADE80':isPending?'#FCD34D':'#6D5ED6',fontFamily:F }}>
                      {isDone?'Completed':isPending?'Pending review':`+${task.points} XP`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected task detail */}
          {selectedTask && (() => {
            const cat = CAT[selectedTask.category]||CAT['Event'];
            return (
              <div style={{ borderTop:'1px solid rgba(124,58,237,0.09)',padding:'14px 14px 18px',
                background:'rgba(18,14,44,0.75)',animation:'slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <div style={{ height:3,borderRadius:99,background:`linear-gradient(90deg,${cat.p.join(',')})`,marginBottom:10 }}/>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6 }}>
                  <p style={{ fontSize:12,fontWeight:900,color:'#E8E0FF',fontFamily:F,lineHeight:1.3,flex:1 }}>{selectedTask.title}</p>
                  <button onClick={() => setSelectedTask(null)} style={{ width:24,height:24,borderRadius:99,
                    border:'none',cursor:'pointer',background:'rgba(124,58,237,0.14)',color:'#7C6FD0',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:8 }}>
                    <CloseIcon/>
                  </button>
                </div>
                <p style={{ fontSize:10,color:'#6D5ED6',fontFamily:F,lineHeight:1.6,marginBottom:10 }}>
                  {(selectedTask.description||'').slice(0,90)}{(selectedTask.description||'').length>90?'…':''}
                </p>
                <div style={{ display:'flex',gap:6,marginBottom:11 }}>
                  <span style={{ padding:'3px 9px',borderRadius:99,fontSize:9,fontWeight:800,fontFamily:F,
                    background:'rgba(252,211,77,0.09)',color:'#FCD34D' }}>+{selectedTask.points} XP</span>
                  <span style={{ padding:'3px 9px',borderRadius:99,fontSize:9,fontWeight:800,fontFamily:F,
                    background:'rgba(124,58,237,0.09)',color:'#A78BFA' }}>Due {selectedTask.deadline}</span>
                </div>
                <button onClick={() => setShowProof(true)} style={{
                  width:'100%',padding:'11px 0',borderRadius:12,border:'none',cursor:'pointer',
                  fontFamily:F,fontSize:12,fontWeight:900,color:'white',
                  background:`linear-gradient(135deg,${cat.p.join(',')})`,
                  boxShadow:`0 6px 20px ${cat.glow}55`,
                  display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                }}>
                  <UploadIcon/> Upload Proof
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}