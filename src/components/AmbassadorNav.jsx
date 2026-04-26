import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLevelFromPoints } from '../utils/gameEngine';
import { useState, useEffect } from 'react';

const HomeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const TaskIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>;
const TrophyIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 2h12v6c0 3.31-2.69 6-6 6S6 11.31 6 8V2zM4 4H2v4c0 1.66 1.34 3 3 3v1H4v2h16v-2h-1V11c1.66 0 3-1.34 3-3V4h-2v4c0 .55-.45 1-1 1V4zM8 19h8l1 3H7l1-3z"/></svg>;
const BadgeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm-1 2h2v2l3 1-4 7-4-7 3-1v-2z"/></svg>;
const GiftIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 6h-2.18c.07-.31.18-.62.18-.96C18 3.36 16.64 2 15.04 2c-.85 0-1.62.37-2.17.96L12 3.89l-.87-.93C10.58 2.37 9.81 2 8.96 2 7.36 2 6 3.36 6 4.96c0 .34.11.65.18.96H4c-1.1 0-2 .9-2 2v3c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-1.1-.9-2-2-2zm-5-.04c0-.52.44-.96.96-.96s.96.44.96.96-.44.96-.96.96h-1.3l.34-.96zm-7.04-.92c.52 0 .96.44.96.96l.34.96H7.04c-.52 0-.96-.44-.96-.96s.44-.96.96-.96zM4 19c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7H4v7z"/></svg>;
const BotIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7 17v-2H6v-1.46C4.72 13.23 4 12.17 4 11c0-1.17.72-2.23 2-2.54V7h12v1.46c1.28.31 2 1.37 2 2.54 0 1.17-.72 2.23-2 2.54V15h-1v2H7zm5-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const LogoutIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;

const Mascot = ({ isDark }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <ellipse cx="40" cy="48" rx="22" ry="20" fill={isDark ? '#3B1F6E' : '#7C3AED'}/>
    <ellipse cx="40" cy="46" rx="19" ry="17" fill={isDark ? '#5B2D9E' : '#8B5CF6'}/>
    <ellipse cx="40" cy="38" rx="16" ry="15" fill={isDark ? '#7C3AED' : '#A78BFA'}/>
    <ellipse cx="34" cy="36" rx="4" ry="4.5" fill="white"/>
    <ellipse cx="46" cy="36" rx="4" ry="4.5" fill="white"/>
    <circle cx="35" cy="37" r="2.5" fill="#1E1B4B"/>
    <circle cx="47" cy="37" r="2.5" fill="#1E1B4B"/>
    <circle cx="36" cy="36" r="1" fill="white"/>
    <circle cx="48" cy="36" r="1" fill="white"/>
    <ellipse cx="30" cy="42" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.6"/>
    <ellipse cx="50" cy="42" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.6"/>
    <path d="M34 44 Q40 50 46 44" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <ellipse cx="24" cy="28" rx="5" ry="7" fill={isDark ? '#3B1F6E' : '#7C3AED'} transform="rotate(-15 24 28)"/>
    <ellipse cx="56" cy="28" rx="5" ry="7" fill={isDark ? '#3B1F6E' : '#7C3AED'} transform="rotate(15 56 28)"/>
    <ellipse cx="24" cy="28" rx="3" ry="5" fill="#C4B5FD" transform="rotate(-15 24 28)"/>
    <ellipse cx="56" cy="28" rx="3" ry="5" fill="#C4B5FD" transform="rotate(15 56 28)"/>
    <path d="M40 22 L41.5 26 L46 26 L42.5 28.5 L44 33 L40 30 L36 33 L37.5 28.5 L34 26 L38.5 26 Z" fill="#FCD34D"/>
    <ellipse cx="18" cy="50" rx="5" ry="8" fill={isDark ? '#5B2D9E' : '#8B5CF6'} transform="rotate(20 18 50)"/>
    <ellipse cx="62" cy="50" rx="5" ry="8" fill={isDark ? '#5B2D9E' : '#8B5CF6'} transform="rotate(-20 62 50)"/>
    <ellipse cx="40" cy="52" rx="12" ry="10" fill="#C4B5FD" opacity="0.5"/>
  </svg>
);

const navSections = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', Icon: HomeIcon, path: '/ambassador/dashboard' },
      { label: 'Tasks', Icon: TaskIcon, path: '/ambassador/tasks' },
      { label: 'Leaderboard', Icon: TrophyIcon, path: '/ambassador/leaderboard' },
    ]
  },
  {
    label: 'REWARDS',
    items: [
      { label: 'Badges', Icon: BadgeIcon, path: '/ambassador/badges' },
      { label: 'Rewards', Icon: GiftIcon, path: '/ambassador/rewards' },
    ]
  },
  {
    label: 'ACCOUNT',
    items: [
      { label: 'AI Coach', Icon: BotIcon, path: '/ambassador/ai-coach' },
      { label: 'Profile', Icon: UserIcon, path: '/ambassador/profile' },
    ]
  }
];

