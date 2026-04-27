import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const getStyles = (isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes barGrow {
    from { height: 0%; }
  }
  @keyframes barGrowH {
    from { width: 0%; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-3px); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }

  .af  { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .af1 { animation-delay: 0.04s; } .af2 { animation-delay: 0.10s; }
  .af3 { animation-delay: 0.16s; } .af4 { animation-delay: 0.22s; }
  .af5 { animation-delay: 0.28s; } .af6 { animation-delay: 0.34s; }

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

  .card {
    background: ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.88)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)'};
    border-radius: 20px; padding: 24px;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .card:hover {
    border-color: ${isDark ? 'rgba(196,181,253,0.2)' : 'rgba(99,102,241,0.2)'};
    box-shadow: ${isDark ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 40px rgba(99,102,241,0.1)'};
    transform: translateY(-2px);
  }

  .kpi-card {
    background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)'};
    border: 1px solid ${isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)'};
    border-radius: 18px; padding: 20px;
    backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    transform-style: preserve-3d;
  }
  .kpi-card:hover {
    transform: translateY(-5px) rotateX(2deg) scale(1.01);
    box-shadow: ${isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(99,102,241,0.15)'};
    border-color: ${isDark ? 'rgba(196,181,253,0.22)' : 'rgba(99,102,241,0.25)'};
  }

  .bar-v { animation: barGrow 1s cubic-bezier(0.34,1.56,0.64,1) both; }
  .bar-h { animation: barGrowH 1s cubic-bezier(0.34,1.56,0.64,1) both; }

  .tab {
    padding: 7px 16px; border-radius: 9px; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
    transition: all 0.2s;
  }
  .tab.active {
    background: linear-gradient(135deg,#4F46E5,#7C3AED);
    color: white; box-shadow: 0 4px 12px rgba(79,70,229,0.35);
  }
  .tab.inactive {
    background: ${isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)'};
    color: ${isDark ? '#7C6FD0' : '#6366F1'};
  }
  .tab.inactive:hover {
    background: ${isDark ? 'rgba(196,181,253,0.13)' : 'rgba(99,102,241,0.13)'};
  }

  .toggle-track {
    width: 46px; height: 24px; border-radius: 99px;
    position: relative; cursor: pointer;
    transition: all 0.3s; border: none; padding: 0;
    background: ${isDark ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'rgba(196,181,253,0.3)'};
  }
  .toggle-thumb {
    position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%;
    background: white; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    left: ${isDark ? '25px' : '3px'}; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`;

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
  trend_down:  'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z',
  college:     'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z',
  sun:         'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .38-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.38-.39-1.02-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.39-.38-1.03-.39-1.41 0z',
  moon:        'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
  chevron:     'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
};

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
    <aside style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 224, background: isDark ? '#0D0B1F' : '#FAFAFA', borderRight: `1px solid ${br}`, display: 'flex', flexDirection: 'column', zIndex: 50, boxShadow: isDark ? '4px 0 40px rgba(0,0,0,0.6)' : '4px 0 30px rgba(99,102,241,0.08)', transition: 'background 0.4s' }}>
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
              <Icon d={icon} size={15} /><span>{label}</span>
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

// ── Donut chart via SVG ──────────────────────────────────────────
const DonutChart = ({ segments, size = 160 }) => {
  const r    = 54;
  const cx   = size / 2;
  const cy   = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        {segments.map((s, i) => (
          <linearGradient key={i} id={`dg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={s.color} />
            <stop offset="100%" stopColor={s.color2 ?? s.color} stopOpacity="0.7" />
          </linearGradient>
        ))}
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(196,181,253,0.06)" strokeWidth="16" />
      {segments.map((seg, i) => {
        const dashLen = (seg.value / 100) * circ;
        const gap     = circ - dashLen;
        const el = (
          <circle key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={`url(#dg${i})`}
            strokeWidth="16"
            strokeDasharray={`${dashLen} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        );
        offset += dashLen + 4;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#E8E0FF"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800 }}>
        {segments[0]?.value}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#4B4280"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, fontWeight: 500 }}>
        {segments[0]?.label}
      </text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function Analytics() {
  const { ambassadors, tasks, weeklyActivity, collegeBattle, programStats } = useData();
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const F   = "'Plus Jakarta Sans', sans-serif";
  const bg  = isDark ? '#0A0818' : '#F1F0FF';
  const tp  = isDark ? '#E8E0FF' : '#1E1B4B';
  const ts  = isDark ? '#4B4280' : '#9CA3AF';
  const br  = isDark ? 'rgba(196,181,253,0.1)' : 'rgba(99,102,241,0.1)';

  // ── Derived metrics ──────────────────────────────────────────
  const totalXP       = ambassadors.reduce((s, a) => s + a.points, 0);
  const activeAmbs    = ambassadors.filter(a => a.active).length;
  const inactiveAmbs  = ambassadors.filter(a => !a.active).length;
  const totalTasks    = tasks.reduce((s, t) => s + t.completions, 0);
  const avgStreak     = Math.round(ambassadors.reduce((s, a) => s + a.streak, 0) / ambassadors.length);

  // Level distribution
  const levelDist = useMemo(() => {
    const counts = {};
    ambassadors.forEach(a => { counts[a.level] = (counts[a.level] ?? 0) + 1; });
    return Object.entries(counts).map(([level, count]) => ({
      level, count,
      pct: Math.round((count / ambassadors.length) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [ambassadors]);

  // Task category distribution
  const taskCatDist = useMemo(() => {
    const counts = {};
    tasks.forEach(t => { counts[t.category] = (counts[t.category] ?? 0) + t.completions; });
    return Object.entries(counts).map(([cat, total]) => ({ cat, total })).sort((a, b) => b.total - a.total);
  }, [tasks]);

  const maxTaskCat = Math.max(...taskCatDist.map(t => t.total));

  const LEVEL_COLORS = { Bronze: '#CD7F32', Silver: '#9CA3AF', Gold: '#F59E0B', Platinum: '#6366F1', Legend: '#7C3AED' };
  const CAT_COLORS   = { 'Social Media': '#EC4899', Referral: '#10B981', Learning: '#6366F1', Content: '#F59E0B', Event: '#7C3AED', Community: '#14B8A6', Secret: '#F43F5E' };

  const maxWeekly = Math.max(...weeklyActivity.map(d => d.points));

  const tabs = ['overview', 'ambassadors', 'tasks', 'colleges'];

  return (
    <>
      <style>{getStyles(isDark)}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: F, transition: 'background 0.4s' }}>
        <AdminNav isDark={isDark} onToggle={() => setIsDark(p => !p)} />

        <main style={{ marginLeft: 224, flex: 1, padding: '32px 36px 60px', overflowX: 'hidden' }}>

          {/* Header */}
          <div className="af af1" style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Data Analytics</p>
            <h1 style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: tp, letterSpacing: '-0.02em', marginBottom: 4 }}>Analytics Dashboard</h1>
            <p style={{ fontFamily: F, fontSize: 13, color: ts }}>Deep insights into your ambassador program performance</p>
          </div>

          {/* Tabs */}
          <div className="af af2" style={{ display: 'flex', gap: 6, marginBottom: 28, background: isDark ? 'rgba(196,181,253,0.05)' : 'rgba(99,102,241,0.05)', borderRadius: 14, padding: 5, width: 'fit-content', border: `1px solid ${br}` }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`tab ${activeTab === t ? 'active' : 'inactive'}`}
                style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>

          {/* KPI Row */}
          <div className="af af2" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total XP',        value: `${(totalXP/1000).toFixed(1)}K`, color: '#818CF8', icon: ICONS.trend_up },
              { label: 'Ambassadors',     value: ambassadors.length,              color: '#10B981', icon: ICONS.ambassadors },
              { label: 'Task Completions',value: totalTasks,                      color: '#F59E0B', icon: ICONS.tasks },
              { label: 'Avg Streak',      value: `${avgStreak}d`,                 color: '#7C3AED', icon: ICONS.analytics },
              { label: 'Engagement',      value: `${programStats.engagementRate}%`, color: '#EC4899', icon: ICONS.insights },
            ].map(({ label, value, color, icon }, i) => (
              <div key={label} className={`kpi-card af af${i + 2}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, border: `1px solid ${color}25`, animation: 'float 3s ease-in-out infinite' }}>
                    <Icon d={icon} size={16} />
                  </div>
                </div>
                <p style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color, lineHeight: 1, marginBottom: 5 }}>{value}</p>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, fontWeight: 500 }}>{label}</p>
                <div style={{ height: 2, marginTop: 14, borderRadius: 99, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.6 }} />
              </div>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Weekly XP bar chart */}
              <div className="af af3 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Weekly XP Activity</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Points distributed this week</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 140 }}>
                  {weeklyActivity.map((d, i) => {
                    const pct   = (d.points / maxWeekly) * 100;
                    const isTop = d.points === maxWeekly;
                    return (
                      <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: isTop ? '#C4B5FD' : ts }}>{d.points}</span>
                        <div style={{ width: '100%', height: 120, background: isDark ? 'rgba(196,181,253,0.05)' : 'rgba(99,102,241,0.05)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                          <div className="bar-v" style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: `${pct}%`,
                            background: isTop ? 'linear-gradient(180deg,#C4B5FD,#7C3AED)' : 'linear-gradient(180deg,#818CF8,#4F46E5)',
                            borderRadius: 8,
                            boxShadow: isTop ? '0 0 20px rgba(124,58,237,0.5)' : 'none',
                            animationDelay: `${i * 0.1}s`,
                          }} />
                        </div>
                        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: ts }}>{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engagement donut */}
              <div className="af af3 card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Program Health</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Key performance indicators</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
                  <DonutChart segments={[
                    { label: 'Engagement', value: programStats.engagementRate, color: '#4F46E5', color2: '#818CF8' },
                    { label: 'Retention',  value: Math.min(programStats.retentionRate - programStats.engagementRate, 30), color: '#10B981', color2: '#34D399' },
                  ]} />
                  <div style={{ flex: 1 }}>
                    {[
                      { label: 'Engagement Rate', val: programStats.engagementRate, color: '#818CF8' },
                      { label: 'Retention Rate',  val: programStats.retentionRate,  color: '#10B981' },
                      { label: 'Health Score',     val: programStats.programHealthScore, color: '#7C3AED' },
                      { label: 'Active Rate',      val: Math.round((activeAmbs / ambassadors.length) * 100), color: '#F59E0B' },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontFamily: F, fontSize: 11, color: ts }}>{label}</span>
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color }}>{val}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                          <div className="bar-h" style={{ height: 5, borderRadius: 99, width: `${val}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active vs Inactive */}
              <div className="af af4 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Ambassador Status</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Active vs inactive breakdown</p>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { label: 'Active Ambassadors',   val: activeAmbs,   pct: Math.round((activeAmbs / ambassadors.length) * 100),   color: '#10B981' },
                      { label: 'Inactive Ambassadors', val: inactiveAmbs, pct: Math.round((inactiveAmbs / ambassadors.length) * 100), color: '#F87171' },
                    ].map(({ label, val, pct, color }) => (
                      <div key={label} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                            <span style={{ fontFamily: F, fontSize: 12, color: ts }}>{label}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color }}>{val}</span>
                            <span style={{ fontFamily: F, fontSize: 11, color: ts }}>({pct}%)</span>
                          </div>
                        </div>
                        <div style={{ height: 8, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                          <div className="bar-h" style={{ height: 8, borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task completions by category */}
              <div className="af af4 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Task Categories</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Completions by task type</p>
                {taskCatDist.map(({ cat, total }) => {
                  const color = CAT_COLORS[cat] ?? '#818CF8';
                  const pct   = Math.round((total / maxTaskCat) * 100);
                  return (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: F, fontSize: 12, color: ts }}>{cat}</span>
                        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color }}>{total}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                        <div className="bar-h" style={{ height: 6, borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ambassadors tab */}
          {activeTab === 'ambassadors' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Level distribution */}
              <div className="af af3 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Level Distribution</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Ambassadors by level tier</p>
                {levelDist.map(({ level, count, pct }) => {
                  const color = LEVEL_COLORS[level] ?? '#818CF8';
                  return (
                    <div key={level} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}60` }} />
                          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: tp }}>{level}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color }}>{count}</span>
                          <span style={{ fontFamily: F, fontSize: 10, color: ts }}>({pct}%)</span>
                        </div>
                      </div>
                      <div style={{ height: 8, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                        <div className="bar-h" style={{ height: 8, borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}60)`, boxShadow: `0 0 8px ${color}30` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top performers */}
              <div className="af af3 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Top Performers</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Ambassadors ranked by XP</p>
                {[...ambassadors].sort((a, b) => b.points - a.points).slice(0, 6).map((amb, i) => {
                  const lc  = LEVEL_COLORS[amb.level] ?? '#818CF8';
                  const max = ambassadors[0]?.points ?? 1;
                  return (
                    <div key={amb.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '8px 10px', borderRadius: 12, background: i === 0 ? (isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)') : 'transparent', border: i === 0 ? `1px solid rgba(79,70,229,0.2)` : '1px solid transparent', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(196,181,253,0.05)' : 'rgba(99,102,241,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i === 0 ? (isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)') : 'transparent'}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < 3 ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)', fontFamily: F, fontSize: 11, fontWeight: 800, color: i < 3 ? 'white' : ts, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: tp, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{amb.name}</span>
                          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: lc, flexShrink: 0, marginLeft: 8 }}>{amb.points.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                          <div className="bar-h" style={{ height: 4, borderRadius: 99, width: `${(amb.points / max) * 100}%`, background: `linear-gradient(90deg, ${lc}, ${lc}60)` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Streak analysis */}
              <div className="af af4 card" style={{ gridColumn: '1 / -1' }}>
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Streak Analysis</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Login streak distribution across ambassadors</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                  {[
                    { label: '0 days',   count: ambassadors.filter(a => a.streak === 0).length,             color: '#6B7280' },
                    { label: '1-3 days', count: ambassadors.filter(a => a.streak >= 1 && a.streak <= 3).length, color: '#F59E0B' },
                    { label: '4-7 days', count: ambassadors.filter(a => a.streak >= 4 && a.streak <= 7).length, color: '#10B981' },
                    { label: '8-14 days',count: ambassadors.filter(a => a.streak >= 8 && a.streak <= 14).length,'color': '#818CF8' },
                    { label: '15+ days', count: ambassadors.filter(a => a.streak >= 15).length,              color: '#7C3AED' },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ textAlign: 'center', padding: '16px 12px', borderRadius: 14, background: isDark ? 'rgba(196,181,253,0.04)' : 'rgba(99,102,241,0.04)', border: `1px solid ${isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)'}`, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'none'; }}>
                      <p style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color, marginBottom: 6 }}>{count}</p>
                      <p style={{ fontFamily: F, fontSize: 11, color: ts }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tasks tab */}
          {activeTab === 'tasks' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Task performance table */}
              <div className="af af3 card" style={{ gridColumn: '1 / -1' }}>
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Task Performance</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Completion rates and points distributed per task</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 80px 100px', gap: 12, padding: '10px 0', borderBottom: `1px solid ${br}` }}>
                  {['Task', 'Category', 'Points', 'Completions', 'Difficulty'].map(h => (
                    <span key={h} style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: ts, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                {tasks.map((t, i) => {
                  const color = CAT_COLORS[t.category] ?? '#818CF8';
                  return (
                    <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 80px 100px', gap: 12, padding: '12px 0', borderBottom: `1px solid ${br}`, transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(196,181,253,0.03)' : 'rgba(99,102,241,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div>
                        <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: tp }}>{t.title.replace(/^⚡\s*/, '')}</p>
                        <p style={{ fontFamily: F, fontSize: 10, color: ts, marginTop: 2 }}>Proof: {t.proofType}</p>
                      </div>
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color, padding: '3px 8px', borderRadius: 99, background: `${color}15`, height: 'fit-content', alignSelf: 'center' }}>{t.category}</span>
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: '#818CF8', alignSelf: 'center' }}>{t.points}</span>
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: '#10B981', alignSelf: 'center' }}>{t.completions}</span>
                      <div style={{ alignSelf: 'center', display: 'flex', gap: 3 }}>
                        {Array.from({ length: 5 }).map((_, di) => (
                          <div key={di} style={{ width: 10, height: 10, borderRadius: 3, background: di < t.difficulty ? '#F59E0B' : (isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)') }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total XP by task */}
              <div className="af af4 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>XP Distributed by Task</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>Total points generated per task</p>
                {tasks.sort((a, b) => (b.points * b.completions) - (a.points * a.completions)).map(t => {
                  const totalXpTask = t.points * t.completions;
                  const maxXp = tasks.reduce((max, tx) => Math.max(max, tx.points * tx.completions), 0);
                  const color = CAT_COLORS[t.category] ?? '#818CF8';
                  return (
                    <div key={t.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: F, fontSize: 11, color: ts, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{t.title.replace(/^⚡\s*/, '')}</span>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color }}>{totalXpTask.toLocaleString()} XP</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                        <div className="bar-h" style={{ height: 6, borderRadius: 99, width: `${(totalXpTask / maxXp) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Proof type breakdown */}
              <div className="af af4 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>Proof Type Breakdown</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 20 }}>How ambassadors submit their work</p>
                {(() => {
                  const proofCounts = {};
                  tasks.forEach(t => { proofCounts[t.proofType] = (proofCounts[t.proofType] ?? 0) + t.completions; });
                  const entries = Object.entries(proofCounts);
                  const maxVal  = Math.max(...entries.map(e => e[1]));
                  const colors  = ['#818CF8','#10B981','#F59E0B','#EC4899'];
                  return entries.sort((a, b) => b[1] - a[1]).map(([type, count], i) => (
                    <div key={type} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: tp, textTransform: 'capitalize' }}>{type}</span>
                        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: colors[i] }}>{count} submissions</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                        <div className="bar-h" style={{ height: 8, borderRadius: 99, width: `${(count / maxVal) * 100}%`, background: `linear-gradient(90deg, ${colors[i]}, ${colors[i]}60)` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Colleges tab */}
          {activeTab === 'colleges' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
              {/* College rankings */}
              <div className="af af3 card">
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: tp, marginBottom: 4 }}>College Battle Rankings</h2>
                <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 24 }}>Total XP generated by college</p>
                {collegeBattle.map((c, i) => {
                  const max   = collegeBattle[0].points;
                  const pct   = (c.points / max) * 100;
                  const color = i === 0 ? '#C4B5FD' : i === 1 ? '#818CF8' : i === 2 ? '#6366F1' : '#4F46E5';
                  return (
                    <div key={c.college} style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < 3 ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : isDark ? 'rgba(196,181,253,0.08)' : 'rgba(99,102,241,0.08)', fontFamily: F, fontSize: 11, fontWeight: 800, color: i < 3 ? 'white' : ts }}>{c.rank}</div>
                          <div>
                            <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: tp }}>{c.college}</p>
                            <p style={{ fontFamily: F, fontSize: 10, color: ts }}>{c.ambassadors} ambassadors</p>
                          </div>
                        </div>
                        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color }}>{c.points.toLocaleString()} XP</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.06)' : 'rgba(99,102,241,0.06)' }}>
                        <div className="bar-h" style={{ height: 8, borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}70)`, boxShadow: i === 0 ? `0 0 12px ${color}40` : 'none' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* College stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="af af3 card">
                  <h2 style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: tp, marginBottom: 16 }}>College Summary</h2>
                  {[
                    { label: 'Total Colleges',    value: collegeBattle.length,                                              color: '#818CF8' },
                    { label: 'Total Ambassadors', value: collegeBattle.reduce((s, c) => s + c.ambassadors, 0),             color: '#10B981' },
                    { label: 'Total XP Generated',value: `${(collegeBattle.reduce((s, c) => s + c.points, 0)/1000).toFixed(1)}K`, color: '#F59E0B' },
                    { label: 'Avg XP / College',  value: Math.round(collegeBattle.reduce((s, c) => s + c.points, 0) / collegeBattle.length).toLocaleString(), color: '#7C3AED' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${br}` }}>
                      <span style={{ fontFamily: F, fontSize: 12, color: ts }}>{label}</span>
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Efficiency chart — XP per ambassador */}
                <div className="af af4 card">
                  <h2 style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: tp, marginBottom: 4 }}>XP Efficiency</h2>
                  <p style={{ fontFamily: F, fontSize: 11, color: ts, marginBottom: 16 }}>XP per ambassador by college</p>
                  {collegeBattle.map(c => {
                    const efficiency = Math.round(c.points / c.ambassadors);
                    const maxEff     = Math.max(...collegeBattle.map(x => Math.round(x.points / x.ambassadors)));
                    return (
                      <div key={c.college} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontFamily: F, fontSize: 11, color: ts, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{c.college}</span>
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: '#818CF8' }}>{efficiency.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, background: isDark ? 'rgba(196,181,253,0.07)' : 'rgba(99,102,241,0.07)' }}>
                          <div className="bar-h" style={{ height: 5, borderRadius: 99, width: `${(efficiency / maxEff) * 100}%`, background: 'linear-gradient(90deg,#818CF8,#4F46E5)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}