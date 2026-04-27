import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// ── Styles ─────────────────────────────────────────────────────
const getStyles = (isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800&display=swap');

  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes shimmer {
    0%   { background-position: -400% center; }
    100% { background-position: 400% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes ringGrow {
    from { stroke-dasharray: 0 400; }
    to   {}
  }
  @keyframes barGrow {
    from { width: 0%; }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
    50%       { box-shadow: 0 0 40px rgba(99,102,241,0.6); }
  }

  .af  { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .af1 { animation-delay: 0.04s; }
  .af2 { animation-delay: 0.10s; }
  .af3 { animation-delay: 0.16s; }
  .af4 { animation-delay: 0.22s; }
  .af5 { animation-delay: 0.28s; }
  .af6 { animation-delay: 0.34s; }
  .af7 { animation-delay: 0.40s; }

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
    color: white !important;
    box-shadow: 0 6px 20px rgba(79,70,229,0.4);
    transform: translateX(0);
  }
  .nav-item.active::before { opacity: 0; }

  .stat-card {
    background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.12)'};
    border-radius: 20px; padding: 22px;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    cursor: default;
    transform-style: preserve-3d;
    position: relative;
    backdrop-filter: blur(10px);
  }
  .stat-card:hover {
    border-color: ${isDark ? 'rgba(196,181,253,0.25)' : 'rgba(99,102,241,0.3)'};
    background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,1)'};
    transform: translateY(-5px) rotateX(2deg) rotateY(-1deg) scale(1.01);
    box-shadow: ${isDark
      ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(196,181,253,0.15)'
      : '0 20px 40px rgba(99,102,241,0.15), 0 0 0 1px rgba(99,102,241,0.1)'};
  }

  .table-row {
    display: grid; align-items: center;
    border-bottom: 1px solid ${isDark ? 'rgba(196,181,253,0.06)' : 'rgba(99,102,241,0.06)'};
    transition: all 0.18s;
  }
  .table-row:hover {
    background: ${isDark ? 'rgba(196,181,253,0.04)' : 'rgba(99,102,241,0.03)'};
    transform: translateX(2px);
  }

  .risk-badge {
    padding: 3px 10px; border-radius: 99px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 800;
    letter-spacing: 0.08em; text-transform: uppercase;
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
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(79,70,229,0.5);
  }
  .btn-ghost {
    background: ${isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)'};
    color: ${isDark ? '#7C6FD0' : '#6366F1'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.15)' : 'rgba(99,102,241,0.2)'};
  }
  .btn-ghost:hover {
    background: ${isDark ? 'rgba(196,181,253,0.14)' : 'rgba(99,102,241,0.14)'};
    color: ${isDark ? '#C4B5FD' : '#4F46E5'};
    transform: translateY(-1px);
  }

  .quick-nav-card {
    background: ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.85)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)'};
    border-radius: 16px; padding: 18px 20px;
    cursor: pointer; text-align: left;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    transform-style: preserve-3d;
    backdrop-filter: blur(8px);
  }
  .quick-nav-card:hover {
    transform: translateY(-6px) rotateX(3deg) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  }

  .toggle-track {
    width: 46px; height: 24px; border-radius: 99px;
    position: relative; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    border: none; padding: 0;
    background: ${isDark ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'rgba(196,181,253,0.3)'};
    box-shadow: ${isDark ? '0 0 16px rgba(99,102,241,0.4)' : 'none'};
  }
  .toggle-thumb {
    position: absolute; top: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: white;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    left: ${isDark ? '25px' : '3px'};
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }

  .section-card {
    background: ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.85)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)'};
    border-radius: 20px; overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .section-card:hover {
    border-color: ${isDark ? 'rgba(196,181,253,0.18)' : 'rgba(99,102,241,0.2)'};
    box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(99,102,241,0.1)'};
  }

  .bar-fill {
    animation: barGrow 1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
`;

// ── SVG Icons ──────────────────────────────────────────────────
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
  trend_up:    'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  warning:     'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  health:      'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
  sun:         'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .38-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.38-.39-1.02-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.39-.38-1.03-.39-1.41 0z',
  moon:        'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
  star:        'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  chevron:     'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
};

// ── Admin Nav ──────────────────────────────────────────────────
const AdminNav = ({ isDark, onToggle }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const F = "'Plus Jakarta Sans', sans-serif";

  const navItems = [
    { label: 'Dashboard',   path: '/admin/dashboard',   icon: ICONS.dashboard },
    { label: 'Ambassadors', path: '/admin/ambassadors', icon: ICONS.ambassadors },
    { label: 'Tasks',       path: '/admin/tasks',       icon: ICONS.tasks },
    { label: 'Analytics',   path: '/admin/analytics',   icon: ICONS.analytics },
    { label: 'AI Insights', path: '/admin/ai-insights', icon: ICONS.insights },
  ];

  const bg   = isDark ? '#0D0B1F' : '#FAFAFA';
  const br   = isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.1)';
  const text = isDark ? '#E8E0FF' : '#1E1B4B';

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: 224,
      background: bg,
      borderRight: `1px solid ${br}`,
      display: 'flex', flexDirection: 'column', zIndex: 50,
      boxShadow: isDark ? '4px 0 40px rgba(0,0,0,0.6)' : '4px 0 30px rgba(99,102,241,0.08)',
      transition: 'background 0.4s, box-shadow 0.4s',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 18px 16px', borderBottom: `1px solid ${br}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F, fontWeight: 900, fontSize: 16, color: 'white',
            boxShadow: '0 4px 16px rgba(79,70,229,0.45)',
          }}>A</div>
          <div>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: text, lineHeight: 1 }}>AstralIQ</p>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: isDark ? '#4B4280' : '#9CA3AF', lineHeight: 1, marginTop: 2 }}>Admin Console</p>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div style={{ margin: '12px 12px 4px', padding: '12px 14px', borderRadius: 14, background: isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)', border: `1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.15)'}` }}>
        <p style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: isDark ? '#C4B5FD' : '#4F46E5', lineHeight: 1 }}>{user?.name ?? 'Admin'}</p>
        <p style={{ fontFamily: F, fontSize: 10, color: isDark ? '#4B4280' : '#9CA3AF', marginTop: 3 }}>Organization Admin</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: F, fontSize: 10, color: '#10B981', fontWeight: 700 }}>System Online</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '6px 8px', overflowY: 'auto' }}>
        <p style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: isDark ? '#2D2660' : '#C4B5FD', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 5px 6px', marginBottom: 2 }}>Navigation</p>
        {navItems.map(({ label, path, icon }) => {
          const active = location.pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)}
              className={`nav-item${active ? ' active' : ''}`}
              style={{ marginBottom: 2 }}>
              <Icon d={icon} size={15} />
              <span>{label}</span>
              {active && <Icon d={ICONS.chevron} size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
            </button>
          );
        })}
      </div>

      {/* Dark/Light toggle + Logout */}
      <div style={{ padding: '10px 8px 20px', borderTop: `1px solid ${br}` }}>
        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 5px', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={isDark ? ICONS.moon : ICONS.sun} size={14} style={{ color: isDark ? '#818CF8' : '#F59E0B' }} />
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: isDark ? '#7C6FD0' : '#9CA3AF' }}>
              {isDark ? 'Dark' : 'Light'}
            </span>
          </div>
          <button className="toggle-track" onClick={onToggle}>
            <div className="toggle-thumb" />
          </button>
        </div>
        <button className="nav-item" onClick={() => { logout(); navigate('/'); }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#4B4280' : '#9CA3AF'; }}>
          <Icon d={ICONS.logout} size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon, delay, isDark }) => {
  const F = "'Plus Jakarta Sans', sans-serif";
  return (
    <div className={`stat-card af af${delay}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, border: `1px solid ${color}25`,
          animation: 'float 3s ease-in-out infinite',
        }}>
          <Icon d={icon} size={18} />
        </div>
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: isDark ? '#2D2660' : '#C4B5FD', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <p style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: isDark ? '#E8E0FF' : '#1E1B4B', lineHeight: 1, marginBottom: 6 }}>{value}</p>
      <p style={{ fontFamily: F, fontSize: 12, color: isDark ? '#4B4280' : '#9CA3AF', fontWeight: 500 }}>{sub}</p>
      {/* Bottom accent line */}
      <div style={{ height: 2, marginTop: 16, borderRadius: 99, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.6 }} />
    </div>
  );
};