export default function AmbassadorNav({ isDark: isDarkProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const level = getLevelFromPoints(user?.points ?? 0);

  // Sync with prop + listen for toggle events fired from dashboard
  const [isDark, setIsDark] = useState(
    isDarkProp ?? localStorage.getItem('astraliq-theme') === 'dark'
  );

  useEffect(() => {
    setIsDark(isDarkProp ?? localStorage.getItem('astraliq-theme') === 'dark');
  }, [isDarkProp]);

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('astraliq-theme') === 'dark');
    window.addEventListener('astraliq-theme-change', handler);
    return () => window.removeEventListener('astraliq-theme-change', handler);
  }, []);

  const F = "'Plus Jakarta Sans', sans-serif";

  // ── Dark/Light tokens ──
  const n = {
    bg:           isDark ? '#13112B' : '#FFFFFF',
    border:       isDark ? '#2A2550' : '#EDE9FE',
    shadow:       isDark ? '4px 0 30px rgba(0,0,0,0.4)' : '4px 0 30px rgba(124,58,237,0.06)',
    logoText:     isDark ? '#E8E0FF' : '#111827',
    logoSub:      isDark ? '#7C6FD0' : '#A78BFA',
    profileBg:    isDark ? 'linear-gradient(135deg,#1E1A3E,#2D1B69)' : 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
    profileName:  isDark ? '#E8E0FF' : '#111827',
    profileSub:   isDark ? '#7C6FD0' : '#A78BFA',
    xpBarBg:      isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
    xpText:       isDark ? '#6D5ED6' : '#C4B5FD',
    sectionLabel: isDark ? '#3D3570' : '#D1D5DB',
    navInactive:  isDark ? '#6D5ED6' : '#6B7280',
    navHoverBg:   isDark ? '#1E1A3E' : '#F5F3FF',
    navHoverColor:isDark ? '#C4B5FD' : '#4F46E5',
    divider:      isDark ? '#1E1A3E' : '#F5F3FF',
    logoutColor:  isDark ? '#6D5ED6' : '#9CA3AF',
    logoutHoverBg:isDark ? '#2D1B1B' : '#FFF1F2',
    logoutHoverColor: isDark ? '#F87171' : '#EF4444',
  };

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, height: '100vh', width: 224,
        display: 'flex', flexDirection: 'column', zIndex: 50, overflowY: 'auto',
        background: n.bg,
        borderRight: `1px solid ${n.border}`,
        boxShadow: n.shadow,
        fontFamily: F,
        transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
      }}>

      {/* ── Logo ── */}
      <div style={{ padding: '24px 20px 16px', borderBottom: `1px solid ${n.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 15,
            background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
          }}>A</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 900, color: n.logoText, lineHeight: 1, fontFamily: F }}>
              AstralIQ
            </p>
            <p style={{ fontSize: 10, fontWeight: 600, color: n.logoSub, fontFamily: F }}>
              Ambassador
            </p>
          </div>
        </div>
      </div>

      {/* ── Profile block ── */}
      <div style={{
        margin: '12px 12px 8px', padding: 16, borderRadius: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: n.profileBg,
        transition: 'background 0.4s',
      }}>
        <Mascot isDark={isDark} />
        <p style={{ fontSize: 13, fontWeight: 900, color: n.profileName, marginTop: 4,
          lineHeight: 1.3, fontFamily: F }}>
          {user?.name ?? 'Ambassador'}
        </p>
        <p style={{ fontSize: 10, fontWeight: 600, color: n.profileSub, fontFamily: F,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
          {user?.college ?? 'My College'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ fontSize: 14 }}>{level.emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#7C6FD0', fontFamily: F }}>
            {level.name}
          </span>
        </div>
        {/* XP bar */}
        <div style={{ width: '100%', marginTop: 8, height: 6, borderRadius: 99,
          background: n.xpBarBg }}>
          <div style={{
            height: 6, borderRadius: 99, width: '45%',
            background: 'linear-gradient(90deg,#4F46E5,#7C3AED)',
            boxShadow: '0 0 8px rgba(79,70,229,0.5)',
          }} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, color: n.xpText, marginTop: 4, fontFamily: F }}>
          {user?.points ?? 0} XP
        </p>
      </div>

      {/* ── Nav sections ── */}
      <div style={{ flex: 1, padding: '8px 12px' }}>
        {navSections.map(section => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 9, fontWeight: 900, color: n.sectionLabel,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              padding: '0 12px', marginBottom: 6, fontFamily: F,
              transition: 'color 0.4s',
            }}>
              {section.label}
            </p>
            {section.items.map(({ label, Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button key={path} onClick={() => navigate(path)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12, marginBottom: 2,
                    border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: F,
                    background: active
                      ? 'linear-gradient(135deg,#4F46E5,#7C3AED)'
                      : 'transparent',
                    color: active ? 'white' : n.navInactive,
                    boxShadow: active ? '0 4px 14px rgba(79,70,229,0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = n.navHoverBg;
                      e.currentTarget.style.color = n.navHoverColor;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = n.navInactive;
                    }
                  }}>
                  <Icon />
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Logout ── */}
      <div style={{ padding: '12px 12px 20px', borderTop: `1px solid ${n.divider}` }}>
        <button
          onClick={() => { logout(); navigate('/'); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
            textAlign: 'left', background: 'transparent', color: n.logoutColor,
            fontFamily: F, transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = n.logoutHoverBg;
            e.currentTarget.style.color = n.logoutHoverColor;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = n.logoutColor;
          }}>
          <LogoutIcon />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>Sign out</span>
        </button>
      </div>
    </aside>
  );
}