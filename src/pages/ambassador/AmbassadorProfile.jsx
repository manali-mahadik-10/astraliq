import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getLevelFromPoints } from '../../utils/gameEngine';
import AmbassadorNav from '../../components/AmbassadorNav';
import { BADGES, LEVELS } from '../../data/mockData';

// ── Icons ──────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
  </svg>
);
const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M6 2h12v6c0 3.31-2.69 6-6 6S6 11.31 6 8V2zM4 4H2v4c0 1.66 1.34 3 3 3v1H4v2h16v-2h-1V11c1.66 0 3-1.34 3-3V4h-2v4c0 .55-.45 1-1 1V4zM8 19h8l1 3H7l1-3z"/>
  </svg>
);
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

// ── Mascot (same as Nav) ──
const Mascot = ({ size = 64 }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: size, height: size }}>
    <ellipse cx="40" cy="48" rx="22" ry="20" fill="#3B1F6E"/>
    <ellipse cx="40" cy="46" rx="19" ry="17" fill="#5B2D9E"/>
    <ellipse cx="40" cy="38" rx="16" ry="15" fill="#7C3AED"/>
    <ellipse cx="34" cy="36" rx="4" ry="4.5" fill="white"/>
    <ellipse cx="46" cy="36" rx="4" ry="4.5" fill="white"/>
    <circle cx="35" cy="37" r="2.5" fill="#1E1B4B"/>
    <circle cx="47" cy="37" r="2.5" fill="#1E1B4B"/>
    <circle cx="36" cy="36" r="1" fill="white"/>
    <circle cx="48" cy="36" r="1" fill="white"/>
    <ellipse cx="30" cy="42" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.6"/>
    <ellipse cx="50" cy="42" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.6"/>
    <path d="M34 44 Q40 50 46 44" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <ellipse cx="24" cy="28" rx="5" ry="7" fill="#3B1F6E" transform="rotate(-15 24 28)"/>
    <ellipse cx="56" cy="28" rx="5" ry="7" fill="#3B1F6E" transform="rotate(15 56 28)"/>
    <ellipse cx="24" cy="28" rx="3" ry="5" fill="#C4B5FD" transform="rotate(-15 24 28)"/>
    <ellipse cx="56" cy="28" rx="3" ry="5" fill="#C4B5FD" transform="rotate(15 56 28)"/>
    <path d="M40 22 L41.5 26 L46 26 L42.5 28.5 L44 33 L40 30 L36 33 L37.5 28.5 L34 26 L38.5 26 Z" fill="#FCD34D"/>
    <ellipse cx="18" cy="50" rx="5" ry="8" fill="#5B2D9E" transform="rotate(20 18 50)"/>
    <ellipse cx="62" cy="50" rx="5" ry="8" fill="#5B2D9E" transform="rotate(-20 62 50)"/>
    <ellipse cx="40" cy="52" rx="12" ry="10" fill="#C4B5FD" opacity="0.5"/>
  </svg>
);