// ── Mini bar ──────────────────────────────────────────────────
const MiniBar = ({ label, value, max, color, isDark }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const F = "'Plus Jakarta Sans', sans-serif";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: F, fontSize: 12, color: isDark ? '#7C6FD0' : '#6366F1', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: isDark ? '#C4B5FD' : '#4F46E5' }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)' }}>
        <div className="bar-fill" style={{
          height: 6, borderRadius: 99, width: `${pct}%`,
          background: color ?? 'linear-gradient(90deg,#4F46E5,#7C3AED)',
        }} />
      </div>
    </div>
  );
};

// ── Health ring ──────────────────────────────────────────────
const HealthRing = ({ score }) => {
  const r    = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg viewBox="0 0 130 130" style={{ width: 130, height: 130 }}>
      <defs>
        <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(196,181,253,0.1)" strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none"
        stroke="url(#hg)" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        filter="url(#glow)"
        style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <text x="65" y="60" textAnchor="middle" fill="#E8E0FF"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800 }}>{score}</text>
      <text x="65" y="77" textAnchor="middle" fill="#4B4280"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>/ 100</text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { ambassadors, programStats, collegeBattle, weeklyActivity } = useData();
  const [isDark, setIsDark] = useState(true);

  const F  = "'Plus Jakarta Sans', sans-serif";
  const bg = isDark ? '#0A0818' : '#F1F0FF';

  const totalPoints   = ambassadors.reduce((s, a) => s + a.points, 0);
  const activeAmbs    = ambassadors.filter(a => a.active).length;
  const avgPoints     = Math.round(totalPoints / (ambassadors.length || 1));
  const maxColPoints  = Math.max(...collegeBattle.map(c => c.points));

  const textPrimary   = isDark ? '#E8E0FF' : '#1E1B4B';
  const textSecondary = isDark ? '#4B4280' : '#9CA3AF';
  const cardBg        = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.85)';
  const cardBorder    = isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)';

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <style>{getStyles(isDark)}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: F, transition: 'background 0.4s' }}>
        <AdminNav isDark={isDark} onToggle={() => setIsDark(p => !p)} />

        <main style={{ marginLeft: 224, flex: 1, padding: '32px 36px 60px', overflowX: 'hidden' }}>

          {/* Header */}
          <div className="af af1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: textSecondary, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                {today}
              </p>
              <h1 style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: textPrimary, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Program Overview
              </h1>
              <p style={{ fontFamily: F, fontSize: 13, color: textSecondary, marginTop: 5, fontWeight: 400 }}>
                Real-time metrics across your ambassador network
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/admin/ambassadors')}>
                Manage Ambassadors
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/admin/ai-insights')}>
                AI Insights
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard isDark={isDark} delay={2} label="Total Ambassadors" value={ambassadors.length} sub={`${activeAmbs} active this week`} color="#818CF8" icon={ICONS.ambassadors} />
            <StatCard isDark={isDark} delay={3} label="Tasks Completed"   value={programStats.tasksCompleted.toLocaleString()} sub="across all ambassadors" color="#10B981" icon={ICONS.tasks} />
            <StatCard isDark={isDark} delay={4} label="Total XP Awarded"  value={`${(programStats.totalPointsAwarded / 1000).toFixed(0)}K`} sub={`avg ${avgPoints} XP per ambassador`} color="#F59E0B" icon={ICONS.trend_up} />
            <StatCard isDark={isDark} delay={5} label="Retention Rate"    value={`${programStats.retentionRate}%`} sub="30-day retention" color="#7C3AED" icon={ICONS.health} />
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>

            {/* Top Ambassadors table */}
            <div className="af af3 section-card">
              <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: textPrimary }}>Top Ambassadors</h2>
                  <p style={{ fontFamily: F, fontSize: 11, color: textSecondary, marginTop: 2 }}>Ranked by total XP</p>
                </div>
                <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 11 }}
                  onClick={() => navigate('/admin/ambassadors')}>View All</button>
              </div>

              <div className="table-row" style={{ gridTemplateColumns: '36px 1fr 110px 80px 70px', padding: '10px 24px', gap: 12 }}>
                {['#', 'Ambassador', 'College', 'XP', 'Tasks'].map(h => (
                  <span key={h} style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: textSecondary, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              {[...ambassadors].sort((a, b) => b.points - a.points).slice(0, 8).map((amb, i) => (
                <div key={amb.id} className="table-row"
                  style={{ gridTemplateColumns: '36px 1fr 110px 80px 70px', padding: '13px 24px', gap: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i < 3 ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : isDark ? 'rgba(196,181,253,0.06)' : 'rgba(99,102,241,0.06)',
                    fontFamily: F, fontSize: 11, fontWeight: 800, color: i < 3 ? 'white' : textSecondary,
                  }}>{i + 1}</div>
                  <div>
                    <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: textPrimary }}>{amb.name}</p>
                    <p style={{ fontFamily: F, fontSize: 10, color: textSecondary, marginTop: 1 }}>{amb.streak}d streak</p>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 11, color: isDark ? '#7C6FD0' : '#6366F1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{amb.college}</span>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: '#818CF8' }}>{amb.points.toLocaleString()}</span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: '#10B981' }}>{amb.tasksCompleted}</span>
                </div>
              ))}
            </div>

            {/* Right col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Health */}
              <div className="af af4 section-card" style={{ padding: '20px 22px' }}>
                <h2 style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: textPrimary, marginBottom: 4 }}>Program Health</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: textSecondary, marginBottom: 16 }}>Overall system score</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <HealthRing score={programStats.programHealthScore} />
                  <div style={{ flex: 1 }}>
                    {[
                      { label: 'Engagement', val: programStats.engagementRate, color: 'linear-gradient(90deg,#4F46E5,#7C3AED)' },
                      { label: 'Retention',  val: programStats.retentionRate,  color: 'linear-gradient(90deg,#10B981,#059669)' },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontFamily: F, fontSize: 11, color: isDark ? '#7C6FD0' : '#6366F1' }}>{label}</span>
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: isDark ? '#C4B5FD' : '#4F46E5' }}>{val}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)' }}>
                          <div className="bar-fill" style={{ height: 5, borderRadius: 99, width: `${val}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dropout Risk */}
              <div className="af af5 section-card" style={{ padding: '20px 22px', flex: 1, borderColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ color: '#F87171' }}><Icon d={ICONS.warning} size={14} /></div>
                  <h2 style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: textPrimary }}>Dropout Risk</h2>
                </div>
                <p style={{ fontFamily: F, fontSize: 11, color: textSecondary, marginBottom: 14 }}>Ambassadors needing attention</p>
                {programStats.dropoutRisk.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < programStats.dropoutRisk.length - 1 ? `1px solid ${cardBorder}` : 'none',
                  }}>
                    <div>
                      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: textPrimary }}>{a.name}</p>
                      <p style={{ fontFamily: F, fontSize: 10, color: textSecondary, marginTop: 1 }}>Last active {a.lastActive}</p>
                    </div>
                    <span className="risk-badge" style={{
                      background: a.risk === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                      color: a.risk === 'High' ? '#F87171' : '#FCD34D',
                    }}>{a.risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* College Battle */}
            <div className="af af4 section-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: textPrimary }}>College Battle</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: textSecondary, marginTop: 2 }}>Rankings by total program XP</p>
              </div>
              {collegeBattle.map((c, i) => (
                <MiniBar key={c.college} isDark={isDark}
                  label={`#${c.rank} ${c.college}`}
                  value={c.points}
                  max={maxColPoints}
                  color={i === 0 ? 'linear-gradient(90deg,#818CF8,#C4B5FD)' : i === 1 ? 'linear-gradient(90deg,#4F46E5,#818CF8)' : 'linear-gradient(90deg,#2D2A6E,#4F46E5)'}
                />
              ))}
            </div>

            {/* Weekly Activity */}
            <div className="af af5 section-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: textPrimary }}>Weekly XP Activity</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: textSecondary, marginTop: 2 }}>Points distributed across the week</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
                {weeklyActivity.map((d, i) => {
                  const maxPts = Math.max(...weeklyActivity.map(x => x.points));
                  const pct    = (d.points / maxPts) * 100;
                  const isTop  = i === weeklyActivity.reduce((mi, x, xi, arr) => x.points > arr[mi].points ? xi : mi, 0);
                  return (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: isTop ? '#C4B5FD' : textSecondary }}>{d.points}</span>
                      <div style={{ width: '100%', height: 80, background: isDark ? 'rgba(196,181,253,0.06)' : 'rgba(99,102,241,0.06)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                        <div className="bar-fill" style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: `${pct}%`,
                          background: isTop ? 'linear-gradient(180deg,#C4B5FD,#7C3AED)' : 'linear-gradient(180deg,#818CF8,#4F46E5)',
                          borderRadius: 8,
                          boxShadow: isTop ? '0 0 16px rgba(124,58,237,0.6)' : 'none',
                        }} />
                      </div>
                      <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: textSecondary }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total this week', value: `${weeklyActivity.reduce((s, d) => s + d.points, 0).toLocaleString()} XP` },
                  { label: 'Peak day', value: weeklyActivity.reduce((a, b) => a.points > b.points ? a : b).day },
                  { label: 'Total tasks', value: weeklyActivity.reduce((s, d) => s + d.tasks, 0) },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)',
                    border: `1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.15)'}`,
                    borderRadius: 10, padding: '8px 14px',
                  }}>
                    <p style={{ fontFamily: F, fontSize: 10, color: textSecondary }}>{label}</p>
                    <p style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: isDark ? '#C4B5FD' : '#4F46E5', marginTop: 2 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick nav */}
          <div className="af af6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 20 }}>
            {[
              { label: 'Ambassador Management', sub: 'View and manage all ambassadors', path: '/admin/ambassadors', icon: ICONS.ambassadors, color: '#818CF8' },
              { label: 'Task Management',        sub: 'Create and track tasks',          path: '/admin/tasks',       icon: ICONS.tasks,       color: '#10B981' },
              { label: 'Analytics',              sub: 'Deep program analytics',          path: '/admin/analytics',   icon: ICONS.analytics,   color: '#F59E0B' },
              { label: 'AI Insights',            sub: 'AI-generated recommendations',   path: '/admin/ai-insights', icon: ICONS.insights,    color: '#7C3AED' },
            ].map(({ label, sub, path, icon, color }) => (
              <button key={path} onClick={() => navigate(path)} className="quick-nav-card"
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 12, border: `1px solid ${color}25` }}>
                  <Icon d={icon} size={16} />
                </div>
                <p style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: textPrimary, marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: F, fontSize: 11, color: textSecondary, fontWeight: 400 }}>{sub}</p>
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}