import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import AmbassadorNav from '../../components/AmbassadorNav';
import { BADGES } from '../../data/mockData';

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

  @keyframes bdg-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-8px) rotate(1.5deg); }
    66%      { transform: translateY(-4px) rotate(-1deg); }
  }
  @keyframes bdg-orbit {
    from { transform: rotate(0deg) translateX(28px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
  }
  @keyframes bdg-orbit2 {
    from { transform: rotate(180deg) translateX(18px) rotate(-180deg); }
    to   { transform: rotate(540deg)  translateX(18px) rotate(-540deg); }
  }
  @keyframes bdg-pulse-glow {
    0%,100% { opacity: 0.6; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.08); }
  }
  @keyframes bdg-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes bdg-twinkle {
    0%,100% { opacity:0.9; transform:scale(1); }
    50%      { opacity:0.2; transform:scale(0.6); }
  }
  @keyframes bdg-reveal {
    from { opacity:0; transform:translateY(18px) scale(0.92); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }
  @keyframes bdg-ring-spin {
    from { transform: rotateX(65deg) rotateZ(0deg); }
    to   { transform: rotateX(65deg) rotateZ(360deg); }
  }
  @keyframes bdg-locked-pulse {
    0%,100% { opacity:0.45; }
    50%      { opacity:0.7; }
  }

  .bdg-card:hover .bdg-planet { transform: scale(1.12); }
  .bdg-card:hover              { transform: translateY(-4px); }
  .bdg-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .bdg-planet { transition: transform 0.3s ease; }

  .bdg-locked-card:hover { transform: translateY(-2px); opacity: 1 !important; }
  .bdg-locked-card { transition: transform 0.2s ease, opacity 0.2s ease; }
`;

// ── Star field ────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (Math.random() * 100).toFixed(2),
  y: (Math.random() * 100).toFixed(2),
  r: (Math.random() * 1.5 + 0.4).toFixed(2),
  delay: (Math.random() * 5).toFixed(2),
  dur:   (Math.random() * 3 + 2).toFixed(2),
}));

// ── Badge visual config — each badge becomes a unique celestial body ──────
const BADGE_VISUALS = {
  newcomer: {
    type: 'star',
    core: '#fbbf24', glow: '#f59e0b',
    rings: 5, ringColor: '#fde68a',
    label: 'Newborn Star',
    desc: 'Your light first shone',
  },
  first_task: {
    type: 'comet',
    core: '#60a5fa', glow: '#3b82f6',
    rings: 0, ringColor: '#93c5fd',
    label: 'First Comet',
    desc: 'A blazing beginning',
  },
  on_fire: {
    type: 'planet',
    core: '#f97316', glow: '#ea580c',
    rings: 1, ringColor: '#fdba74',
    label: 'Inferno World',
    desc: 'The streak planet burns',
  },
  century: {
    type: 'planet',
    core: '#a78bfa', glow: '#7c3aed',
    rings: 2, ringColor: '#c4b5fd',
    label: 'Violet Nebula',
    desc: '1000 points of starlight',
  },
  top_10: {
    type: 'planet',
    core: '#f59e0b', glow: '#d97706',
    rings: 3, ringColor: '#fde68a',
    label: 'Golden Sphere',
    desc: 'Among the elite few',
  },
  referral_king: {
    type: 'constellation',
    core: '#ec4899', glow: '#be185d',
    rings: 0, ringColor: '#fbcfe8',
    label: 'Crown Constellation',
    desc: 'Five stars aligned',
  },
  perfect_week: {
    type: 'pulsar',
    core: '#34d399', glow: '#059669',
    rings: 4, ringColor: '#6ee7b7',
    label: 'Emerald Pulsar',
    desc: 'Perfect rhythm of light',
  },
  college_champion: {
    type: 'galaxy',
    core: '#818cf8', glow: '#4f46e5',
    rings: 6, ringColor: '#a5b4fc',
    label: 'Galaxy Core',
    desc: 'The heart of your universe',
  },
};

// ── Planet SVG renderer ───────────────────────────────────────────────────
function BadgePlanet({ vis, size = 72, earned = true, float = true }) {
  const s = size;
  const cx = s / 2, cy = s / 2, r = s * 0.36;
  const { core, glow, rings, ringColor, type } = vis;
  const opacity = earned ? 1 : 0.28;

  return (
    <div style={{
      width: s, height: s, position: 'relative', flexShrink: 0,
      animation: float && earned ? `bdg-float ${3 + (rings % 3) * 0.5}s ease-in-out infinite` : 'none',
      opacity,
    }} className="bdg-planet">
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" overflow="visible">
        <defs>
          <radialGradient id={`pg-${core.replace('#','')}`} cx="38%" cy="35%" r="60%">
            <stop offset="0%"   stopColor={lighten(core, 40)} />
            <stop offset="50%"  stopColor={core} />
            <stop offset="100%" stopColor={darken(core, 30)} />
          </radialGradient>
          <filter id={`glow-${core.replace('#','')}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={earned ? s * 0.08 : 2} result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {earned && (
          <circle cx={cx} cy={cy} r={r * 1.55}
            fill={glow} opacity="0.18"
            style={{ animation: `bdg-pulse-glow 2.5s ease-in-out ${rings*0.2}s infinite` }} />
        )}

        {type === 'star' ? (
          <StarShape cx={cx} cy={cy} r={r} fill={`url(#pg-${core.replace('#','')})`}
            filter={`url(#glow-${core.replace('#','')})`} earned={earned} />
        ) : type === 'comet' ? (
          <CometShape cx={cx} cy={cy} r={r} core={core} earned={earned}
            filter={`url(#glow-${core.replace('#','')})`} />
        ) : type === 'constellation' ? (
          <ConstellationShape cx={cx} cy={cy} r={r} core={core} earned={earned} />
        ) : (
          <circle cx={cx} cy={cy} r={r}
            fill={`url(#pg-${core.replace('#','')})`}
            filter={`url(#glow-${core.replace('#','')})`} />
        )}

        {(type === 'planet' || type === 'pulsar' || type === 'galaxy') && earned && (
          <>
            <ellipse cx={cx} cy={cy - r*0.18} rx={r*0.85} ry={r*0.12}
              fill={lighten(core, 20)} opacity="0.22" />
            <ellipse cx={cx} cy={cy + r*0.22} rx={r*0.75} ry={r*0.1}
              fill={darken(core, 10)} opacity="0.25" />
          </>
        )}

        {earned && (
          <ellipse cx={cx - r*0.22} cy={cy - r*0.28} rx={r*0.22} ry={r*0.14}
            fill="white" opacity="0.28" />
        )}

        {rings >= 1 && (
          <ellipse cx={cx} cy={cy} rx={r*1.55} ry={r*0.28}
            fill="none" stroke={ringColor} strokeWidth={earned ? 2.5 : 1}
            opacity={earned ? 0.75 : 0.2}
            style={{ animation: earned ? `bdg-ring-spin ${4+rings}s linear infinite` : 'none',
                     transformOrigin: `${cx}px ${cy}px` }} />
        )}
        {rings >= 3 && (
          <ellipse cx={cx} cy={cy} rx={r*1.85} ry={r*0.35}
            fill="none" stroke={ringColor} strokeWidth={earned ? 1.5 : 0.8}
            opacity={earned ? 0.45 : 0.12}
            style={{ animation: earned ? `bdg-ring-spin ${6+rings}s linear reverse infinite` : 'none',
                     transformOrigin: `${cx}px ${cy}px` }} />
        )}

        {(type === 'pulsar' || type === 'galaxy') && earned && (
          <g style={{ animation: 'bdg-orbit 3s linear infinite', transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r={4} fill={lighten(core, 35)} opacity="0.9" />
          </g>
        )}

        {!earned && (
          <g>
            <circle cx={cx} cy={cy} r={r*0.45} fill="#1e1b4b" opacity="0.7" />
            <text x={cx} y={cy + 6} textAnchor="middle" fontSize={r*0.5} fill="#6b7280">🔒</text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ── Shape helpers ─────────────────────────────────────────────────────────
function StarShape({ cx, cy, r, fill, filter, earned }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.48;
    return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`;
  }).join(' ');
  return <polygon points={pts} fill={fill} filter={filter} opacity={earned ? 1 : 0.4} />;
}

function CometShape({ cx, cy, r, core, filter, earned }) {
  return (
    <g filter={filter} opacity={earned ? 1 : 0.4}>
      <circle cx={cx + r*0.3} cy={cy} r={r*0.55} fill={core} />
      <ellipse cx={cx - r*0.3} cy={cy} rx={r*0.9} ry={r*0.22} fill={lighten(core, 30)} opacity="0.6" />
      <ellipse cx={cx - r*0.55} cy={cy} rx={r*0.5} ry={r*0.12} fill={lighten(core, 50)} opacity="0.35" />
    </g>
  );
}

function ConstellationShape({ cx, cy, r, core, earned }) {
  const stars = [
    [0, -r*0.8], [r*0.76, -r*0.25], [r*0.47, r*0.65],
    [-r*0.47, r*0.65], [-r*0.76, -r*0.25],
  ].map(([dx, dy]) => [cx+dx, cy+dy]);
  return (
    <g opacity={earned ? 1 : 0.35}>
      {stars.map(([x1,y1], i) =>
        stars.map(([x2,y2], j) => j > i && (
          <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={core} strokeWidth="1.2" opacity="0.45" />
        ))
      )}
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i===0?6:4} fill={core}
          style={{ animation: earned ? `bdg-twinkle ${2+i*0.4}s ${i*0.3}s ease-in-out infinite` : 'none' }} />
      ))}
    </g>
  );
}

// ── Colour utils ──────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}
function lighten(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

// ── Progress helpers ──────────────────────────────────────────────────────
function getProgress(badgeId, amb) {
  if (!amb) return { val: 0, max: 1, label: '' };
  switch (badgeId) {
    case 'on_fire':          return { val: Math.min(amb.streak, 7),               max: 7,    label: `${amb.streak}/7 day streak` };
    case 'century':          return { val: Math.min(amb.points, 1000),            max: 1000, label: `${amb.points}/1000 pts` };
    case 'top_10':           return { val: Math.min(Math.max(0,11-amb.rank),10),  max: 10,   label: `Rank #${amb.rank}` };
    case 'referral_king':    return { val: 0, max: 5, label: '0/5 referrals' };
    case 'perfect_week':     return { val: Math.min(amb.tasksCompleted % 7, 7),   max: 7,    label: `${amb.tasksCompleted % 7}/7 this week` };
    case 'college_champion': return { val: 0, max: 1, label: 'Rank #1 at college' };
    default:                 return { val: 0, max: 1, label: '' };
  }
}

// ── Main Component ────────────────────────────────────────────────────────
export default function Badges() {
  const { ambassadors } = useData();
  const { user }        = useAuth?.() || {};

  const [isDark, setIsDark] = useState(() => localStorage.getItem('astraliq-theme') === 'dark');
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const h = (e) => setIsDark(e.detail?.isDark ?? false);
    window.addEventListener('astraliq-theme-change', h);
    return () => window.removeEventListener('astraliq-theme-change', h);
  }, []);

  const me = ambassadors?.find(a => a.id === user?.id) || ambassadors?.[0];

  const earned = BADGES.filter(b => me?.badges?.includes(b.id));
  const locked = BADGES.filter(b => !me?.badges?.includes(b.id));

  const dk = isDark;
  const txtPri  = dk ? '#e0e7ff' : '#1e1b4b';
  const txtSec  = dk ? '#8b5cf6' : '#7c3aed';
  const cardBg  = dk ? 'rgba(13,8,38,0.85)' : 'rgba(255,255,255,0.9)';
  const cardBdr = dk ? '#1e1b4b' : '#ede9fe';

  return (
    <>
      <style>{CSS}</style>

      <div style={{
        minHeight: '100vh',
        background: dk
          ? 'linear-gradient(160deg,#060110 0%,#0a0520 55%,#0e0828 100%)'
          : 'linear-gradient(160deg,#f5f3ff 0%,#ede9fe 60%,#ddd6fe 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'background 0.4s',
      }}>
        <AmbassadorNav isDark={dk} activePage="badges" />

        {/* Stars (dark only) */}
        {dk && (
          <svg style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}>
            {STARS.map(s => (
              <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
                style={{ animation:`bdg-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
            ))}
          </svg>
        )}

        {/* ── Main content shifted right of sidebar ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginLeft: 220,           // ← accounts for AmbassadorNav width
          padding: '80px 32px 60px',
          maxWidth: 1000,
        }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 32, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:txtPri, letterSpacing:'-0.6px' }}>
                Cosmic Badge Collection
              </h1>
              <p style={{ margin:'4px 0 0', fontSize:13, color:txtSec, fontWeight:600 }}>
                {earned.length} of {BADGES.length} celestial bodies discovered
              </p>
            </div>

            {/* Progress orb */}
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              background: cardBg,
              border:`1px solid ${cardBdr}`,
              borderRadius:16, padding:'10px 18px',
              backdropFilter:'blur(12px)',
            }}>
              <div style={{ position:'relative', width:48, height:48 }}>
                <svg width={48} height={48} viewBox="0 0 48 48">
                  <circle cx={24} cy={24} r={20} fill="none"
                    stroke={dk?'#1e1b4b':'#ede9fe'} strokeWidth={4} />
                  <circle cx={24} cy={24} r={20} fill="none"
                    stroke="#7c3aed" strokeWidth={4}
                    strokeDasharray={`${(earned.length/BADGES.length)*125.6} 125.6`}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                    style={{ transition:'stroke-dasharray 1s ease' }} />
                </svg>
                <div style={{
                  position:'absolute', inset:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:800, color:txtPri,
                }}>{Math.round((earned.length/BADGES.length)*100)}%</div>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:txtPri }}>{earned.length}/{BADGES.length}</div>
                <div style={{ fontSize:11, color:txtSec }}>Badges earned</div>
              </div>
            </div>
          </div>

          {/* ── Earned Badges ── */}
          <div style={{ marginBottom:40 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:3, height:20, borderRadius:2, background:'linear-gradient(180deg,#7c3aed,#a78bfa)' }} />
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:txtPri }}>
                Discovered ✦ {earned.length}
              </h2>
            </div>

            {earned.length === 0 ? (
              <div style={{
                textAlign:'center', padding:'40px 0',
                color: dk?'#4b5563':'#9ca3af', fontSize:14,
              }}>
                Complete tasks to discover your first celestial badge 🌌
              </div>
            ) : (
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',
                gap:16,
              }}>
                {earned.map((badge, idx) => {
                  const vis = BADGE_VISUALS[badge.id] || {
                    type:'planet', core:'#a78bfa', glow:'#7c3aed', rings:1, ringColor:'#c4b5fd',
                    label: badge.name, desc: badge.description,
                  };
                  const isSelected = selected === badge.id;
                  return (
                    <div
                      key={badge.id}
                      className="bdg-card"
                      onClick={() => setSelected(isSelected ? null : badge.id)}
                      style={{
                        background: isSelected
                          ? (dk ? `linear-gradient(135deg,${vis.glow}22,${vis.core}15)` : `linear-gradient(135deg,${vis.glow}18,${vis.core}10)`)
                          : cardBg,
                        border: isSelected
                          ? `1.5px solid ${vis.core}`
                          : `1px solid ${cardBdr}`,
                        borderRadius:20, padding:'22px 16px 18px',
                        display:'flex', flexDirection:'column', alignItems:'center', gap:10,
                        cursor:'pointer', backdropFilter:'blur(12px)',
                        boxShadow: isSelected ? `0 0 24px ${vis.glow}44` : 'none',
                        animation: mounted ? `bdg-reveal 0.4s ease ${idx*0.07}s both` : 'none',
                      }}
                    >
                      <BadgePlanet vis={vis} size={80} earned={true} float={true} />

                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:13, fontWeight:800, color:txtPri, marginBottom:2 }}>
                          {badge.name}
                        </div>
                        <div style={{
                          fontSize:10, fontWeight:600, letterSpacing:0.5,
                          color: vis.core,
                          background: `${vis.core}18`,
                          border:`1px solid ${vis.core}44`,
                          borderRadius:20, padding:'2px 8px', display:'inline-block',
                          marginBottom:6,
                        }}>{badge.rarity}</div>
                        <div style={{ fontSize:11, color:dk?'#8b5cf6':'#7c3aed', fontWeight:600 }}>
                          {vis.label}
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{
                          width:'100%', borderTop:`1px solid ${vis.core}33`, paddingTop:10,
                          animation:'bdg-reveal 0.2s ease',
                        }}>
                          <div style={{ fontSize:11, color:dk?'#c4b5fd':'#4c1d95', textAlign:'center', lineHeight:1.5, marginBottom:6 }}>
                            {badge.description}
                          </div>
                          <div style={{
                            display:'flex', justifyContent:'center', alignItems:'center', gap:6,
                            fontSize:11, fontWeight:800, color: vis.core,
                          }}>
                            ✦ +{badge.points} pts earned
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Locked Badges ── */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:3, height:20, borderRadius:2, background:'linear-gradient(180deg,#4b5563,#6b7280)' }} />
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:dk?'#6b7280':'#9ca3af' }}>
                Undiscovered ✦ {locked.length}
              </h2>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {locked.map((badge, idx) => {
                const vis = BADGE_VISUALS[badge.id] || {
                  type:'planet', core:'#6b7280', glow:'#4b5563', rings:1, ringColor:'#9ca3af',
                  label: badge.name, desc: badge.description,
                };
                const prog = getProgress(badge.id, me);
                const pct  = Math.min((prog.val / prog.max) * 100, 100);

                return (
                  <div
                    key={badge.id}
                    className="bdg-locked-card"
                    style={{
                      background: cardBg,
                      border:`1px solid ${cardBdr}`,
                      borderRadius:16,
                      padding:'16px 20px',
                      display:'flex', alignItems:'center', gap:16,
                      backdropFilter:'blur(12px)',
                      opacity: 0.72,
                      animation: mounted ? `bdg-reveal 0.4s ease ${idx*0.06}s both` : 'none',
                    }}
                  >
                    <BadgePlanet vis={vis} size={58} earned={false} float={false} />

                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:dk?'#6b7280':'#9ca3af' }}>
                          {badge.name}
                        </span>
                        <span style={{
                          fontSize:9, fontWeight:700, letterSpacing:0.5,
                          color: badge.rarityColor,
                          background:`${badge.rarityColor}18`,
                          border:`1px solid ${badge.rarityColor}44`,
                          borderRadius:20, padding:'1px 7px',
                        }}>{badge.rarity}</span>
                      </div>
                      <div style={{ fontSize:11, color:dk?'#4b5563':'#9ca3af', marginBottom:8, lineHeight:1.4 }}>
                        {badge.condition}
                      </div>

                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{
                          flex:1, height:6, borderRadius:6,
                          background:dk?'#1e1b4b':'#ede9fe', overflow:'hidden',
                        }}>
                          <div style={{
                            height:'100%', borderRadius:6,
                            width: mounted ? `${pct}%` : '0%',
                            background: pct > 0
                              ? `linear-gradient(90deg, ${vis.core}, ${vis.glow})`
                              : (dk?'#374151':'#d1d5db'),
                            transition:'width 1.2s cubic-bezier(0.34,1.2,0.64,1)',
                          }} />
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, color:dk?'#6b7280':'#9ca3af', whiteSpace:'nowrap' }}>
                          {prog.label || badge.condition}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      textAlign:'center', flexShrink:0,
                      padding:'8px 14px',
                      background: dk?'#0d0826':'#f5f3ff',
                      border:`1px solid ${cardBdr}`,
                      borderRadius:12,
                    }}>
                      <div style={{ fontSize:16, marginBottom:2 }}>🌠</div>
                      <div style={{ fontSize:11, fontWeight:800, color:dk?'#6b7280':'#9ca3af' }}>
                        +{badge.points}
                      </div>
                      <div style={{ fontSize:9, color:dk?'#4b5563':'#9ca3af' }}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}