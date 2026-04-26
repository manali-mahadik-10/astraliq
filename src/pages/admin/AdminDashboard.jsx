import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// ── Styles ─────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes bar-grow {
    from { width: 0%; }
    to   { width: var(--w); }
  }
  @keyframes shimmer-line {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .admin-fade { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .admin-fade-1 { animation-delay: 0.05s; }
  .admin-fade-2 { animation-delay: 0.12s; }
  .admin-fade-3 { animation-delay: 0.19s; }
  .admin-fade-4 { animation-delay: 0.26s; }
  .admin-fade-5 { animation-delay: 0.33s; }
  .admin-fade-6 { animation-delay: 0.40s; }

  .admin-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 12px; width: 100%;
    border: none; cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    transition: all 0.2s; background: transparent; color: #4B4280;
  }
  .admin-nav-item:hover { background: rgba(196,181,253,0.07); color: #C4B5FD; }
  .admin-nav-item.active {
    background: linear-gradient(135deg,#4F46E5,#7C3AED);
    color: white;
    box-shadow: 0 4px 14px rgba(79,70,229,0.35);
  }

  .admin-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(196,181,253,0.1);
    border-radius: 20px; padding: 24px;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  .admin-stat-card:hover {
    border-color: rgba(196,181,253,0.22);
    background: rgba(255,255,255,0.05);
    transform: translateY(-2px);
  }

  .admin-table-row {
    display: grid; align-items: center;
    border-bottom: 1px solid rgba(196,181,253,0.06);
    transition: background 0.15s;
  }
  .admin-table-row:hover { background: rgba(196,181,253,0.04); }

  .risk-badge {
    padding: 3px 10px; border-radius: 99px;
    font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
  }

  .admin-btn {
    padding: 9px 20px; border-radius: 10px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: all 0.2s;
  }
  .admin-btn-primary {
    background: linear-gradient(135deg,#4F46E5,#7C3AED);
    color: white; box-shadow: 0 4px 16px rgba(79,70,229,0.35);
  }
  .admin-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.5); }
  .admin-btn-ghost {
    background: rgba(196,181,253,0.08); color: #7C6FD0;
    border: 1px solid rgba(196,181,253,0.15);
  }
  .admin-btn-ghost:hover { background: rgba(196,181,253,0.14); color: #C4B5FD; }
  .admin-btn-danger {
    background: rgba(239,68,68,0.1); color: #F87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  .admin-btn-danger:hover { background: rgba(239,68,68,0.18); }
`;

// ── Icons ──────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size, flexShrink: 0 }}>
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
  college:     'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z',
  health:      'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
  fire:        'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z',
};

// ── Admin Nav ──────────────────────────────────────────────────
const AdminNav = ({ isDark }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const F  = "'Syne', sans-serif";
  const FB = "'DM Sans', sans-serif";

  const navItems = [
    { label: 'Dashboard',   path: '/admin/dashboard',   icon: ICONS.dashboard },
    { label: 'Ambassadors', path: '/admin/ambassadors', icon: ICONS.ambassadors },
    { label: 'Tasks',       path: '/admin/tasks',       icon: ICONS.tasks },
    { label: 'Analytics',   path: '/admin/analytics',   icon: ICONS.analytics },
    { label: 'AI Insights', path: '/admin/ai-insights', icon: ICONS.insights },
  ];

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: 220,
      background: '#0D0B1F',
      borderRight: '1px solid rgba(196,181,253,0.08)',
      display: 'flex', flexDirection: 'column', zIndex: 50,
      boxShadow: '4px 0 30px rgba(0,0,0,0.5)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F, fontWeight: 900, fontSize: 15, color: 'white',
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
          }}>A</div>
          <div>
            <p style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: '#E8E0FF', lineHeight: 1 }}>AstralIQ</p>
            <p style={{ fontFamily: FB, fontSize: 10, fontWeight: 500, color: '#4B4280', lineHeight: 1, marginTop: 2 }}>Admin Console</p>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div style={{ margin: '14px 14px 6px', padding: '12px 14px', borderRadius: 14, background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)' }}>
        <p style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: '#C4B5FD', lineHeight: 1 }}>{user?.name ?? 'Admin'}</p>
        <p style={{ fontFamily: FB, fontSize: 10, color: '#4B4280', marginTop: 3 }}>Organization Admin</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: FB, fontSize: 10, color: '#10B981', fontWeight: 600 }}>System Online</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
        <p style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: '#2D2660', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '8px 4px 6px', marginBottom: 4 }}>Navigation</p>
        {navItems.map(({ label, path, icon }) => {
          const active = location.pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)}
              className={`admin-nav-item${active ? ' active' : ''}`}
              style={{ marginBottom: 2 }}>
              <Icon d={icon} size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div style={{ padding: '10px 10px 20px', borderTop: '1px solid rgba(196,181,253,0.07)' }}>
        <button className="admin-nav-item" onClick={() => { logout(); navigate('/'); }}
          style={{ color: '#4B4280' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B4280'; }}>
          <Icon d={ICONS.logout} size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon, delay }) => (
  <div className={`admin-stat-card admin-fade admin-fade-${delay}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        <Icon d={icon} size={18} />
      </div>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, color: '#2D2660', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#E8E0FF', lineHeight: 1, marginBottom: 6 }}>{value}</p>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#4B4280', fontWeight: 400 }}>{sub}</p>
  </div>
);

// ── Mini bar chart ─────────────────────────────────────────────
const MiniBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#7C6FD0', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, color: '#C4B5FD' }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(196,181,253,0.08)' }}>
        <div style={{
          height: 5, borderRadius: 99, width: `${pct}%`,
          background: color ?? 'linear-gradient(90deg,#4F46E5,#7C3AED)',
          transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  );
};

// ── Health ring ────────────────────────────────────────────────
const HealthRing = ({ score }) => {
  const r   = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg viewBox="0 0 130 130" style={{ width: 130, height: 130 }}>
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(196,181,253,0.08)" strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none"
        stroke="url(#healthGrad)" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <defs>
        <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <text x="65" y="60" textAnchor="middle" fill="#E8E0FF"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>{score}</text>
      <text x="65" y="76" textAnchor="middle" fill="#4B4280"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>/ 100</text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { ambassadors, programStats, collegeBattle, weeklyActivity } = useData();

  const F  = "'Syne', sans-serif";
  const FB = "'DM Sans', sans-serif";

  const totalPoints   = ambassadors.reduce((s, a) => s + a.points, 0);
  const activeAmbs    = ambassadors.filter(a => a.active).length;
  const avgPoints     = Math.round(totalPoints / (ambassadors.length || 1));
  const topAmbassador = [...ambassadors].sort((a, b) => b.points - a.points)[0];
  const maxColPoints  = Math.max(...collegeBattle.map(c => c.points));

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0818', fontFamily: FB }}>
        <AdminNav />

        {/* Main */}
        <main style={{ marginLeft: 220, flex: 1, padding: '32px 36px 60px', overflowX: 'hidden' }}>

          {/* Header */}
          <div className="admin-fade admin-fade-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#4B4280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                {today}
              </p>
              <h1 style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: '#E8E0FF', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                Program Overview
              </h1>
              <p style={{ fontFamily: FB, fontSize: 13, color: '#4B4280', marginTop: 4, fontWeight: 400 }}>
                Real-time metrics across your ambassador network
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/ambassadors')}>
                Manage Ambassadors
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/ai-insights')}>
                AI Insights
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard delay={2} label="Total Ambassadors" value={ambassadors.length} sub={`${activeAmbs} active this week`} color="#818CF8" icon={ICONS.ambassadors} />
            <StatCard delay={3} label="Tasks Completed"   value={programStats.tasksCompleted.toLocaleString()} sub="across all ambassadors" color="#10B981" icon={ICONS.tasks} />
            <StatCard delay={4} label="Total XP Awarded"  value={`${(programStats.totalPointsAwarded / 1000).toFixed(0)}K`} sub={`avg ${avgPoints} XP per ambassador`} color="#F59E0B" icon={ICONS.trend_up} />
            <StatCard delay={5} label="Retention Rate"    value={`${programStats.retentionRate}%`} sub="30-day retention" color="#7C3AED" icon={ICONS.health} />
          </div>

          {/* Row 2: Leaderboard + Health */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>

            {/* Top Ambassadors */}
            <div className="admin-fade admin-fade-3" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(196,181,253,0.1)',
              borderRadius: 20, overflow: 'hidden',
            }}>
              <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(196,181,253,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: '#E8E0FF' }}>Top Ambassadors</h2>
                  <p style={{ fontFamily: FB, fontSize: 11, color: '#4B4280', marginTop: 2 }}>Ranked by total XP</p>
                </div>
                <button className="admin-btn admin-btn-ghost" style={{ padding: '6px 14px', fontSize: 11 }}
                  onClick={() => navigate('/admin/ambassadors')}>
                  View All
                </button>
              </div>

              {/* Table header */}
              <div className="admin-table-row" style={{ gridTemplateColumns: '36px 1fr 100px 80px 80px', padding: '10px 24px', gap: 12 }}>
                {['#', 'Ambassador', 'College', 'XP', 'Tasks'].map(h => (
                  <span key={h} style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: '#2D2660', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              {[...ambassadors].sort((a, b) => b.points - a.points).slice(0, 8).map((amb, i) => (
                <div key={amb.id} className="admin-table-row"
                  style={{ gridTemplateColumns: '36px 1fr 100px 80px 80px', padding: '12px 24px', gap: 12 }}>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: i < 3 ? '#C4B5FD' : '#2D2660' }}>
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: '#E8E0FF' }}>{amb.name}</p>
                    <p style={{ fontFamily: FB, fontSize: 10, color: '#4B4280', marginTop: 1 }}>{amb.streak}d streak</p>
                  </div>
                  <span style={{ fontFamily: FB, fontSize: 11, color: '#7C6FD0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{amb.college}</span>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: '#818CF8' }}>{amb.points.toLocaleString()}</span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: '#10B981' }}>{amb.tasksCompleted}</span>
                </div>
              ))}
            </div>

            {/* Right col: health + dropout risk */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Program Health */}
              <div className="admin-fade admin-fade-4" style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(196,181,253,0.1)',
                borderRadius: 20, padding: '20px 22px',
              }}>
                <h2 style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: '#E8E0FF', marginBottom: 4 }}>Program Health</h2>
                <p style={{ fontFamily: FB, fontSize: 11, color: '#4B4280', marginBottom: 16 }}>Overall system score</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <HealthRing score={programStats.programHealthScore} />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: FB, fontSize: 11, color: '#7C6FD0' }}>Engagement</span>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#C4B5FD' }}>{programStats.engagementRate}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: 'rgba(196,181,253,0.08)' }}>
                        <div style={{ height: 4, borderRadius: 99, width: `${programStats.engagementRate}%`, background: 'linear-gradient(90deg,#4F46E5,#7C3AED)' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: FB, fontSize: 11, color: '#7C6FD0' }}>Retention</span>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#C4B5FD' }}>{programStats.retentionRate}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: 'rgba(196,181,253,0.08)' }}>
                        <div style={{ height: 4, borderRadius: 99, width: `${programStats.retentionRate}%`, background: 'linear-gradient(90deg,#10B981,#059669)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropout Risk */}
              <div className="admin-fade admin-fade-5" style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 20, padding: '20px 22px', flex: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Icon d={ICONS.warning} size={14} />
                  <h2 style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: '#E8E0FF' }}>Dropout Risk</h2>
                </div>
                <p style={{ fontFamily: FB, fontSize: 11, color: '#4B4280', marginBottom: 14 }}>Ambassadors needing attention</p>
                {programStats.dropoutRisk.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < programStats.dropoutRisk.length - 1 ? '1px solid rgba(196,181,253,0.06)' : 'none',
                  }}>
                    <div>
                      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: '#E8E0FF' }}>{a.name}</p>
                      <p style={{ fontFamily: FB, fontSize: 10, color: '#4B4280', marginTop: 1 }}>Last active {a.lastActive}</p>
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

          {/* Row 3: College Battle + Weekly Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* College Battle */}
            <div className="admin-fade admin-fade-4" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(196,181,253,0.1)',
              borderRadius: 20, padding: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: '#E8E0FF' }}>College Battle</h2>
                  <p style={{ fontFamily: FB, fontSize: 11, color: '#4B4280', marginTop: 2 }}>Rankings by total program XP</p>
                </div>
              </div>
              {collegeBattle.map((c, i) => (
                <MiniBar key={c.college}
                  label={`#${c.rank} ${c.college}`}
                  value={c.points}
                  max={maxColPoints}
                  color={i === 0 ? 'linear-gradient(90deg,#818CF8,#C4B5FD)' : i === 1 ? 'linear-gradient(90deg,#4F46E5,#818CF8)' : 'linear-gradient(90deg,#2D2A6E,#4F46E5)'}
                />
              ))}
            </div>

            {/* Weekly Activity */}
            <div className="admin-fade admin-fade-5" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(196,181,253,0.1)',
              borderRadius: 20, padding: '24px',
            }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: '#E8E0FF' }}>Weekly XP Activity</h2>
                <p style={{ fontFamily: FB, fontSize: 11, color: '#4B4280', marginTop: 2 }}>Points distributed across the week</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
                {weeklyActivity.map((d, i) => {
                  const maxPts = Math.max(...weeklyActivity.map(x => x.points));
                  const pct    = (d.points / maxPts) * 100;
                  return (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: '#4B4280' }}>{d.points}</span>
                      <div style={{ width: '100%', height: 80, background: 'rgba(196,181,253,0.06)', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: `${pct}%`,
                          background: i === 4
                            ? 'linear-gradient(180deg,#C4B5FD,#7C3AED)'
                            : 'linear-gradient(180deg,#818CF8,#4F46E5)',
                          borderRadius: 6,
                          transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                          boxShadow: i === 4 ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
                        }} />
                      </div>
                      <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: '#4B4280' }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Summary pills */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total this week', value: `${weeklyActivity.reduce((s, d) => s + d.points, 0).toLocaleString()} XP` },
                  { label: 'Peak day', value: weeklyActivity.reduce((a, b) => a.points > b.points ? a : b).day },
                  { label: 'Total tasks', value: weeklyActivity.reduce((s, d) => s + d.tasks, 0) },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)',
                    borderRadius: 10, padding: '8px 14px',
                  }}>
                    <p style={{ fontFamily: FB, fontSize: 10, color: '#4B4280' }}>{label}</p>
                    <p style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: '#C4B5FD', marginTop: 2 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick nav row */}
          <div className="admin-fade admin-fade-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 20 }}>
            {[
              { label: 'Ambassador Management', sub: 'View and manage all ambassadors', path: '/admin/ambassadors', icon: ICONS.ambassadors, color: '#818CF8' },
              { label: 'Task Management',        sub: 'Create and track tasks',          path: '/admin/tasks',       icon: ICONS.tasks,       color: '#10B981' },
              { label: 'Analytics',              sub: 'Deep program analytics',          path: '/admin/analytics',   icon: ICONS.analytics,   color: '#F59E0B' },
              { label: 'AI Insights',            sub: 'AI-generated recommendations',   path: '/admin/ai-insights', icon: ICONS.insights,    color: '#7C3AED' },
            ].map(({ label, sub, path, icon, color }) => (
              <button key={path} onClick={() => navigate(path)}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(196,181,253,0.1)',
                  borderRadius: 16, padding: '18px 20px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(196,181,253,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 12 }}>
                  <Icon d={icon} size={16} />
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, color: '#E8E0FF', marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#4B4280', fontWeight: 400 }}>{sub}</p>
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}