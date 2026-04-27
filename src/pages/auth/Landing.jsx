import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useRef, useCallback } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #0D0B1A;
    --surface:      rgba(255,255,255,0.03);
    --border:       rgba(196,181,253,0.1);
    --text-primary: #E8E0FF;
    --text-sec:     #7C6FD0;
    --text-muted:   #4B4280;
    --accent:       #4F46E5;
    --accent2:      #7C3AED;
    --accent-light: #C4B5FD;
    --nav-bg:       rgba(13,11,26,0.88);
    --card-bg:      rgba(255,255,255,0.03);
    --blob1:        rgba(79,70,229,0.13);
    --blob2:        rgba(124,58,237,0.10);
    --pill-bg:      rgba(79,70,229,0.12);
    --pill-color:   #818CF8;
  }
  .light {
    --bg:           #F0EEFF;
    --surface:      rgba(255,255,255,0.9);
    --border:       rgba(79,70,229,0.12);
    --text-primary: #1A1340;
    --text-sec:     #4F46E5;
    --text-muted:   #7C6FD0;
    --accent:       #4F46E5;
    --accent2:      #7C3AED;
    --accent-light: #4F46E5;
    --nav-bg:       rgba(240,238,255,0.92);
    --card-bg:      rgba(255,255,255,0.85);
    --blob1:        rgba(79,70,229,0.07);
    --blob2:        rgba(124,58,237,0.05);
    --pill-bg:      rgba(79,70,229,0.08);
    --pill-color:   #4F46E5;
  }

  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes drift {
    0%,100% { transform:translateY(0) translateX(0); opacity:.45; }
    33%      { transform:translateY(-18px) translateX(8px); opacity:.85; }
    66%      { transform:translateY(-8px) translateX(-6px); opacity:.5; }
  }
  @keyframes pulse-ring {
    0%,100% { transform:scale(.95); opacity:.6; }
    50%      { transform:scale(1.08); opacity:.2; }
  }
  @keyframes spin-slow     { to { transform:rotate(360deg);  } }
  @keyframes spin-slow-rev { to { transform:rotate(-360deg); } }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(40px) scale(.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%,100% { transform:translateY(0) rotate(0deg); }
    50%      { transform:translateY(-14px) rotate(2deg); }
  }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.2; } }
  @keyframes scan {
    0%   { top:0%;   opacity:0; }
    10%  { opacity:.5; }
    90%  { opacity:.5; }
    100% { top:100%; opacity:0; }
  }
  @keyframes tilt3d {
    0%,100% { transform:perspective(900px) rotateY(0deg) rotateX(0deg); }
    25%      { transform:perspective(900px) rotateY(4deg) rotateX(-2deg); }
    75%      { transform:perspective(900px) rotateY(-4deg) rotateX(2deg); }
  }
  @keyframes slideRight {
    from { opacity:0; transform:translateX(80px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes mascot-float {
    0%,100% { transform:translateY(0) rotate(-1deg); }
    50%      { transform:translateY(-18px) rotate(1deg); }
  }
  @keyframes mascot-talking {
    0%,100% { transform:translateY(0) scale(1); }
    50%      { transform:translateY(-4px) scale(1.02); }
  }
  @keyframes bubble-pop {
    from { transform:scale(.4) translateY(20px); opacity:0; }
    to   { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes typing-dot {
    0%,80%,100% { transform:scale(.55); opacity:.35; }
    40%          { transform:scale(1); opacity:1; }
  }
  @keyframes glow-pulse {
    0%,100% { opacity:.5; transform:scale(1); }
    50%      { opacity:1; transform:scale(1.15); }
  }
  @keyframes nova-intro {
    from { opacity:0; transform:translateY(60px) scale(.8); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .sr { opacity:0; transform:translateY(36px); transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
  .sr.vis { opacity:1; transform:none; }

  .fu1 { animation:fadeUp .8s cubic-bezier(.16,1,.3,1) .10s both; }
  .fu2 { animation:fadeUp .8s cubic-bezier(.16,1,.3,1) .25s both; }
  .fu3 { animation:fadeUp .8s cubic-bezier(.16,1,.3,1) .40s both; }
  .fu4 { animation:fadeUp .8s cubic-bezier(.16,1,.3,1) .55s both; }
  .fu5 { animation:fadeUp .8s cubic-bezier(.16,1,.3,1) .70s both; }

  .theme-tx, .theme-tx * {
    transition:
      background .45s cubic-bezier(.4,0,.2,1),
      background-color .45s cubic-bezier(.4,0,.2,1),
      border-color .45s cubic-bezier(.4,0,.2,1),
      color .45s cubic-bezier(.4,0,.2,1),
      box-shadow .45s cubic-bezier(.4,0,.2,1) !important;
  }

  .btn-p {
    padding:14px 36px; border-radius:14px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800;
    letter-spacing:.05em; text-transform:uppercase;
    background:linear-gradient(135deg,#4F46E5,#7C3AED); color:#fff;
    box-shadow:0 8px 32px rgba(79,70,229,.45),inset 0 1px 0 rgba(255,255,255,.14);
    transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s;
  }
  .btn-p:hover  { transform:translateY(-3px) scale(1.03); box-shadow:0 16px 48px rgba(79,70,229,.6); }
  .btn-p:active { transform:translateY(-1px) scale(.99); }

  .btn-s {
    padding:14px 36px; border-radius:14px; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800;
    letter-spacing:.05em; text-transform:uppercase;
    background:transparent; border:1.5px solid var(--border); color:var(--accent-light);
    transition:all .3s cubic-bezier(.16,1,.3,1); backdrop-filter:blur(8px);
  }
  .btn-s:hover  { border-color:var(--accent-light); background:rgba(196,181,253,.07); transform:translateY(-3px) scale(1.02); }
  .btn-s:active { transform:translateY(-1px) scale(.99); }

  .btn-ghost {
    background:none; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:500;
    color:var(--text-muted); padding:0;
    text-decoration:underline; text-underline-offset:4px; text-decoration-color:transparent;
    transition:color .2s,transform .2s;
  }
  .btn-ghost:hover { color:var(--text-sec); text-decoration-color:var(--text-sec); transform:translateY(-1px); }

  .nav-link {
    font-size:13px; font-weight:600; color:var(--text-sec); cursor:pointer;
    letter-spacing:.03em; background:none; border:none; padding:0;
    font-family:'Plus Jakarta Sans',sans-serif; transition:color .2s,transform .2s;
  }
  .nav-link:hover { color:var(--accent-light); transform:translateY(-1px); }

  .fcard {
    background:var(--card-bg); border:1.5px solid var(--border); border-radius:24px;
    padding:32px 28px; transition:all .4s cubic-bezier(.16,1,.3,1);
    position:relative; overflow:hidden; transform-style:preserve-3d;
  }
  .fcard::before {
    content:''; position:absolute; inset:0; border-radius:24px;
    background:linear-gradient(135deg,rgba(79,70,229,.08),transparent);
    opacity:0; transition:opacity .4s;
  }
  .fcard:hover { border-color:rgba(196,181,253,.3); transform:translateY(-8px) perspective(600px) rotateX(2deg); box-shadow:0 24px 60px rgba(79,70,229,.2); }
  .fcard:hover::before { opacity:1; }

  .stat-n {
    font-family:'Plus Jakarta Sans',sans-serif; font-size:42px; font-weight:800;
    background:linear-gradient(135deg,var(--accent-light),var(--pill-color));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; line-height:1;
  }

  .choice {
    flex:1; padding:12px 10px; border-radius:12px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:800;
    letter-spacing:.05em; text-transform:uppercase;
    transition:all .25s cubic-bezier(.16,1,.3,1);
  }
  .choice:hover { transform:translateY(-3px) scale(1.05); }
`;

// ── Stars ───────────────────────────────────────────────────────
const Stars = ({ show }) => {
  if (!show) return null;
  const s = Array.from({ length: 90 }, (_, i) => ({
    id:i, x:(i*37.7)%100, y:(i*53.3)%100,
    r:(i%3)*.6+.3, delay:i%6, dur:(i%4)+4,
  }));
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }}>
      {s.map(p => (
        <circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill="white"
          style={{ animation:`drift ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </svg>
  );
};

// ── Orbital ─────────────────────────────────────────────────────
const Orbital = () => (
  <div style={{ position:'relative',width:300,height:300,flexShrink:0,animation:'tilt3d 8s ease-in-out infinite' }}>
    <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:'1px solid rgba(196,181,253,.12)',animation:'spin-slow 30s linear infinite' }}>
      <div style={{ position:'absolute',top:-5,left:'50%',transform:'translateX(-50%)',width:10,height:10,borderRadius:'50%',background:'#818CF8',boxShadow:'0 0 18px #818CF8,0 0 36px rgba(129,140,248,.4)' }} />
    </div>
    <div style={{ position:'absolute',inset:30,borderRadius:'50%',border:'1px solid rgba(124,58,237,.2)',animation:'spin-slow-rev 20s linear infinite' }}>
      <div style={{ position:'absolute',bottom:-4,left:'50%',transform:'translateX(-50%)',width:7,height:7,borderRadius:'50%',background:'#7C3AED',boxShadow:'0 0 14px #7C3AED' }} />
      <div style={{ position:'absolute',top:'50%',right:-4,transform:'translateY(-50%)',width:6,height:6,borderRadius:'50%',background:'#C4B5FD',boxShadow:'0 0 10px #C4B5FD' }} />
    </div>
    <div style={{ position:'absolute',inset:65,borderRadius:'50%',border:'1px solid rgba(196,181,253,.18)',animation:'spin-slow 12s linear infinite' }}>
      <div style={{ position:'absolute',top:-3,left:'30%',width:6,height:6,borderRadius:'50%',background:'#4F46E5',boxShadow:'0 0 10px #4F46E5' }} />
    </div>
    <div style={{ position:'absolute',inset:92,borderRadius:'50%',background:'radial-gradient(circle,rgba(79,70,229,.35),rgba(124,58,237,.15))',animation:'pulse-ring 3s ease-in-out infinite' }} />
    <div style={{ position:'absolute',inset:100,borderRadius:'50%',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',boxShadow:'0 0 70px rgba(79,70,229,.7),0 0 130px rgba(124,58,237,.4)',display:'flex',alignItems:'center',justifyContent:'center',animation:'float 4s ease-in-out infinite' }}>
      <svg viewBox="0 0 40 40" fill="none" style={{ width:44,height:44 }}>
        <path d="M20 4L22.5 15H34L24.75 22L27.5 33L20 26L12.5 33L15.25 22L6 15H17.5L20 4Z" fill="white" opacity=".95"/>
      </svg>
    </div>
    <div style={{ position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden',pointerEvents:'none' }}>
      <div style={{ position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(196,181,253,.55),transparent)',animation:'scan 4s ease-in-out infinite' }} />
    </div>
  </div>
);

// ── TALKING MASCOT SVG ───────────────────────────────────────────
const TalkingMascot = ({ size = 160, isDark = true, lipFrame = false, isTalking = false }) => {
  // Very subtle mouth movement — small natural open/close, not wide shocked
  const jawY      = isTalking ? (lipFrame ? 2   : 0.5) : 0;
  const mouthOpen = isTalking ? (lipFrame ? 2.5 : 0.8) : 0;
  const lipTopY1  = 44 - (isTalking ? (lipFrame ? 0.5 : 0) : 0);
  const lipBotY1  = 46 + jawY;
  const lipBotCY  = lipBotY1 + mouthOpen;

  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{
        width: size, height: size,
        filter: `drop-shadow(0 12px 32px rgba(124,58,237,${isTalking ? .85 : .5}))`,
        transition: 'filter .1s',
      }}>

      {/* Body layers */}
      <ellipse cx="40" cy="48" rx="22" ry="20" fill={isDark?'#3B1F6E':'#7C3AED'}/>
      <ellipse cx="40" cy="46" rx="19" ry="17" fill={isDark?'#5B2D9E':'#8B5CF6'}/>
      <ellipse cx="40" cy="38" rx="16" ry="15" fill={isDark?'#7C3AED':'#A78BFA'}/>

      {/* Ears */}
      <ellipse cx="24" cy="28" rx="5" ry="7" fill={isDark?'#3B1F6E':'#7C3AED'} transform="rotate(-15 24 28)"/>
      <ellipse cx="56" cy="28" rx="5" ry="7" fill={isDark?'#3B1F6E':'#7C3AED'} transform="rotate(15 56 28)"/>
      <ellipse cx="24" cy="28" rx="3" ry="5" fill={isTalking?'#E879F9':'#C4B5FD'} transform="rotate(-15 24 28)" style={{transition:'fill .1s'}}/>
      <ellipse cx="56" cy="28" rx="3" ry="5" fill={isTalking?'#E879F9':'#C4B5FD'} transform="rotate(15 56 28)" style={{transition:'fill .1s'}}/>

      {/* Crown star */}
      <path d="M40 22 L41.5 26 L46 26 L42.5 28.5 L44 33 L40 30 L36 33 L37.5 28.5 L34 26 L38.5 26 Z"
        fill={isTalking?'#F97316':'#FCD34D'} style={{transition:'fill .15s'}}/>

      {/* Eyes */}
      <ellipse cx="34" cy="36" rx="4" ry="4.5" fill="white"/>
      <ellipse cx="46" cy="36" rx="4" ry="4.5" fill="white"/>
      <circle cx="35" cy="37" r={isTalking ? 3 : 2.5} fill="#1E1B4B" style={{transition:'all .1s'}}/>
      <circle cx="47" cy="37" r={isTalking ? 3 : 2.5} fill="#1E1B4B" style={{transition:'all .1s'}}/>
      <circle cx="36" cy="36" r="1" fill="white"/>
      <circle cx="48" cy="36" r="1" fill="white"/>

      {/* Blush */}
      <ellipse cx="30" cy="42" rx="4" ry="2.5" fill="#F9A8D4" opacity={isTalking?.95:.65}/>
      <ellipse cx="50" cy="42" rx="4" ry="2.5" fill="#F9A8D4" opacity={isTalking?.95:.65}/>

      {/* Mouth cavity — tiny and subtle */}
      {isTalking && (
        <ellipse cx="40" cy={45 + jawY/2} rx={3.5 + mouthOpen*.2} ry={mouthOpen*.4 + 0.5}
          fill="#0D0020" style={{transition:'all .08s ease-in-out'}}/>
      )}
      {/* Upper lip */}
      <path d={`M33 ${lipTopY1} Q40 ${lipTopY1 - (isTalking?(lipFrame?3:1):0)} 47 ${lipTopY1}`}
        stroke={isTalking?'#9333EA':'#1E1B4B'} strokeWidth="1.8" strokeLinecap="round" fill="none"
        style={{transition:'stroke .1s'}}/>
      {/* Lower lip / jaw */}
      <path d={`M33 ${lipBotY1} Q40 ${lipBotCY} 47 ${lipBotY1}`}
        stroke={isTalking?'#9333EA':'#1E1B4B'} strokeWidth="1.8" strokeLinecap="round" fill="none"
        style={{transition:'stroke .1s'}}/>

      {/* Paws */}
      <ellipse cx="18" cy="50" rx="5" ry="8" fill={isDark?'#5B2D9E':'#8B5CF6'} transform="rotate(20 18 50)"/>
      <ellipse cx="62" cy="50" rx="5" ry="8" fill={isDark?'#5B2D9E':'#8B5CF6'} transform="rotate(-20 62 50)"/>
      {/* Belly */}
      <ellipse cx="40" cy="52" rx="12" ry="10" fill="#C4B5FD" opacity=".5"/>

      {/* Sound waves */}
      {isTalking && (
        <>
          <path d="M55 32 Q58 36 55 40" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".7"
            style={{animation:'glow-pulse .4s ease-in-out infinite'}}/>
          <path d="M58 29 Q63 36 58 43" stroke="#818CF8" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".4"
            style={{animation:'glow-pulse .4s ease-in-out .12s infinite'}}/>
          <path d="M25 32 Q22 36 25 40" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".7"
            style={{animation:'glow-pulse .4s ease-in-out .06s infinite'}}/>
          <path d="M22 29 Q17 36 22 43" stroke="#818CF8" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".4"
            style={{animation:'glow-pulse .4s ease-in-out .18s infinite'}}/>
        </>
      )}
    </svg>
  );
};

// ── Typing dots ─────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display:'flex',gap:5,alignItems:'center',padding:'6px 0' }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width:7,height:7,borderRadius:'50%',background:'#7C3AED',
        animation:`typing-dot 1.2s ease-in-out ${i*.2}s infinite` }} />
    ))}
  </div>
);

// ── Theme Toggle ─────────────────────────────────────────────────
const ThemeToggle = ({ isDark, onToggle }) => (
  <button onClick={onToggle}
    style={{ width:58,height:30,borderRadius:15,border:'1.5px solid rgba(196,181,253,.2)',
      background:isDark?'rgba(79,70,229,.28)':'rgba(245,158,11,.18)',
      cursor:'pointer',position:'relative',flexShrink:0,
      transition:'all .4s cubic-bezier(.16,1,.3,1)',
      boxShadow:isDark?'0 0 14px rgba(79,70,229,.3)':'0 0 14px rgba(251,191,36,.35)' }}>
    <div style={{ position:'absolute',top:4,
      left:isDark?4:28, width:20,height:20,borderRadius:'50%',
      background:isDark?'linear-gradient(135deg,#818CF8,#4F46E5)':'linear-gradient(135deg,#FCD34D,#F97316)',
      transition:'left .4s cubic-bezier(.16,1,.3,1)',
      display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,
      boxShadow:isDark?'0 2px 8px rgba(79,70,229,.5)':'0 2px 8px rgba(251,191,36,.5)' }}>
      {isDark?'🌙':'☀️'}
    </div>
  </button>
);

// ── MASCOT WIDGET ────────────────────────────────────────────────
const MascotWidget = ({ isDark, onNavigate }) => {
  const [open,      setOpen]      = useState(false);
  const [phase,     setPhase]     = useState('idle');
  const [message,   setMessage]   = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [lipFrame,  setLipFrame]  = useState(false);
  const [minimized, setMinimized] = useState(false);
  const lipInterval    = useRef(null);
  const hasAutoStarted = useRef(false);
  const F = "'Plus Jakarta Sans', sans-serif";

  // Lip oscillation
  useEffect(() => {
    if (isTalking) {
      lipInterval.current = setInterval(() => setLipFrame(p => !p), 180);
    } else {
      clearInterval(lipInterval.current);
      setLipFrame(false);
    }
    return () => clearInterval(lipInterval.current);
  }, [isTalking]);

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.88; u.pitch = 1.25; u.volume = 1;

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const fem = voices.find(v => /samantha|karen|victoria|zira|female|google uk english female/i.test(v.name))
                  || voices.find(v => v.lang.startsWith('en'));
      if (fem) u.voice = fem;
      u.onstart = () => setIsTalking(true);
      u.onend   = () => { setIsTalking(false); onEnd?.(); };
      u.onerror = () => { setIsTalking(false); onEnd?.(); };
      window.speechSynthesis.speak(u);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { trySpeak(); window.speechSynthesis.onvoiceschanged = null; };
    } else {
      trySpeak();
    }
  }, []);

  const startGreeting = useCallback(() => {
    if (hasAutoStarted.current) return;
    hasAutoStarted.current = true;
    setOpen(true);
    setMinimized(false);
    setPhase('typing');
    setMessage('');
    setTimeout(() => {
      const msg = "Hey! Welcome to AstralIQ! I'm Nova, your AI guide. Are you joining as an Ambassador, or are you here as an Organization?";
      setPhase('asking');
      setMessage(msg);
      speak(msg);
    }, 900);
  }, [speak]);

  // Auto-start after 1.8s on mount
  useEffect(() => {
    const t = setTimeout(startGreeting, 1800);
    return () => clearTimeout(t);
  }, [startGreeting]);

  const handleChoice = (type) => {
    window.speechSynthesis?.cancel();
    setIsTalking(false);
    setPhase('typing');
    setMessage('');
    const msgs = {
      ambassador:   "Amazing! You're about to earn XP, unlock legendary badges, and climb the leaderboard. Let's get you started — your journey begins now!",
      organization: "Welcome! AstralIQ gives your team real-time ambassador visibility, automated workflows, and AI-powered analytics. Let's go!",
    };
    setTimeout(() => {
      setPhase('greeted');
      setMessage(msgs[type]);
      speak(msgs[type], () => {
        setTimeout(() => onNavigate(type === 'ambassador' ? '/ambassador/login' : '/admin/login'), 600);
      });
    }, 700);
  };

  const close = () => {
    window.speechSynthesis?.cancel();
    setIsTalking(false);
    setOpen(false);
    setMinimized(true);
    setPhase('idle');
    setMessage('');
  };

  const reopen = () => {
    setMinimized(false);
    setOpen(true);
    setPhase('typing');
    setMessage('');
    setTimeout(() => {
      const msg = "Hey again! Are you joining as an Ambassador, or are you an Organization?";
      setPhase('asking');
      setMessage(msg);
      speak(msg);
    }, 700);
  };

  return (
    <div style={{ position:'fixed', bottom:20, right:20, zIndex:9999,
      display:'flex', flexDirection:'column', alignItems:'flex-end', gap:14,
      animation:'nova-intro .8s cubic-bezier(.16,1,.3,1) 1.2s both' }}>

      {/* Speech bubble */}
      {open && !minimized && (
        <div style={{
          background: isDark ? 'rgba(10,7,30,.97)' : 'rgba(255,255,255,.98)',
          border: `1.5px solid ${isDark ? 'rgba(196,181,253,.3)' : 'rgba(79,70,229,.22)'}`,
          borderRadius:24, padding:'20px 22px', maxWidth:320, minWidth:270,
          backdropFilter:'blur(28px)',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(79,70,229,.25)'
            : '0 32px 80px rgba(79,70,229,.2), 0 4px 24px rgba(0,0,0,.08)',
          animation:'bubble-pop .4s cubic-bezier(.16,1,.3,1) both',
          position:'relative',
        }}>
          {/* Close button */}
          <button onClick={close} style={{ position:'absolute',top:12,right:16,
            background:'none',border:'none',cursor:'pointer',
            color:isDark?'#7C6FD0':'#9CA3AF',fontSize:20,lineHeight:1,
            padding:0,fontWeight:300,transition:'color .2s' }}
            onMouseEnter={e => e.target.style.color='#EF4444'}
            onMouseLeave={e => e.target.style.color=isDark?'#7C6FD0':'#9CA3AF'}>×</button>

          {/* Header */}
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
            <div style={{ width:8,height:8,borderRadius:'50%',
              background: isTalking ? '#22C55E' : '#7C3AED',
              boxShadow: isTalking ? '0 0 12px #22C55E' : '0 0 8px #7C3AED',
              transition:'all .2s',
              animation: isTalking ? 'blink .5s ease-in-out infinite' : 'none' }} />
            <p style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#7C3AED',
              letterSpacing:'.14em',textTransform:'uppercase' }}>
              Nova — AI Guide {isTalking ? '🔊' : ''}
            </p>
          </div>

          {phase === 'typing' && <TypingDots />}

          {(phase === 'asking' || phase === 'greeted') && (
            <p style={{ fontFamily:F,fontSize:14,fontWeight:500,lineHeight:1.7,
              color:isDark?'#C4B5FD':'#1A1340',
              marginBottom:phase==='asking'?16:0 }}>
              {message}
            </p>
          )}

          {phase === 'asking' && (
            <div style={{ display:'flex',gap:10 }}>
              <button className="choice" onClick={() => handleChoice('ambassador')}
                style={{ background:'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',
                  boxShadow:'0 4px 18px rgba(79,70,229,.55)',flex:1 }}>
                Ambassador
              </button>
              <button className="choice" onClick={() => handleChoice('organization')}
                style={{ flex:1,
                  background:isDark?'rgba(196,181,253,.1)':'rgba(79,70,229,.07)',
                  color:isDark?'#C4B5FD':'#4F46E5',
                  border:`1.5px solid ${isDark?'rgba(196,181,253,.25)':'rgba(79,70,229,.22)'}` }}>
                Organization
              </button>
            </div>
          )}

          {/* Bubble tail */}
          <div style={{ position:'absolute',bottom:-10,right:66,width:18,height:18,
            transform:'rotate(45deg)',
            background:isDark?'rgba(10,7,30,.97)':'rgba(255,255,255,.98)',
            borderRight:`1.5px solid ${isDark?'rgba(196,181,253,.3)':'rgba(79,70,229,.22)'}`,
            borderBottom:`1.5px solid ${isDark?'rgba(196,181,253,.3)':'rgba(79,70,229,.22)'}` }} />
        </div>
      )}

      {/* ── NOVA — ALWAYS VISIBLE, BIG ── */}
      <div
        style={{ position:'relative', cursor: minimized ? 'pointer' : 'default' }}
        onClick={minimized ? reopen : undefined}
        title={minimized ? 'Chat with Nova' : undefined}>

        {/* Ground glow */}
        <div style={{ position:'absolute',bottom:-14,left:'50%',transform:'translateX(-50%)',
          width:130,height:28,borderRadius:'50%',
          background:'radial-gradient(ellipse,rgba(124,58,237,.55),transparent 70%)',
          filter:'blur(10px)',animation:'pulse-ring 2.8s ease-in-out infinite',
          pointerEvents:'none' }} />

        {/* Outer talking rings */}
        {isTalking && (
          <>
            <div style={{ position:'absolute',inset:-18,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(124,58,237,.4),transparent 65%)',
              animation:'pulse-ring .5s ease-in-out infinite',pointerEvents:'none' }} />
            <div style={{ position:'absolute',inset:-34,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(79,70,229,.18),transparent 60%)',
              animation:'pulse-ring .5s ease-in-out .15s infinite',pointerEvents:'none' }} />
          </>
        )}

        {/* The mascot — big and proud */}
        <div style={{
          animation: isTalking ? 'none' : 'mascot-float 3.2s ease-in-out infinite'
        }}>
          <TalkingMascot size={160} isDark={isDark} lipFrame={lipFrame} isTalking={isTalking} />
        </div>

        {/* Ping dot when minimized */}
        {minimized && (
          <div style={{ position:'absolute',top:10,right:10,width:18,height:18,borderRadius:'50%',
            background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
            boxShadow:'0 0 16px rgba(79,70,229,.95)',animation:'blink 1.8s ease-in-out infinite' }} />
        )}

        {/* "Tap Nova" hint */}
        {minimized && (
          <div style={{ position:'absolute',bottom:-30,left:'50%',transform:'translateX(-50%)',
            whiteSpace:'nowrap',fontFamily:F,fontSize:11,fontWeight:700,
            color:isDark?'#7C6FD0':'#7C3AED',letterSpacing:'.04em',
            animation:'blink 2.5s ease-in-out infinite' }}>
            Tap Nova
          </div>
        )}
      </div>
    </div>
  );
};

