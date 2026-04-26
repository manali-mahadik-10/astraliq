import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import AmbassadorNav from '../../components/AmbassadorNav';
import { LEVELS } from '../../data/mockData';

const MAX_POINTS = 7000;

const ROCKET_COLORS = [
  '#a78bfa', '#60a5fa', '#f472b6', '#34d399',
  '#fb923c', '#f87171', '#38bdf8', '#facc15',
];

const getLevel = (points) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
};

const initials = (name) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  @keyframes lb-bob {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes lb-twinkle {
    0%,100% { opacity: 0.75; }
    50%      { opacity: 0.12; }
  }
  @keyframes lb-flicker {
    0%,100% { transform: scaleX(1)   scaleY(1);   opacity: 1;   }
    33%      { transform: scaleX(0.7) scaleY(0.85); opacity: 0.8; }
    66%      { transform: scaleX(1.1) scaleY(0.9);  opacity: 0.9; }
  }
  @keyframes lb-youPulse {
    0%   { box-shadow: 0 0 0 0   rgba(167,139,250,0.55); }
    70%  { box-shadow: 0 0 0 7px rgba(167,139,250,0);    }
    100% { box-shadow: 0 0 0 0   rgba(167,139,250,0);    }
  }
  @keyframes lb-slideIn {
    from { opacity:0; transform: translateY(6px); }
    to   { opacity:1; transform: translateY(0);   }
  }
`;

const STARS = Array.from({ length: 95 }, (_, i) => ({
  id: i,
  x: (Math.random() * 100).toFixed(2),
  y: (Math.random() * 100).toFixed(2),
  r: (Math.random() * 1.6 + 0.5).toFixed(2),
  delay: (Math.random() * 4).toFixed(2),
  dur:   (Math.random() * 2 + 2).toFixed(2),
}));

function RocketSVG({ color, gender, w, h, bobDelay }) {
  const face = gender === 'female' ? '#fda4af' : '#93c5fd';
  return (
    <div style={{
      width: w, height: h,
      animation: `lb-bob 2.3s ease-in-out ${bobDelay}s infinite`,
      flexShrink: 0,
    }}>
      <svg width={w} height={h} viewBox="0 0 90 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g style={{ transformOrigin: '12px 39px', animation: 'lb-flicker 0.38s ease-in-out infinite' }}>
          <ellipse cx="12" cy="39" rx="11" ry="7"  fill="#f97316" opacity="0.95" />
          <ellipse cx="8"  cy="39" rx="6.5" ry="4.5" fill="#fbbf24" />
          <ellipse cx="5"  cy="39" rx="3"   ry="2.5" fill="#fef08a" />
        </g>
        <rect x="18" y="28" width="52" height="20" rx="10" fill={color} />
        <rect x="22" y="30" width="30" height="6" rx="3" fill="white" opacity="0.13" />
        <path d="M70 28 Q92 38 70 48 Z" fill={color} opacity="0.87" />
        <circle cx="48" cy="38" r="8"   fill="#08031a" stroke="#c7d2fe" strokeWidth="2" />
        <circle cx="48" cy="38" r="5.5" fill="#1e1065" />
        <circle cx="46" cy="36" r="1.8" fill="#a5b4fc" opacity="0.55" />
        <path d="M24 48 L15 58 L35 48 Z" fill={color} opacity="0.76" />
        <path d="M24 28 L15 18 L35 28 Z" fill={color} opacity="0.76" />
        <ellipse cx="59" cy="22" rx="9" ry="7"  fill="#e0e7ff" />
        <rect    x="64" y="18"  width="5.5" height="9" rx="2.5" fill="#c7d2fe" />
        <circle cx="59" cy="13" r="9"   fill="#ddd6fe" stroke="#a5b4fc" strokeWidth="1.5" />
        <ellipse cx="59" cy="13" rx="6"   ry="5"   fill="#08031a" opacity="0.87" />
        <ellipse cx="57" cy="11" rx="1.8" ry="1.2" fill="white"   opacity="0.42" />
        <circle cx="57" cy="13.5" r="1.4" fill={face} />
        <circle cx="61" cy="13.5" r="1.4" fill={face} />
        <line x1="55" y1="29" x2="51" y2="37" stroke="#c7d2fe" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="63" y1="29" x2="67" y2="37" stroke="#c7d2fe" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="51" cy="38" r="2.5" fill="#818cf8" />
        <circle cx="67" cy="38" r="2.5" fill="#818cf8" />
      </svg>
    </div>
  );
}

export default function Leaderboard() {
  const { getLeaderboard } = useData();
  const { user }           = useAuth?.() || {};

  const [isDark,  setIsDark]  = useState(() => localStorage.getItem('astraliq-theme') === 'dark');
  const [filter,  setFilter]  = useState('points');
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const h = (e) => setIsDark(e.detail?.isDark ?? false);
    window.addEventListener('astraliq-theme-change', h);
    return () => window.removeEventListener('astraliq-theme-change', h);
  }, []);

  const board = (getLeaderboard?.() ?? []).map((a, i) => ({
    ...a,
    color: ROCKET_COLORS[i % ROCKET_COLORS.length],
  }));

  const sorted = filter === 'points'
    ? board
    : [...board].sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const laneLeft = (amb) => {
    const val = filter === 'points' ? amb.points : amb.tasksCompleted;
    const max = filter === 'points' ? MAX_POINTS : 20;
    return 3 + (Math.min(val, max) / max) * 73;
  };

  const valLabel = (amb) =>
    filter === 'points' ? `${amb.points.toLocaleString()} pts` : `${amb.tasksCompleted} tasks`;

  const dk      = isDark;
  const txtPri  = dk ? '#e0e7ff' : '#1e1b4b';
  const txtSec  = dk ? '#8b5cf6' : '#7c3aed';
  const cardBg  = dk ? '#0d0826' : '#ffffff';
  const cardBdr = dk ? '#1e1b4b' : '#ede9fe';

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{
        minHeight: '100vh',
        background: dk
          ? 'linear-gradient(160deg,#060110 0%,#0a0520 55%,#0e0828 100%)'
          : 'linear-gradient(160deg,#f5f3ff 0%,#ede9fe 60%,#ddd6fe 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'background 0.4s',
      }}>
        <AmbassadorNav isDark={dk} activePage="leaderboard" />

        <div style={{
          paddingTop: 72,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 220,   // ← accounts for sidebar nav width
        }}>

          {/* ── Header ── */}
          <div style={{
            padding: '18px 20px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: txtPri, letterSpacing: '-0.4px' }}>
                Galaxy Leaderboard
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: txtSec, fontWeight: 600 }}>
                {sorted.length} ambassadors racing through the cosmos
              </p>
            </div>

            <div style={{ display: 'flex', background: dk ? '#140d30' : '#ede9fe', borderRadius: 10, padding: 3, gap: 2 }}>
              {[['points', 'Points'], ['tasks', 'Tasks Done']].map(([v, l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: filter === v ? '#7c3aed' : 'transparent',
                  color:      filter === v ? '#fff'    : txtSec,
                  transition: 'all 0.2s',
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '0 16px 16px', gap: 12 }}>

            {/* ════ SPACE CANVAS ════ */}
            <div style={{
              flex: 1, position: 'relative', overflow: 'visible', borderRadius: 16,
              background: dk ? '#060110' : '#f8f5ff',
              border: `1px solid ${dk ? '#1e1b4b' : '#ddd6fe'}`,
            }}>

              {dk && (
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 16 }}>
                  {STARS.map(s => (
                    <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
                      style={{ animation: `lb-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
                  ))}
                </svg>
              )}

              {/* Decorative planets */}
              <div style={{
                position: 'absolute', bottom: '8%', left: '4%',
                width: 90, height: 90, borderRadius: '50%',
                background: dk
                  ? 'radial-gradient(circle at 35% 35%, #7c3aed, #2e1065)'
                  : 'radial-gradient(circle at 35% 35%, #c4b5fd, #a78bfa)',
                opacity: dk ? 0.32 : 0.38,
                boxShadow: dk ? '0 0 40px #7c3aed44' : 'none',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: 'calc(8% + 18px)', left: 'calc(4% - 18px)',
                width: 126, height: 20, borderRadius: '50%',
                border: `5px solid ${dk ? '#7c3aed55' : '#c4b5fd66'}`,
                transform: 'rotateX(60deg)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', top: '10%', right: '24%',
                width: 58, height: 58, borderRadius: '50%',
                background: dk
                  ? 'radial-gradient(circle at 35% 35%, #be185d, #831843)'
                  : 'radial-gradient(circle at 35% 35%, #fbcfe8, #f9a8d4)',
                opacity: dk ? 0.28 : 0.42,
                pointerEvents: 'none',
              }} />

              {/* Finish line */}
              <div style={{
                position: 'absolute', right: '20%', top: 0, bottom: 0, width: 2,
                backgroundImage: `repeating-linear-gradient(to bottom,
                  ${dk ? '#f59e0b' : '#7c3aed'} 0,
                  ${dk ? '#f59e0b' : '#7c3aed'} 8px,
                  transparent 8px, transparent 16px)`,
                opacity: 0.45,
              }}>
                <span style={{
                  position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 8, fontWeight: 800, letterSpacing: 1.5, whiteSpace: 'nowrap',
                  color: dk ? '#f59e0b' : '#7c3aed',
                }}>FINISH</span>
              </div>

              {/* ── Lanes ── */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '6px 0' }}>
                {sorted.slice(0, 8).map((amb, idx) => {
                  const level = getLevel(amb.points);
                  const isMe  = amb.id === user?.id;
                  const left  = mounted ? `${laneLeft(amb)}%` : '3%';
                  const rW    = isMe ? 66 : 54;
                  const rH    = isMe ? 56 : 46;

                  // Tooltip direction: top 4 lanes → show below; bottom 4 → show above
                  const tooltipBelow = idx < 4;

                  return (
                    <div key={amb.id}
                      onMouseEnter={() => setHovered(amb.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        flex: 1, position: 'relative', display: 'flex', alignItems: 'center',
                        borderBottom: `1px solid ${dk ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.06)'}`,
                        overflow: 'visible',
                      }}
                    >
                      {hovered === amb.id && (
                        <div style={{
                          position: 'absolute', inset: 0, pointerEvents: 'none',
                          background: `linear-gradient(90deg, transparent, ${amb.color}16, transparent)`,
                        }} />
                      )}

                      {/* Rank badge */}
                      <div style={{
                        position: 'absolute', left: 8, zIndex: 2,
                        width: 22, height: 22, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800,
                        background:
                          idx === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' :
                          idx === 1 ? 'linear-gradient(135deg,#9ca3af,#6b7280)' :
                          idx === 2 ? 'linear-gradient(135deg,#b45309,#92400e)' :
                          (dk ? '#1e1b4b' : '#ede9fe'),
                        color: idx < 3 ? '#fff' : (dk ? '#a78bfa' : '#6d28d9'),
                        boxShadow: idx < 3
                          ? `0 2px 8px ${idx===0?'#f59e0b55':idx===1?'#9ca3af55':'#b4530955'}`
                          : 'none',
                      }}>{idx + 1}</div>

                      {/* Rocket */}
                      <div style={{
                        position: 'absolute',
                        left,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'left 1.5s cubic-bezier(0.34, 1.3, 0.64, 1)',
                        zIndex: 3,
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 1,
                      }}>
                        <div style={{
                          fontSize: 10, fontWeight: 800,
                          color: amb.color, whiteSpace: 'nowrap',
                          textShadow: dk ? `0 0 10px ${amb.color}` : 'none',
                        }}>{valLabel(amb)}</div>

                        <RocketSVG
                          color={amb.color}
                          gender={amb.gender}
                          w={rW} h={rH}
                          bobDelay={idx * 0.24}
                        />

                        <div style={{
                          fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
                          color: dk ? '#c4b5fd' : '#4c1d95',
                          background: dk ? 'rgba(6,1,16,0.8)' : 'rgba(248,245,255,0.85)',
                          padding: '1px 5px', borderRadius: 4,
                        }}>{amb.name.split(' ')[0]}</div>
                      </div>

                      {/* ── Tooltip: above for bottom lanes, below for top lanes ── */}
                      {hovered === amb.id && (
                        <div style={{
                          position: 'absolute',
                          left: `${Math.min(laneLeft(amb) + 3, 52)}%`,
                          top: '50%',
                          // top 4 lanes (idx 0-3) → tooltip below rocket; bottom 4 → above
                          transform: tooltipBelow
                            ? 'translate(-10%, 30%)'
                            : 'translate(-10%, -135%)',
                          background: dk ? 'rgba(14,8,38,0.97)' : 'rgba(255,255,255,0.98)',
                          border: `1.5px solid ${amb.color}`,
                          borderRadius: 10, padding: '8px 13px',
                          zIndex: 100, pointerEvents: 'none', whiteSpace: 'nowrap',
                          boxShadow: `0 4px 20px ${amb.color}55`,
                          animation: 'lb-slideIn 0.15s ease',
                        }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: amb.color }}>{amb.name}</div>
                          <div style={{ fontSize: 11, color: dk?'#c4b5fd':'#4c1d95', marginTop: 3 }}>
                            {amb.points.toLocaleString()} pts · {amb.tasksCompleted} tasks
                          </div>
                          <div style={{ fontSize: 10, marginTop: 1 }}>
                            <span style={{ color: level.color, fontWeight: 700 }}>{level.emoji} {level.name}</span>
                            <span style={{ color: dk?'#6b7280':'#9ca3af', marginLeft: 8 }}>{amb.college}</span>
                          </div>
                          <div style={{ fontSize: 10, color: dk?'#6b7280':'#9ca3af', marginTop: 1 }}>
                            🔥 {amb.streak}-day streak · {amb.badges.length} badges
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ════ SIDEBAR ════ */}
            <div style={{ width: 234, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>

              <div style={{
                background: dk
                  ? 'linear-gradient(135deg,#1c1004,#2d1e06)'
                  : 'linear-gradient(135deg,#fef3c7,#fde68a)',
                border: `1px solid ${dk ? '#f59e0b55' : '#f59e0baa'}`,
                borderRadius: 14, padding: '11px 13px',
                display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>🏆</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: dk ? '#fbbf24' : '#92400e' }}>
                    1st Place Reward
                  </div>
                  <div style={{ fontSize: 10, color: dk ? '#fde68a' : '#b45309', marginTop: 2, lineHeight: 1.5 }}>
                    Galaxy Badge + 500 pts Bonus
                  </div>
                </div>
              </div>

              {sorted.map((amb, idx) => {
                const level = getLevel(amb.points);
                const isMe  = amb.id === user?.id;
                return (
                  <div key={amb.id} style={{
                    background: isMe
                      ? (dk ? 'linear-gradient(135deg,#2d1b69,#3b1f8c)' : 'linear-gradient(135deg,#ede9fe,#ddd6fe)')
                      : cardBg,
                    border: isMe ? '1.5px solid #a78bfa' : `1px solid ${cardBdr}`,
                    borderRadius: 12, padding: '9px 11px',
                    display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0,
                    animation: isMe ? 'lb-youPulse 2.4s ease infinite' : 'none',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800,
                      background:
                        idx === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' :
                        idx === 1 ? 'linear-gradient(135deg,#9ca3af,#6b7280)' :
                        idx === 2 ? 'linear-gradient(135deg,#b45309,#92400e)' :
                        (dk ? '#1e1b4b' : '#ede9fe'),
                      color: idx < 3 ? '#fff' : (dk ? '#a78bfa' : '#6d28d9'),
                    }}>{idx + 1}</div>

                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${amb.color}, ${amb.color}88)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: '#fff',
                      boxShadow: `0 0 8px ${amb.color}55`,
                    }}>{initials(amb.name)}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: txtPri,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {amb.name}
                        {isMe && <span style={{ fontSize: 9, color: '#a78bfa', marginLeft: 5, fontWeight: 800 }}>YOU</span>}
                      </div>
                      <div style={{ marginTop: 4, height: 4, borderRadius: 4, background: dk ? '#1e1b4b' : '#ede9fe', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 4,
                          width: `${Math.min((amb.points / MAX_POINTS) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${amb.color}, ${amb.color}bb)`,
                          transition: 'width 1.2s ease',
                        }} />
                      </div>
                      <div style={{ fontSize: 9, marginTop: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: level.color }}>{level.emoji} {level.name}</span>
                        <span style={{ color: dk ? '#4b5563' : '#9ca3af' }}>·</span>
                        <span style={{ color: dk ? '#6b7280' : '#9ca3af' }}>{amb.points.toLocaleString()} pts</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{
                background: cardBg, border: `1px solid ${cardBdr}`,
                borderRadius: 12, padding: '10px 13px', flexShrink: 0,
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: txtSec, letterSpacing: 1, marginBottom: 8 }}>
                  AMBASSADOR LEVELS
                </div>
                {LEVELS.map(lv => (
                  <div key={lv.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{lv.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, width: 58 }}>{lv.name}</span>
                    <span style={{ fontSize: 10, color: dk ? '#6b7280' : '#9ca3af' }}>
                      {lv.min.toLocaleString()}+ pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}