// ── Stat Card ──
const StatCard = ({ icon, label, value, sub, color, isDark }) => (
  <div style={{
    background: isDark ? '#1A1535' : '#FFFFFF',
    border: `1px solid ${isDark ? '#2A2550' : '#EDE9FE'}`,
    borderRadius: 20,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
    transition: 'all 0.3s',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: isDark ? '#7C6FD0' : '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </span>
    </div>
    <p style={{ fontSize: 28, fontWeight: 900, color: isDark ? '#E8E0FF' : '#111827', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {value}
    </p>
    {sub && (
      <p style={{ fontSize: 11, color: isDark ? '#7C6FD0' : '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {sub}
      </p>
    )}
  </div>
);

// ── Weekly activity bar ──
const ActivityBar = ({ day, points, maxPoints, isDark }) => {
  const pct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#7C6FD0' : '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {points}
      </span>
      <div style={{ width: '100%', height: 80, background: isDark ? 'rgba(255,255,255,0.05)' : '#F5F3FF', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: `${pct}%`,
          background: 'linear-gradient(180deg,#7C3AED,#4F46E5)',
          borderRadius: 8,
          transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#7C6FD0' : '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {day}
      </span>
    </div>
  );
};

// ── Edit Modal ──
const EditModal = ({ user, onSave, onClose, isDark }) => {
  const [form, setForm] = useState({
    name: user?.name ?? '',
    college: user?.college ?? '',
    bio: user?.bio ?? '',
    goals: user?.goals ?? [],
  });
  const goalOptions = [
    'Get internships 💼', 'Build my network 🤝',
    'Develop leadership 👑', 'Learn marketing 📣',
    'Make real impact 🌍', 'Earn rewards 🎁',
  ];

  const toggleGoal = (g) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g],
    }));
  };

  const F = "'Plus Jakarta Sans', sans-serif";
  const bg   = isDark ? '#13112B' : '#FFFFFF';
  const card = isDark ? '#1A1535' : '#F5F3FF';
  const text = isDark ? '#E8E0FF' : '#111827';
  const sub  = isDark ? '#7C6FD0' : '#9CA3AF';
  const bdr  = isDark ? '#2A2550' : '#EDE9FE';
  const inp  = isDark ? '#0F0D25' : '#FFFFFF';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div style={{
        background: bg, borderRadius: 24, padding: 32, width: 480, maxWidth: '90vw',
        border: `1px solid ${bdr}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: text, fontFamily: F, marginBottom: 24 }}>
          Edit Profile
        </h2>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>Name</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{
              width: '100%', marginTop: 6, padding: '10px 14px', borderRadius: 12,
              background: inp, border: `1px solid ${bdr}`, color: text,
              fontFamily: F, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* College */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>College</label>
          <input
            value={form.college}
            onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
            style={{
              width: '100%', marginTop: 6, padding: '10px 14px', borderRadius: 12,
              background: inp, border: `1px solid ${bdr}`, color: text,
              fontFamily: F, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            placeholder="Tell everyone about yourself..."
            style={{
              width: '100%', marginTop: 6, padding: '10px 14px', borderRadius: 12,
              background: inp, border: `1px solid ${bdr}`, color: text,
              fontFamily: F, fontSize: 14, fontWeight: 600, outline: 'none',
              resize: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Goals */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>Goals</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {goalOptions.map(g => {
              const active = form.goals.includes(g);
              return (
                <button key={g} onClick={() => toggleGoal(g)}
                  style={{
                    padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                    fontFamily: F, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                    background: active ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : card,
                    color: active ? 'white' : sub,
                    boxShadow: active ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                  }}>
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: 14, fontFamily: F, fontSize: 14, fontWeight: 700,
              background: card, color: sub, border: `1px solid ${bdr}`, cursor: 'pointer',
            }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)}
            style={{
              flex: 1, padding: '12px', borderRadius: 14, fontFamily: F, fontSize: 14, fontWeight: 700,
              background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: 'white',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
            }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
export default function AmbassadorProfile() {
  const navigate     = useNavigate();
  const { user, updateUser } = useAuth();
  const { getCurrentAmbassador, getLeaderboard, weeklyActivity } = useData();

  const [isDark, setIsDark] = useState(
    localStorage.getItem('astraliq-theme') === 'dark'
  );
  const [showEdit, setShowEdit]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [activeTab, setActiveTab]   = useState('overview'); // overview | badges | activity

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('astraliq-theme') === 'dark');
    window.addEventListener('astraliq-theme-change', handler);
    return () => window.removeEventListener('astraliq-theme-change', handler);
  }, []);

  const amb     = getCurrentAmbassador(user?.id) ?? user;
  const level   = getLevelFromPoints(amb?.points ?? 0);
  const board   = getLeaderboard();
  const myRank  = board.findIndex(a => a.id === user?.id) + 1;

  // XP progress within current level
  const currentLevel = LEVELS.find(l => (amb?.points ?? 0) >= l.min && (amb?.points ?? 0) <= l.max) ?? LEVELS[0];
  const nextLevel    = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const xpInLevel    = (amb?.points ?? 0) - currentLevel.min;
  const xpNeeded     = nextLevel ? nextLevel.min - currentLevel.min : 1;
  const xpPct        = Math.min((xpInLevel / xpNeeded) * 100, 100);

  // Earned badges
  const earnedBadges  = BADGES.filter(b => (amb?.badges ?? []).includes(b.id));
  const lockedBadges  = BADGES.filter(b => !(amb?.badges ?? []).includes(b.id));

  // Weekly activity
  const maxPts = Math.max(...(weeklyActivity ?? []).map(d => d.points), 1);

  // Join date
  const joinDate = amb?.joinedDate
    ? new Date(amb.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Jan 2026';

  // Referral link
  const refLink = `https://astraliq.com/join?ref=${user?.id ?? 'AMB001'}`;
  const copyRef = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (form) => {
    updateUser(form);
    setShowEdit(false);
  };

  const F   = "'Plus Jakarta Sans', sans-serif";
  const bg  = isDark ? '#0F0D25' : '#F8F7FF';
  const card = isDark ? '#1A1535' : '#FFFFFF';
  const text = isDark ? '#E8E0FF' : '#111827';
  const sub  = isDark ? '#7C6FD0' : '#9CA3AF';
  const bdr  = isDark ? '#2A2550' : '#EDE9FE';

  const Tab = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)}
      style={{
        padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
        fontFamily: F, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
        background: activeTab === id ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'transparent',
        color: activeTab === id ? 'white' : sub,
        boxShadow: activeTab === id ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
      }}>
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, transition: 'background 0.4s' }}>
      <AmbassadorNav isDark={isDark} />

      {/* ── Main ── */}
      <main style={{ marginLeft: 224, flex: 1, padding: '32px 32px 48px', fontFamily: F }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: text, lineHeight: 1.2 }}>My Profile</h1>
          <p style={{ fontSize: 13, color: sub, marginTop: 4 }}>Manage your ambassador identity</p>
        </div>

        {/* ── Hero Card ── */}
        <div style={{
          background: 'linear-gradient(135deg,#1E1A3E 0%,#2D1B69 50%,#1E1A3E 100%)',
          borderRadius: 28, padding: '32px 36px',
          display: 'flex', alignItems: 'center', gap: 32,
          marginBottom: 24,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(79,70,229,0.3)',
        }}>
          {/* BG stars */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              borderRadius: '50%',
              background: 'white',
              opacity: Math.random() * 0.5 + 0.1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }} />
          ))}

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(255,255,255,0.15), 0 8px 32px rgba(79,70,229,0.5)',
            }}>
              <Mascot size={70} />
            </div>
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: 6, right: 6,
              width: 16, height: 16, borderRadius: '50%',
              background: '#10B981', border: '3px solid #1E1A3E',
            }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', fontFamily: F }}>
                {amb?.name ?? 'Ambassador'}
              </h2>
              <span style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#C4B5FD', fontSize: 12, fontWeight: 700,
                padding: '3px 10px', borderRadius: 99, fontFamily: F,
              }}>
                {level.emoji} {level.name}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#C4B5FD', marginTop: 2, fontFamily: F }}>
              {amb?.college ?? 'My College'}
            </p>
            {amb?.bio && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontFamily: F, maxWidth: 480 }}>
                {amb.bio}
              </p>
            )}

            {/* XP Bar */}
            <div style={{ marginTop: 14, maxWidth: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#C4B5FD', fontFamily: F }}>
                  {amb?.points ?? 0} XP
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontFamily: F }}>
                  {nextLevel ? `${nextLevel.min} XP for ${nextLevel.name}` : 'MAX LEVEL'}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.12)' }}>
                <div style={{
                  height: 8, borderRadius: 99, width: `${xpPct}%`,
                  background: 'linear-gradient(90deg,#818CF8,#C4B5FD)',
                  boxShadow: '0 0 10px rgba(196,181,253,0.6)',
                  transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>

            {/* Goals */}
            {(amb?.goals ?? []).length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {(amb?.goals ?? []).map(g => (
                  <span key={g} style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 99, fontFamily: F,
                  }}>
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Edit button */}
          <button onClick={() => setShowEdit(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)', color: 'white',
              fontFamily: F, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              backdropFilter: 'blur(8px)', flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            <EditIcon /> Edit Profile
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24,
        }}>
          <StatCard isDark={isDark} icon={<StarIcon />} label="Total XP" value={`${amb?.points ?? 0}`} sub="points earned" color="#7C3AED" />
          <StatCard isDark={isDark} icon={<TrophyIcon />} label="Global Rank" value={`#${myRank || '—'}`} sub="of all ambassadors" color="#F59E0B" />
          <StatCard isDark={isDark} icon={<FireIcon />} label="Streak" value={`${amb?.streak ?? 0}d`} sub="days in a row" color="#EF4444" />
          <StatCard isDark={isDark} icon={<CheckIcon />} label="Tasks Done" value={amb?.tasksCompleted ?? 0} sub="completed tasks" color="#10B981" />
        </div>

        {/* ── Referral Card ── */}
        <div style={{
          background: card, border: `1px solid ${bdr}`, borderRadius: 20,
          padding: '20px 24px', marginBottom: 24,
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <ShareIcon />
              <span style={{ fontSize: 13, fontWeight: 900, color: text, fontFamily: F }}>Your Referral Link</span>
            </div>
            <p style={{ fontSize: 12, color: sub, fontFamily: F }}>Share this link to earn bonus XP for every friend who joins!</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: isDark ? '#0F0D25' : '#F5F3FF',
            border: `1px solid ${bdr}`, borderRadius: 12, padding: '10px 14px',
            flex: 2, minWidth: 240,
          }}>
            <span style={{ fontSize: 12, color: sub, fontFamily: F, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {refLink}
            </span>
            <button onClick={copyRef}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 12, fontWeight: 700,
                background: copied ? '#10B981' : 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                color: 'white', transition: 'all 0.2s', flexShrink: 0,
              }}>
              <CopyIcon />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 20,
          background: isDark ? '#1A1535' : '#F5F3FF',
          borderRadius: 14, padding: 4, width: 'fit-content',
          border: `1px solid ${bdr}`,
        }}>
          <Tab id="overview" label="Overview" />
          <Tab id="badges"   label={`Badges (${earnedBadges.length}/${BADGES.length})`} />
          <Tab id="activity" label="Activity" />
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Join info */}
            <div style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 20,
              padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 16 }}>
                Ambassador Details
              </h3>
              {[
                { label: 'Joined', value: joinDate, icon: <CalendarIcon /> },
                { label: 'Ambassador ID', value: user?.id ?? 'AMB001', icon: <TargetIcon /> },
                { label: 'Level', value: `${level.emoji} ${level.name}`, icon: <TrophyIcon /> },
                { label: 'Status', value: '🟢 Active', icon: <FireIcon /> },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: `1px solid ${bdr}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: sub }}>
                    {icon}
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: F }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: F }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Top badges preview */}
            <div style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 20,
              padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F }}>Recent Badges</h3>
                <button onClick={() => setActiveTab('badges')}
                  style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F }}>
                  View all →
                </button>
              </div>
              {earnedBadges.length === 0 ? (
                <p style={{ fontSize: 13, color: sub, fontFamily: F }}>No badges yet. Complete tasks to earn your first badge! 🚀</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {earnedBadges.slice(0, 6).map(b => (
                    <div key={b.id} style={{
                      background: isDark ? '#0F0D25' : '#F5F3FF',
                      border: `1px solid ${b.rarityColor}30`,
                      borderRadius: 14, padding: 12,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 24 }}>{b.emoji}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: text, fontFamily: F, textAlign: 'center' }}>{b.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: b.rarityColor, fontFamily: F }}>{b.rarity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Goals */}
            <div style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 20,
              padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
              gridColumn: '1 / -1',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 16 }}>My Goals</h3>
              {(amb?.goals ?? []).length === 0 ? (
                <p style={{ fontSize: 13, color: sub, fontFamily: F }}>No goals set yet. Edit your profile to add some! ✨</p>
              ) : (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {(amb?.goals ?? []).map(g => (
                    <div key={g} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'linear-gradient(135deg,rgba(79,70,229,0.1),rgba(124,58,237,0.1))',
                      border: '1px solid rgba(124,58,237,0.2)',
                      padding: '10px 16px', borderRadius: 12,
                    }}>
                      <span style={{ fontSize: 16 }}>{g.split(' ').slice(-1)[0]}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: F }}>
                        {g.replace(/\s[\S]+$/, '')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Badges ── */}
        {activeTab === 'badges' && (
          <div>
            {/* Earned */}
            <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 14 }}>
              ✅ Earned ({earnedBadges.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
              {earnedBadges.map(b => (
                <div key={b.id} style={{
                  background: card, border: `2px solid ${b.rarityColor}40`,
                  borderRadius: 20, padding: '20px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  boxShadow: `0 4px 20px ${b.rarityColor}20`,
                }}>
                  <span style={{ fontSize: 36 }}>{b.emoji}</span>
                  <p style={{ fontSize: 13, fontWeight: 900, color: text, fontFamily: F, textAlign: 'center' }}>{b.name}</p>
                  <p style={{ fontSize: 11, color: sub, fontFamily: F, textAlign: 'center' }}>{b.description}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: b.rarityColor, fontFamily: F,
                    background: `${b.rarityColor}15`, padding: '3px 10px', borderRadius: 99,
                  }}>
                    {b.rarity}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', fontFamily: F }}>+{b.points} XP</span>
                </div>
              ))}
            </div>

            {/* Locked */}
            {lockedBadges.length > 0 && (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 14 }}>
                  🔒 Locked ({lockedBadges.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                  {lockedBadges.map(b => (
                    <div key={b.id} style={{
                      background: isDark ? '#1A1535' : '#F5F3FF', border: `1px solid ${bdr}`,
                      borderRadius: 20, padding: '20px 16px', opacity: 0.6,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      filter: 'grayscale(0.5)',
                    }}>
                      <span style={{ fontSize: 36, filter: 'grayscale(1)' }}>{b.emoji}</span>
                      <p style={{ fontSize: 13, fontWeight: 900, color: text, fontFamily: F, textAlign: 'center' }}>{b.name}</p>
                      <p style={{ fontSize: 11, color: sub, fontFamily: F, textAlign: 'center' }}>{b.condition}</p>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sub, fontFamily: F }}>
                        {b.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Activity ── */}
        {activeTab === 'activity' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Weekly XP chart */}
            <div style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 20,
              padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
              gridColumn: '1 / -1',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 20 }}>
                Weekly XP Activity
              </h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
                {(weeklyActivity ?? []).map(d => (
                  <ActivityBar key={d.day} day={d.day} points={d.points} maxPoints={maxPts} isDark={isDark} />
                ))}
              </div>
            </div>

            {/* Leaderboard position */}
            <div style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 20,
              padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 16 }}>
                Leaderboard Position
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {board.slice(0, 5).map((a, i) => {
                  const isMe = a.id === user?.id;
                  return (
                    <div key={a.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 12,
                      background: isMe
                        ? 'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.15))'
                        : 'transparent',
                      border: isMe ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                    }}>
                      <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: isMe ? 900 : 600, color: text, fontFamily: F, flex: 1 }}>
                        {a.name} {isMe && '(You)'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', fontFamily: F }}>
                        {a.points} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level progress */}
            <div style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 20,
              padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(124,58,237,0.06)',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, color: text, fontFamily: F, marginBottom: 16 }}>
                Level Progress
              </h3>
              {LEVELS.map((lv, i) => {
                const reached  = (amb?.points ?? 0) >= lv.min;
                const isCurrent = (amb?.points ?? 0) >= lv.min && (amb?.points ?? 0) <= lv.max;
                const pct = isCurrent ? xpPct : reached ? 100 : 0;
                return (
                  <div key={lv.name} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isCurrent ? text : sub, fontFamily: F }}>
                        {lv.emoji} {lv.name}
                        {isCurrent && <span style={{ color: '#7C3AED' }}> ← You're here</span>}
                      </span>
                      <span style={{ fontSize: 11, color: sub, fontFamily: F }}>{lv.min} XP</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#F5F3FF' }}>
                      <div style={{
                        height: 6, borderRadius: 99, width: `${pct}%`,
                        background: reached ? `linear-gradient(90deg,${lv.color},${lv.color}AA)` : 'transparent',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Edit Modal ── */}
      {showEdit && (
        <EditModal user={amb} onSave={handleSave} onClose={() => setShowEdit(false)} isDark={isDark} />
      )}
    </div>
  );
}