// ── StepMark ────────────────────────────────────────────────────
const StepMark = ({ n }) => (
  <div style={{ width:38,height:38,borderRadius:11,flexShrink:0,
    background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
    display:'flex',alignItems:'center',justifyContent:'center',
    boxShadow:'0 4px 16px rgba(79,70,229,.42)',
    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:'white' }}>{n}</div>
);

// ── Scroll Reveal Hook ────────────────────────────────────────────
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.sr');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold:.14 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

// ══════════════════════════════════════════════════════════════
export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDark,    setIsDark]    = useState(true);
  const [themeAnim, setThemeAnim] = useState(false);
  useScrollReveal();

  useEffect(() => {
    if (user?.role === 'ambassador') navigate('/ambassador/dashboard');
    if (user?.role === 'admin')      navigate('/admin/dashboard');
  }, [user]);

  const toggleTheme = () => {
    setThemeAnim(true);
    setTimeout(() => { setIsDark(p => !p); setThemeAnim(false); }, 200);
  };

  const enterDemo = () => {
    localStorage.setItem('astraliq_user', JSON.stringify({
      id:'a1', role:'ambassador', name:'Priya Sharma', college:'Mumbai University',
      email:'demo@astraliq.com', points:1240, level:'Gold', streak:7,
      badges:['newcomer','first_task','on_fire','century'], tasksCompleted:14, isDemo:true,
    }));
    navigate('/ambassador/dashboard');
  };

  const F = "'Plus Jakarta Sans', sans-serif";

  return (
    <>
      <style>{STYLES}</style>
      <div className={`${isDark?'':'light'} ${themeAnim?'theme-tx':''}`}
        style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text-primary)',
          fontFamily:F, overflowX:'hidden', position:'relative',
          transition:'background .5s cubic-bezier(.4,0,.2,1)' }}>

        {/* Blobs */}
        <div style={{ position:'fixed',top:-200,left:-200,width:700,height:700,borderRadius:'50%',
          background:'radial-gradient(circle,var(--blob1) 0%,transparent 70%)',pointerEvents:'none',zIndex:0 }} />
        <div style={{ position:'fixed',bottom:-200,right:-100,width:600,height:600,borderRadius:'50%',
          background:'radial-gradient(circle,var(--blob2) 0%,transparent 70%)',pointerEvents:'none',zIndex:0 }} />

        {/* ── NAV ── */}
        <nav style={{ position:'sticky',top:0,zIndex:100,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'15px 48px',
          background:'var(--nav-bg)',borderBottom:'1px solid var(--border)',
          backdropFilter:'blur(22px)',transition:'background .45s,border-color .45s' }}>

          <div style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer' }}
            onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display:'flex',alignItems:'center',justifyContent:'center',
              boxShadow:'0 4px 14px rgba(79,70,229,.5)',fontFamily:F,fontWeight:900,fontSize:16,color:'white' }}>A</div>
            <div>
              <p style={{ fontFamily:F,fontWeight:900,fontSize:15,color:'var(--text-primary)',lineHeight:1 }}>AstralIQ</p>
              <p style={{ fontFamily:F,fontSize:10,fontWeight:500,color:'var(--text-muted)',lineHeight:1,marginTop:2 }}>Ambassador Platform</p>
            </div>
          </div>

          <div style={{ display:'flex',alignItems:'center',gap:30 }}>
            <button className="nav-link">How it Works</button>
            <button className="nav-link" onClick={enterDemo}>Live Demo</button>
            <button className="nav-link" onClick={() => navigate('/github-comparison')}>GitHub Comparison</button>
          </div>

          <div style={{ display:'flex',gap:10,alignItems:'center' }}>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button className="btn-s" style={{ padding:'9px 20px',fontSize:12 }} onClick={() => navigate('/ambassador/login')}>Sign In</button>
            <button className="btn-p" style={{ padding:'9px 20px',fontSize:12 }} onClick={() => navigate('/admin/login')}>For Organizations</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position:'relative',zIndex:1,minHeight:'calc(100vh - 67px)',
          display:'flex',alignItems:'center',justifyContent:'center',
          padding:'80px 48px',overflow:'hidden' }}>
          <Stars show={isDark} />
          <div style={{ position:'absolute',inset:0,pointerEvents:'none',
            backgroundImage:`linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)`,
            backgroundSize:'60px 60px',opacity:.45 }} />

          <div style={{ maxWidth:1100,width:'100%',display:'flex',alignItems:'center',gap:80 }}>
            <div style={{ flex:1 }}>
              <div className="fu1" style={{ display:'inline-flex',alignItems:'center',gap:8,
                background:'rgba(79,70,229,.12)',border:'1px solid rgba(79,70,229,.3)',
                borderRadius:99,padding:'6px 16px',marginBottom:28 }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:'#818CF8',animation:'blink 2s ease-in-out infinite' }} />
                <span style={{ fontFamily:F,fontSize:11,fontWeight:800,color:'#818CF8',letterSpacing:'.1em',textTransform:'uppercase' }}>
                  AI-Powered Ambassador Platform
                </span>
              </div>

              <h1 className="fu2" style={{ fontFamily:F,fontWeight:900,fontSize:'clamp(38px,5vw,64px)',
                lineHeight:1.05,color:'var(--text-primary)',letterSpacing:'-.025em',marginBottom:22 }}>
                Ambassador<br />programs,<br />
                <span style={{ background:'linear-gradient(135deg,var(--pill-color),var(--accent-light),var(--accent2))',
                  backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                  backgroundClip:'text',animation:'shimmer 4s linear infinite' }}>
                  finally intelligent.
                </span>
              </h1>

              <p className="fu3" style={{ fontFamily:F,fontSize:17,fontWeight:400,
                color:'var(--text-sec)',lineHeight:1.75,maxWidth:480,marginBottom:42 }}>
                Replace WhatsApp chaos and Excel spreadsheets with an AI-powered platform that tracks, motivates, and grows your campus ambassador program in real time.
              </p>

              <div className="fu4" style={{ display:'flex',gap:14,flexWrap:'wrap',marginBottom:22 }}>
                <button className="btn-p" onClick={() => navigate('/ambassador/login')}>Join as Ambassador</button>
                <button className="btn-s" onClick={() => navigate('/admin/login')}>For Organizations</button>
              </div>
              <div className="fu5">
                <button className="btn-ghost" onClick={enterDemo}>View live demo — no signup needed</button>
              </div>

              <div className="fu5" style={{ display:'flex',gap:32,marginTop:48,
                paddingTop:32,borderTop:'1px solid var(--border)' }}>
                {[['4,500+','Ambassadors'],['120+','Colleges'],['1.2M+','Points Earned']].map(([num,label]) => (
                  <div key={label}>
                    <p style={{ fontFamily:F,fontWeight:900,fontSize:26,color:'var(--accent-light)',lineHeight:1 }}>{num}</p>
                    <p style={{ fontFamily:F,fontSize:12,fontWeight:500,color:'var(--text-muted)',marginTop:4 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flexShrink:0,animation:'slideRight 1s cubic-bezier(.16,1,.3,1) .3s both' }}>
              <Orbital />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ position:'relative',zIndex:1,padding:'100px 48px',borderTop:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1000,margin:'0 auto' }}>
            <p className="sr" style={{ fontFamily:F,fontSize:11,fontWeight:800,color:'var(--text-muted)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16 }}>Process</p>
            <h2 className="sr" style={{ fontFamily:F,fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:'var(--text-primary)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:64 }}>How AstralIQ Works</h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20 }}>
              {[
                { n:'01',title:'Join Your Program',desc:'Ambassadors sign up, set goals, and get instantly onboarded with a personalized mission plan built around their strengths.' },
                { n:'02',title:'Complete AI-Powered Tasks',desc:'AI recommends tasks based on your strengths. Complete them, earn XP, and climb the leaderboard in real time.' },
                { n:'03',title:'Rise Through the Ranks',desc:'Bronze to Legend — unlock exclusive badges, redeem premium rewards, and become the top ambassador at your college.' },
              ].map(({ n,title,desc },i) => (
                <div key={n} className="fcard sr" style={{ transitionDelay:`${i*.15}s` }}>
                  <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
                    <StepMark n={n} />
                    <div style={{ height:1,flex:1,background:'var(--border)' }} />
                  </div>
                  <h3 style={{ fontFamily:F,fontWeight:800,fontSize:17,color:'var(--text-primary)',marginBottom:12 }}>{title}</h3>
                  <p style={{ fontFamily:F,fontSize:14,fontWeight:400,color:'var(--text-sec)',lineHeight:1.75 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ position:'relative',zIndex:1,padding:'80px 48px',
          background:isDark?'rgba(79,70,229,.04)':'rgba(79,70,229,.03)',
          borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1000,margin:'0 auto' }}>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1 }}>
              {[['4,500+','Active Ambassadors'],['120+','Partner Colleges'],['1.2M+','XP Points Awarded'],['98%','Retention Rate']].map(([num,label],i) => (
                <div key={label} className="sr" style={{ textAlign:'center',padding:'40px 20px',
                  borderRight:i<3?'1px solid var(--border)':'none',transitionDelay:`${i*.1}s` }}>
                  <p className="stat-n">{num}</p>
                  <p style={{ fontFamily:F,fontSize:13,fontWeight:600,color:'var(--text-muted)',marginTop:10 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY ── */}
        <section style={{ position:'relative',zIndex:1,padding:'100px 48px' }}>
          <div style={{ maxWidth:1000,margin:'0 auto' }}>
            <p className="sr" style={{ fontFamily:F,fontSize:11,fontWeight:800,color:'var(--text-muted)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16 }}>Why AstralIQ</p>
            <h2 className="sr" style={{ fontFamily:F,fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:'var(--text-primary)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:64 }}>
              Built different.<br/>
              <span style={{ background:'linear-gradient(135deg,var(--pill-color),var(--accent-light))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>
                Built to win.
              </span>
            </h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20 }}>
              {[
                { icon:'⚡',title:'Real-Time XP Engine',    desc:'Every task completion, referral, and event triggers instant XP updates — no manual tracking, no spreadsheets.' },
                { icon:'🤖',title:'AI Coach — Nova',        desc:'A voice-enabled, context-aware AI coach that knows your rank, badges, streak, and tasks. Personalized guidance, always.' },
                { icon:'🏆',title:'Gamified Leaderboards',  desc:'Live global rankings, college battles, badge showcases — keeping every ambassador motivated week over week.' },
                { icon:'📊',title:'Admin Intelligence',     desc:'Dropout risk signals, top performer identification, program ROI metrics — all surfaced automatically for organizations.' },
              ].map(({ icon,title,desc },i) => (
                <div key={title} className="fcard sr" style={{ transitionDelay:`${i*.12}s`,display:'flex',gap:20,alignItems:'flex-start' }}>
                  <div style={{ width:50,height:50,borderRadius:14,flexShrink:0,fontSize:22,
                    background:'linear-gradient(135deg,rgba(79,70,229,.14),rgba(124,58,237,.14))',
                    border:'1.5px solid rgba(196,181,253,.14)',
                    display:'flex',alignItems:'center',justifyContent:'center' }}>{icon}</div>
                  <div>
                    <h3 style={{ fontFamily:F,fontWeight:800,fontSize:16,color:'var(--text-primary)',marginBottom:8 }}>{title}</h3>
                    <p style={{ fontFamily:F,fontSize:13,fontWeight:400,color:'var(--text-sec)',lineHeight:1.75 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ position:'relative',zIndex:1,padding:'100px 48px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center' }}>
          <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:400,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(79,70,229,.13) 0%,transparent 70%)',pointerEvents:'none' }} />
          <p className="sr" style={{ fontFamily:F,fontSize:11,fontWeight:800,color:'var(--text-muted)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:20 }}>Get Started</p>
          <h2 className="sr" style={{ fontFamily:F,fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'var(--text-primary)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:16,maxWidth:640 }}>
            Ready to build the most intelligent ambassador program?
          </h2>
          <p className="sr" style={{ fontFamily:F,fontSize:15,fontWeight:400,color:'var(--text-sec)',marginBottom:42,maxWidth:480,lineHeight:1.75 }}>
            Join thousands of students already earning XP, unlocking badges, and climbing the ranks.
          </p>
          <div className="sr" style={{ display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center',marginBottom:20 }}>
            <button className="btn-p" onClick={() => navigate('/ambassador/login')}>Join as Ambassador</button>
            <button className="btn-s" onClick={() => navigate('/admin/login')}>For Organizations</button>
          </div>
          <button className="btn-ghost" onClick={enterDemo}>View live demo — no signup needed</button>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:'1px solid var(--border)',padding:'28px 48px',
          display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',zIndex:1 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F,fontWeight:900,fontSize:12,color:'white' }}>A</div>
            <span style={{ fontFamily:F,fontWeight:700,fontSize:13,color:'var(--text-muted)' }}>AstralIQ</span>
          </div>
          <p style={{ fontFamily:F,fontSize:12,fontWeight:500,color:'var(--text-muted)' }}>Built for students. Powered by AI.</p>
          <div style={{ display:'flex',gap:24 }}>
            <button className="nav-link" style={{ fontSize:12 }}>Privacy</button>
            <button className="nav-link" style={{ fontSize:12 }}>Terms</button>
            <button className="nav-link" style={{ fontSize:12 }}>Contact</button>
          </div>
        </footer>

        {/* ── NOVA MASCOT ── */}
        <MascotWidget isDark={isDark} onNavigate={navigate} />
      </div>
    </>
  );
}