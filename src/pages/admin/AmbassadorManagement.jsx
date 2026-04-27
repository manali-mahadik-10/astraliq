import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BADGES } from '../../data/mockData';

// ── Styles ──────────────────────────────────────────────────────
const getStyles = (isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-3px); }
  }
  @keyframes barGrow {
    from { width: 0%; }
  }

  .af  { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .af1 { animation-delay: 0.04s; } .af2 { animation-delay: 0.10s; }
  .af3 { animation-delay: 0.16s; } .af4 { animation-delay: 0.22s; }
  .af5 { animation-delay: 0.28s; } .af6 { animation-delay: 0.34s; }
  .af7 { animation-delay: 0.40s; } .af8 { animation-delay: 0.46s; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 13px; border-radius: 10px; width: 100%;
    border: none; cursor: pointer; text-align: left;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
    transition: all 0.22s cubic-bezier(0.16,1,0.3,1); background: transparent;
    color: ${isDark ? '#4B4280' : '#9CA3AF'};
    position: relative; overflow: hidden;
  }
  .nav-item::before {
    content: ''; position: absolute; inset: 0; opacity: 0;
    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
    transition: opacity 0.2s;
  }
  .nav-item:hover::before { opacity: 1; }
  .nav-item:hover { color: ${isDark ? '#C4B5FD' : '#6366F1'}; transform: translateX(2px); }
  .nav-item.active {
    background: linear-gradient(135deg,#4F46E5,#7C3AED);
    color: white !important; transform: translateX(0);
    box-shadow: 0 6px 20px rgba(79,70,229,0.4);
  }
  .nav-item.active::before { opacity: 0; }

  .amb-card {
    background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)'};
    border-radius: 16px; padding: 18px;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    cursor: pointer; transform-style: preserve-3d; position: relative;
    backdrop-filter: blur(8px);
  }
  .amb-card:hover {
    transform: translateY(-6px) rotateX(2deg) rotateY(-1deg) scale(1.02);
    border-color: ${isDark ? 'rgba(196,181,253,0.25)' : 'rgba(99,102,241,0.3)'};
    box-shadow: ${isDark ? '0 24px 48px rgba(0,0,0,0.4)' : '0 24px 48px rgba(99,102,241,0.15)'};
    z-index: 2;
  }
  .amb-card.selected {
    border-color: #4F46E5;
    box-shadow: 0 0 0 2px rgba(79,70,229,0.3), 0 16px 40px rgba(79,70,229,0.2);
    transform: translateY(-3px);
  }

  .detail-panel {
    animation: slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }

  .btn {
    padding: 9px 20px; border-radius: 10px; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.04em; text-transform: uppercase;
    transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  .btn-primary {
    background: linear-gradient(135deg,#4F46E5,#7C3AED);
    color: white; box-shadow: 0 4px 16px rgba(79,70,229,0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,70,229,0.5); }
  .btn-ghost {
    background: ${isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)'};
    color: ${isDark ? '#7C6FD0' : '#6366F1'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.15)' : 'rgba(99,102,241,0.2)'};
  }
  .btn-ghost:hover {
    background: ${isDark ? 'rgba(196,181,253,0.14)' : 'rgba(99,102,241,0.14)'};
    transform: translateY(-1px);
  }

  .filter-chip {
    padding: 6px 14px; border-radius: 99px; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700;
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1); letter-spacing: 0.04em;
  }
  .filter-chip.active {
    background: linear-gradient(135deg,#4F46E5,#7C3AED);
    color: white; box-shadow: 0 4px 12px rgba(79,70,229,0.35);
    transform: translateY(-1px);
  }
  .filter-chip.inactive {
    background: ${isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)'};
    color: ${isDark ? '#7C6FD0' : '#6366F1'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.12)' : 'rgba(99,102,241,0.15)'};
  }
  .filter-chip.inactive:hover {
    background: ${isDark ? 'rgba(196,181,253,0.13)' : 'rgba(99,102,241,0.13)'};
    transform: translateY(-1px);
  }

  .search-input {
    width: 100%; padding: 10px 14px 10px 38px;
    background: ${isDark ? 'rgba(196,181,253,0.05)' : 'rgba(99,102,241,0.05)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.12)' : 'rgba(99,102,241,0.15)'};
    border-radius: 12px; outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: ${isDark ? '#E8E0FF' : '#1E1B4B'};
    transition: all 0.2s;
  }
  .search-input::placeholder { color: ${isDark ? '#4B4280' : '#9CA3AF'}; }
  .search-input:focus {
    border-color: rgba(79,70,229,0.5);
    box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    background: ${isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)'};
  }

  .stat-pill {
    background: ${isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)'};
    border: 1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.15)'};
    border-radius: 12px; padding: 14px 18px; text-align: center;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .stat-pill:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: ${isDark ? '0 12px 24px rgba(0,0,0,0.3)' : '0 12px 24px rgba(99,102,241,0.12)'};
  }

  .bar-fill { animation: barGrow 1s cubic-bezier(0.34,1.56,0.64,1) both; }

  .toggle-track {
    width: 46px; height: 24px; border-radius: 99px;
    position: relative; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    border: none; padding: 0;
    background: ${isDark ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'rgba(196,181,253,0.3)'};
    box-shadow: ${isDark ? '0 0 16px rgba(99,102,241,0.4)' : 'none'};
  }
  .toggle-thumb {
    position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%;
    background: white; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    left: ${isDark ? '25px' : '3px'}; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`;

// ── Icons ────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, style = {} }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size, flexShrink: 0, ...style }}>
    <path d={d} />
  </svg>
);
const ICONS = {
  dashboard:   'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  ambassadors: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  tasks:       'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  analytics:   'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  insights:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
  logout:      'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
  search:      'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  star:        'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  fire:        'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z',
  close:       'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  trophy:      'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H8v2h8v-2h-3v-2.1c1.98-.5 3.5-2.08 3.87-4.06C19.14 11.55 21 9.45 21 7V6c0-1.1-.9-1-2-1zM7 11.7C5.84 11.37 5 10.28 5 9V7h2v4.7zM19 9c0 1.28-.84 2.37-2 2.7V7h2v2z',
  sun:         'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .38-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.38-.39-1.02-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.39-.38-1.03-.39-1.41 0z',
  moon:        'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
  chevron:     'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  sort:        'M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z',
  grid:        'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  list:        'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z',
};

const LEVEL_COLORS = {
  Bronze:   '#CD7F32',
  Silver:   '#9CA3AF',
  Gold:     '#F59E0B',
  Platinum: '#6366F1',
  Legend:   '#7C3AED',
};

// ── Admin Nav (shared) ───────────────────────────────────────────
const AdminNav = ({ isDark, onToggle }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const F = "'Plus Jakarta Sans', sans-serif";
  const br = isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.1)';
  const text = isDark ? '#E8E0FF' : '#1E1B4B';

  const navItems = [
    { label: 'Dashboard',   path: '/admin/dashboard',   icon: ICONS.dashboard },
    { label: 'Ambassadors', path: '/admin/ambassadors', icon: ICONS.ambassadors },
    { label: 'Tasks',       path: '/admin/tasks',       icon: ICONS.tasks },
    { label: 'Analytics',   path: '/admin/analytics',   icon: ICONS.analytics },
    { label: 'AI Insights', path: '/admin/ai-insights', icon: ICONS.insights },
  ];

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: 224,
      background: isDark ? '#0D0B1F' : '#FAFAFA',
      borderRight: `1px solid ${br}`,
      display: 'flex', flexDirection: 'column', zIndex: 50,
      boxShadow: isDark ? '4px 0 40px rgba(0,0,0,0.6)' : '4px 0 30px rgba(99,102,241,0.08)',
      transition: 'background 0.4s',
    }}>
      <div style={{ padding: '22px 18px 16px', borderBottom: `1px solid ${br}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900, fontSize: 16, color: 'white', boxShadow: '0 4px 16px rgba(79,70,229,0.45)' }}>A</div>
          <div>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: text, lineHeight: 1 }}>AstralIQ</p>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: isDark ? '#4B4280' : '#9CA3AF', lineHeight: 1, marginTop: 2 }}>Admin Console</p>
          </div>
        </div>
      </div>
      <div style={{ margin: '12px 12px 4px', padding: '12px 14px', borderRadius: 14, background: isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)', border: `1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.15)'}` }}>
        <p style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: isDark ? '#C4B5FD' : '#4F46E5', lineHeight: 1 }}>{user?.name ?? 'Admin'}</p>
        <p style={{ fontFamily: F, fontSize: 10, color: isDark ? '#4B4280' : '#9CA3AF', marginTop: 3 }}>Organization Admin</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: F, fontSize: 10, color: '#10B981', fontWeight: 700 }}>System Online</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: '6px 8px', overflowY: 'auto' }}>
        <p style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: isDark ? '#2D2660' : '#C4B5FD', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 5px 6px', marginBottom: 2 }}>Navigation</p>
        {navItems.map(({ label, path, icon }) => {
          const active = location.pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)} className={`nav-item${active ? ' active' : ''}`} style={{ marginBottom: 2 }}>
              <Icon d={icon} size={15} />
              <span>{label}</span>
              {active && <Icon d={ICONS.chevron} size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ padding: '10px 8px 20px', borderTop: `1px solid ${br}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 5px', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={isDark ? ICONS.moon : ICONS.sun} size={14} style={{ color: isDark ? '#818CF8' : '#F59E0B' }} />
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: isDark ? '#7C6FD0' : '#9CA3AF' }}>{isDark ? 'Dark' : 'Light'}</span>
          </div>
          <button className="toggle-track" onClick={onToggle}><div className="toggle-thumb" /></button>
        </div>
        <button className="nav-item" onClick={() => { logout(); navigate('/'); }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#4B4280' : '#9CA3AF'; }}>
          <Icon d={ICONS.logout} size={15} /><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

// ── Ambassador Detail Panel ──────────────────────────────────────
const DetailPanel = ({ amb, isDark, onClose }) => {
  if (!amb) return null;
  const F  = "'Plus Jakarta Sans', sans-serif";
  const bg = isDark ? '#0D0B1F' : '#FAFAFA';
  const br = isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)';
  const tp = isDark ? '#E8E0FF' : '#1E1B4B';
  const ts = isDark ? '#4B4280' : '#9CA3AF';
  const lc = LEVEL_COLORS[amb.level] ?? '#818CF8';

  const ambBadges = BADGES.filter(b => amb.badges.includes(b.id));

  return (
    <div className="detail-panel" style={{
      width: 320, flexShrink: 0,
      background: bg,
      borderLeft: `1px solid ${br}`,
      height: '100vh', position: 'sticky', top: 0,
      overflowY: 'auto', padding: '24px 20px',
      boxShadow: isDark ? '-8px 0 40px rgba(0,0,0,0.4)' : '-8px 0 30px rgba(99,102,241,0.08)',
    }}>
      {/* Close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Ambassador Profile</span>
        <button onClick={onClose} style={{ background: isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ts, transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
          onMouseLeave={e => e.currentTarget.style.color = ts}>
          <Icon d={ICONS.close} size={16} />
        </button>
      </div>

      {/* Avatar + name */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
          background: `linear-gradient(135deg, ${lc}30, ${lc}15)`,
          border: `2px solid ${lc}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F, fontSize: 28, fontWeight: 800, color: lc,
          boxShadow: `0 0 30px ${lc}30`,
        }}>
          {amb.name.charAt(0)}
        </div>
        <h2 style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: tp, marginBottom: 4 }}>{amb.name}</h2>
        <p style={{ fontFamily: F, fontSize: 12, color: ts }}>{amb.college}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '4px 12px', borderRadius: 99, background: `${lc}18`, border: `1px solid ${lc}30` }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: amb.active ? '#10B981' : '#6B7280' }} />
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: lc }}>{amb.level}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total XP',   value: amb.points.toLocaleString(), color: '#818CF8' },
          { label: 'Tasks Done', value: amb.tasksCompleted,          color: '#10B981' },
          { label: 'Streak',     value: `${amb.streak}d`,            color: '#F59E0B' },
          { label: 'Weekly XP',  value: amb.weeklyPoints,            color: '#7C3AED' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-pill">
            <p style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color }}>{value}</p>
            <p style={{ fontFamily: F, fontSize: 10, color: ts, marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* XP Progress bar */}
      <div style={{ marginBottom: 20, padding: '14px', borderRadius: 12, background: isDark ? 'rgba(196,181,253,0.04)' : 'rgba(99,102,241,0.04)', border: `1px solid ${br}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: ts }}>XP Progress</span>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: lc }}>{amb.points.toLocaleString()} XP</span>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)' }}>
          <div className="bar-fill" style={{ height: 6, borderRadius: 99, width: `${Math.min((amb.points / 7000) * 100, 100)}%`, background: `linear-gradient(90deg, ${lc}, ${lc}80)` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontFamily: F, fontSize: 10, color: ts }}>0 XP</span>
          <span style={{ fontFamily: F, fontSize: 10, color: ts }}>7000 XP (Legend)</span>
        </div>
      </div>

      {/* Badges */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Badges ({ambBadges.length})</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ambBadges.map(b => (
            <div key={b.id} title={b.description} style={{
              padding: '5px 10px', borderRadius: 8,
              background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)',
              border: `1px solid ${isDark ? 'rgba(196,181,253,0.12)' : 'rgba(99,102,241,0.12)'}`,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: b.rarityColor }}>{b.name}</span>
            </div>
          ))}
          {ambBadges.length === 0 && <p style={{ fontFamily: F, fontSize: 12, color: ts }}>No badges yet</p>}
        </div>
      </div>

      {/* Goals */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Goals</p>
        {amb.goals.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, marginBottom: 6, background: isDark ? 'rgba(196,181,253,0.04)' : 'rgba(99,102,241,0.04)', border: `1px solid ${br}` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', flexShrink: 0 }} />
            <span style={{ fontFamily: F, fontSize: 12, color: isDark ? '#C4B5FD' : '#4F46E5', fontWeight: 500 }}>
              {g.replace(/[^\w\s,'-]/g, '').trim()}
            </span>
          </div>
        ))}
      </div>

      {/* Joined */}
      <div style={{ padding: '12px 14px', borderRadius: 12, background: isDark ? 'rgba(79,70,229,0.08)' : 'rgba(79,70,229,0.05)', border: `1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.12)'}` }}>
        <p style={{ fontFamily: F, fontSize: 10, color: ts, marginBottom: 2 }}>Joined</p>
        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: isDark ? '#C4B5FD' : '#4F46E5' }}>
          {new Date(amb.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function AmbassadorManagement() {
  const { ambassadors } = useData();
  const [isDark, setIsDark]   = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const [sortBy, setSortBy]   = useState('points');
  const [view, setView]       = useState('grid'); // grid | list
  const [selected, setSelected] = useState(null);

  const F   = "'Plus Jakarta Sans', sans-serif";
  const bg  = isDark ? '#0A0818' : '#F1F0FF';
  const tp  = isDark ? '#E8E0FF' : '#1E1B4B';
  const ts  = isDark ? '#4B4280' : '#9CA3AF';
  const br  = isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)';

  const filters = ['All', 'Active', 'Inactive', 'Platinum', 'Gold', 'Silver', 'Bronze'];

  const filtered = useMemo(() => {
    let list = [...ambassadors];
    if (search) list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.college.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'Active')   list = list.filter(a => a.active);
    if (filter === 'Inactive') list = list.filter(a => !a.active);
    if (['Platinum','Gold','Silver','Bronze','Legend'].includes(filter)) list = list.filter(a => a.level === filter);
    list.sort((a, b) => {
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'tasks')  return b.tasksCompleted - a.tasksCompleted;
      if (sortBy === 'streak') return b.streak - a.streak;
      if (sortBy === 'name')   return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [ambassadors, search, filter, sortBy]);

  const totalXP    = ambassadors.reduce((s, a) => s + a.points, 0);
  const activeCount = ambassadors.filter(a => a.active).length;

  return (
    <>
      <style>{getStyles(isDark)}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: F, transition: 'background 0.4s' }}>
        <AdminNav isDark={isDark} onToggle={() => setIsDark(p => !p)} />

        <div style={{ marginLeft: 224, flex: 1, display: 'flex', minHeight: '100vh' }}>
          {/* Main content */}
          <div style={{ flex: 1, padding: '32px 28px 60px', overflowX: 'hidden' }}>

            {/* Header */}
            <div className="af af1" style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Ambassador Network</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: tp, letterSpacing: '-0.02em' }}>Ambassador Management</h1>
                  <p style={{ fontFamily: F, fontSize: 13, color: ts, marginTop: 4 }}>{ambassadors.length} total ambassadors across {[...new Set(ambassadors.map(a => a.college))].length} colleges</p>
                </div>
                <button className="btn btn-primary">
                  <Icon d={ICONS.ambassadors} size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Invite Ambassador
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="af af2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Total Ambassadors', value: ambassadors.length,       color: '#818CF8' },
                { label: 'Active This Week',  value: activeCount,              color: '#10B981' },
                { label: 'Total XP Awarded',  value: `${(totalXP/1000).toFixed(1)}K`, color: '#F59E0B' },
                { label: 'Avg XP / Ambassador', value: Math.round(totalXP / ambassadors.length), color: '#7C3AED' },
              ].map(({ label, value, color }) => (
                <div key={label} className="stat-pill af af3" style={{ textAlign: 'left' }}>
                  <p style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color, marginBottom: 4 }}>{value}</p>
                  <p style={{ fontFamily: F, fontSize: 11, color: ts, fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="af af3" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: ts, pointerEvents: 'none' }}>
                  <Icon d={ICONS.search} size={15} />
                </div>
                <input className="search-input" placeholder="Search name or college..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                padding: '9px 12px', borderRadius: 10, border: `1px solid ${br}`,
                background: isDark ? 'rgba(196,181,253,0.05)' : 'rgba(99,102,241,0.05)',
                color: isDark ? '#C4B5FD' : '#4F46E5', fontFamily: F, fontSize: 12, fontWeight: 700,
                outline: 'none', cursor: 'pointer',
              }}>
                <option value="points">Sort: XP</option>
                <option value="tasks">Sort: Tasks</option>
                <option value="streak">Sort: Streak</option>
                <option value="name">Sort: Name</option>
              </select>
              {/* View toggle */}
              <div style={{ display: 'flex', gap: 4, background: isDark ? 'rgba(196,181,253,0.06)' : 'rgba(99,102,241,0.06)', borderRadius: 10, padding: 4 }}>
                {[['grid', ICONS.grid], ['list', ICONS.list]].map(([v, ic]) => (
                  <button key={v} onClick={() => setView(v)} style={{
                    padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: view === v ? (isDark ? '#4F46E5' : '#4F46E5') : 'transparent',
                    color: view === v ? 'white' : ts, transition: 'all 0.2s',
                  }}>
                    <Icon d={ic} size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Filter chips */}
            <div className="af af4" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`filter-chip ${filter === f ? 'active' : 'inactive'}`}>{f}</button>
              ))}
            </div>

            {/* Results count */}
            <p style={{ fontFamily: F, fontSize: 12, color: ts, marginBottom: 16, fontWeight: 500 }}>
              Showing {filtered.length} of {ambassadors.length} ambassadors
              {search && ` matching "${search}"`}
            </p>

            {/* Grid / List */}
            {view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: selected ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 14 }}>
                {filtered.map((amb, i) => {
                  const lc = LEVEL_COLORS[amb.level] ?? '#818CF8';
                  return (
                    <div key={amb.id}
                      className={`amb-card af af${Math.min(i + 2, 8)} ${selected?.id === amb.id ? 'selected' : ''}`}
                      style={{ animationDelay: `${0.04 + i * 0.04}s` }}
                      onClick={() => setSelected(selected?.id === amb.id ? null : amb)}>
                      {/* Top row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${lc}30, ${lc}15)`,
                            border: `1.5px solid ${lc}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: F, fontSize: 16, fontWeight: 800, color: lc,
                          }}>{amb.name.charAt(0)}</div>
                          <div>
                            <p style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: tp }}>{amb.name}</p>
                            <p style={{ fontFamily: F, fontSize: 10, color: ts, marginTop: 1 }}>{amb.college}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: lc, padding: '2px 8px', borderRadius: 99, background: `${lc}15` }}>{amb.level}</span>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: amb.active ? '#10B981' : '#6B7280' }} />
                        </div>
                      </div>
                      {/* Stats row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                        {[
                          { label: 'XP',     value: amb.points.toLocaleString(), color: '#818CF8' },
                          { label: 'Tasks',  value: amb.tasksCompleted,          color: '#10B981' },
                          { label: 'Streak', value: `${amb.streak}d`,            color: '#F59E0B' },
                        ].map(({ label, value, color }) => (
                          <div key={label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: isDark ? 'rgba(196,181,253,0.04)' : 'rgba(99,102,241,0.04)' }}>
                            <p style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color }}>{value}</p>
                            <p style={{ fontFamily: F, fontSize: 9, color: ts, marginTop: 1 }}>{label}</p>
                          </div>
                        ))}
                      </div>
                      {/* Rank badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: F, fontSize: 11, color: ts }}>Rank #{amb.rank}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {amb.badges.slice(0, 3).map(bid => {
                            const badge = BADGES.find(b => b.id === bid);
                            return badge ? (
                              <div key={bid} title={badge.name} style={{ width: 18, height: 18, borderRadius: 5, background: `${badge.rarityColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: badge.rarityColor }} />
                              </div>
                            ) : null;
                          })}
                          {amb.badges.length > 3 && <span style={{ fontFamily: F, fontSize: 10, color: ts, alignSelf: 'center' }}>+{amb.badges.length - 3}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List view */
              <div style={{ background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.85)', border: `1px solid ${br}`, borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(8px)' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 130px 100px 70px 70px 70px', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${br}` }}>
                  {['#','Ambassador','College','XP','Tasks','Streak','Status'].map(h => (
                    <span key={h} style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: ts, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                {filtered.map((amb, i) => {
                  const lc = LEVEL_COLORS[amb.level] ?? '#818CF8';
                  return (
                    <div key={amb.id} onClick={() => setSelected(selected?.id === amb.id ? null : amb)}
                      style={{ display: 'grid', gridTemplateColumns: '40px 1fr 130px 100px 70px 70px 70px', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${br}`, cursor: 'pointer', transition: 'all 0.18s', background: selected?.id === amb.id ? (isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.05)') : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(196,181,253,0.04)' : 'rgba(99,102,241,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = selected?.id === amb.id ? (isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.05)') : 'transparent'}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < 3 ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : isDark ? 'rgba(196,181,253,0.06)' : 'rgba(99,102,241,0.06)', fontFamily: F, fontSize: 11, fontWeight: 800, color: i < 3 ? 'white' : ts }}>{i + 1}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${lc}20`, border: `1.5px solid ${lc}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontSize: 13, fontWeight: 800, color: lc }}>{amb.name.charAt(0)}</div>
                        <div>
                          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: tp }}>{amb.name}</p>
                          <p style={{ fontFamily: F, fontSize: 10, color: lc, fontWeight: 600 }}>{amb.level}</p>
                        </div>
                      </div>
                      <span style={{ fontFamily: F, fontSize: 11, color: ts, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', alignSelf: 'center' }}>{amb.college}</span>
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: '#818CF8', alignSelf: 'center' }}>{amb.points.toLocaleString()}</span>
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: '#10B981', alignSelf: 'center' }}>{amb.tasksCompleted}</span>
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: '#F59E0B', alignSelf: 'center' }}>{amb.streak}d</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'center' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: amb.active ? '#10B981' : '#6B7280' }} />
                        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: amb.active ? '#10B981' : '#6B7280' }}>{amb.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontFamily: F, fontSize: 32, marginBottom: 12 }}>
                  <Icon d={ICONS.search} size={40} style={{ color: ts, display: 'block', margin: '0 auto' }} />
                </p>
                <p style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: tp, marginBottom: 8 }}>No ambassadors found</p>
                <p style={{ fontFamily: F, fontSize: 13, color: ts }}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && <DetailPanel amb={selected} isDark={isDark} onClose={() => setSelected(null)} />}
        </div>
      </div>
    </>
  );
}