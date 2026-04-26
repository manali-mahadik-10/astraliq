import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import AmbassadorNav from '../../components/AmbassadorNav';
import { getLevelFromPoints, getLevelProgress, getPointsToNextLevel, formatNumber } from '../../utils/gameEngine';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';

/* ── Icons ── */
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
);
const LightningIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>;
const FireIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>;
const CrownIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>;
const StarIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const UsersIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const BookIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>;
const PenIcon      = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const MicIcon      = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93H2c0 4.97 3.53 9.09 8 9.93V22h4v-4.07c4.47-.84 8-4.96 8-9.93h-2c0 4.08-3.06 7.44-7 7.93V16h-2v-.07z"/></svg>;
const TrendIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>;

const taskIcon = (cat) => ({
  'Social Media': <InstagramIcon/>, 'Referral': <UsersIcon/>,
  'Learning': <BookIcon/>, 'Content': <PenIcon/>, 'Event': <MicIcon/>
}[cat] || <StarIcon/>);

const taskColors = {
  'Social Media': { bg:'#FDF2F8', color:'#DB2777', shadow:'rgba(219,39,119,0.2)', darkBg:'#2D1B2E', darkColor:'#F472B6' },
  'Referral':     { bg:'#F0FDF4', color:'#16A34A', shadow:'rgba(22,163,74,0.2)',   darkBg:'#0F2D1B', darkColor:'#4ADE80' },
  'Learning':     { bg:'#EFF6FF', color:'#2563EB', shadow:'rgba(37,99,235,0.2)',   darkBg:'#0F1D3D', darkColor:'#60A5FA' },
  'Content':      { bg:'#FFFBEB', color:'#D97706', shadow:'rgba(217,119,6,0.2)',   darkBg:'#2D1F0A', darkColor:'#FCD34D' },
  'Event':        { bg:'#F5F3FF', color:'#7C3AED', shadow:'rgba(124,58,237,0.2)', darkBg:'#1E1040', darkColor:'#A78BFA' },
};
const getTaskColor = (cat, isDark) => {
  const c = taskColors[cat] || { bg:'#F8F8F8', color:'#6366F1', shadow:'rgba(99,102,241,0.2)', darkBg:'#1A1A2E', darkColor:'#818CF8' };
  return isDark ? { bg: c.darkBg, color: c.darkColor, shadow: c.shadow } : { bg: c.bg, color: c.color, shadow: c.shadow };
};

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label, isDark, F }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDark ? 'linear-gradient(135deg,#1E1A3E,#2D1B69)' : 'white',
      border: `1.5px solid ${isDark ? '#4F46E5' : '#EDE9FE'}`,
      borderRadius: 16, padding: '10px 16px',
      boxShadow: isDark ? '0 8px 30px rgba(79,70,229,0.3)' : '0 8px 30px rgba(124,58,237,0.15)',
      fontFamily: F,
    }}>
      <p style={{ fontSize:10, fontWeight:800, color: isDark ? '#7C6FD0' : '#9CA3AF',
        textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:22, fontWeight:900, color: isDark ? '#C4B5FD' : '#4F46E5', lineHeight:1 }}>
        {payload[0].value} <span style={{ fontSize:11, fontWeight:700, opacity:0.6 }}>XP</span>
      </p>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, icon, bg, iconBg, iconColor, valueColor, shadow }) {
  return (
    <div style={{
      flex:1, display:'flex', flexDirection:'column', gap:10, position:'relative',
      overflow:'hidden', background:bg, boxShadow:`0 8px 30px ${shadow}`,
      borderRadius:22, padding:'18px 16px', cursor:'default',
      transition:'transform 0.2s, box-shadow 0.2s', fontFamily:"'Plus Jakarta Sans', sans-serif"
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
      <div style={{ width:44, height:44, borderRadius:13, display:'flex', alignItems:'center',
        justifyContent:'center', background:iconBg, color:'white', boxShadow:`0 6px 16px ${shadow}` }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize:9, fontWeight:800, color:iconColor, letterSpacing:'0.18em',
          textTransform:'uppercase', marginBottom:4, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
          {label}
        </p>
        <p style={{ fontSize:30, fontWeight:900, lineHeight:1, color:valueColor,
          fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize:10, fontWeight:700, marginTop:3, color:iconColor,
            fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
            {sub}
          </p>
        )}
      </div>
      <div style={{ position:'absolute', bottom:-12, right:-12, width:56, height:56,
        borderRadius:'50%', background:iconColor, opacity:0.1 }}/>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════ */
export default function AmbassadorDashboard() {
  const { user } = useAuth();
  const { weeklyActivity, tasks, getLeaderboard, getCurrentAmbassador } = useData();
  const navigate = useNavigate();
  const [mounted, setMounted]   = useState(false);
  const [animPts, setAnimPts]   = useState(0);
  const [isDark, setIsDark]     = useState(() => localStorage.getItem('astraliq-theme') === 'dark');

  // ── KEY FIX: read live ambassador data from DataContext, not stale AuthContext ──
  const liveAmb   = getCurrentAmbassador(user?.id) ?? user ?? {};
  const points    = liveAmb.points ?? 0;
  const level     = getLevelFromPoints(points);
  const progress  = getLevelProgress(points);
  const toNext    = getPointsToNextLevel(points);

  const leaderboard = getLeaderboard();
  const userRank    = leaderboard.findIndex(a => a.email === user?.email) + 1 || 99;
  const activeTasks = tasks.filter(t => t.status === 'active').slice(0, 3);
  const secretTask  = tasks.find(t => t.isSecret);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('astraliq-theme', next ? 'dark' : 'light');
      window.dispatchEvent(new Event('astraliq-theme-change'));
      return next;
    });
  };

  // ── Animate XP counter whenever live points change ──
  useEffect(() => {
    setMounted(true);
    let start    = 0;
    const step   = Math.max(points / 60, 1);
    const timer  = setInterval(() => {
      start += step;
      if (start >= points) { setAnimPts(points); clearInterval(timer); }
      else setAnimPts(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [points]); // re-runs every time XP changes

  const t = {
    bg:              isDark ? '#0D0B1A' : '#F5F3FF',
    card:            isDark ? '#1A1735' : '#FFFFFF',
    cardShadow:      isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(124,58,237,0.07)',
    titleColor:      isDark ? '#E8E0FF' : '#111827',
    subColor:        isDark ? '#6D5ED6' : '#9CA3AF',
    labelColor:      isDark ? '#6D5ED6' : '#D1D5DB',
    pillBg:          isDark ? '#1E1A3E' : '#F0EEFF',
    pillColor:       isDark ? '#7C6FD0' : '#4F46E5',
    cardBorder:      isDark ? '#2A2550' : '#F3F4F6',
    taskRowBg:       isDark ? '#13112B' : '#FAFAFA',
    taskHoverBg:     isDark ? '#1E1A3E' : '#FDFCFF',
    taskHoverBorder: isDark ? '#4F46E5' : '#C4B5FD',
    streakBg:        isDark ? '#1E1040' : 'linear-gradient(135deg,#FFF7ED,#FEF3C7)',
    streakBorder:    isDark ? '#2D2560' : '#FDE68A',
    streakIconBg:    isDark ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'linear-gradient(135deg,#F97316,#EF4444)',
    streakTextTop:   isDark ? '#7C6FD0' : '#F97316',
    streakTextBot:   isDark ? '#C4B5FD' : '#1F2937',
    lbRowHover:      isDark ? '#1E1A3E' : '#F5F3FF',
    lbRow1Bg:        isDark ? '#1C1840' : 'linear-gradient(135deg,#FFFBEB,#FEF3C7)',
    toggleBg:        isDark ? 'linear-gradient(135deg,#FFF8F0,#FEF3C7)' : 'linear-gradient(135deg,#1A1035,#2D1B69)',
    toggleColor:     isDark ? '#D97706' : '#C4B5FD',
    toggleShadow:    isDark ? '0 4px 16px rgba(245,158,11,0.2)' : '0 4px 16px rgba(79,70,229,0.3)',
    chartGridColor:  isDark ? 'rgba(124,111,208,0.08)' : 'rgba(99,102,241,0.06)',
    chartBarInactive:isDark ? '#1E1A3E' : '#EDE9FE',
  };

  const F = "'Plus Jakarta Sans', sans-serif";

  const maxPoints = Math.max(...(weeklyActivity || []).map(d => d.points), 1);
  const barColors = (weeklyActivity || []).map(d =>
    d.points === maxPoints
      ? (isDark ? 'url(#peakDark)' : 'url(#peakLight)')
      : (isDark ? 'url(#normalDark)' : 'url(#normalLight)')
  );

  return (
    <div style={{ minHeight:'100vh', background:t.bg, fontFamily:F, transition:'background 0.4s' }}>
      <AmbassadorNav isDark={isDark}/>

      <main style={{ marginLeft:224, padding:32, maxWidth:1100 }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between',
          marginBottom:28, opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(12px)',
          transition:'all 0.5s' }}>
          <div>
            <p style={{ fontSize:10, fontWeight:800, color:'#A78BFA', letterSpacing:'0.2em',
              textTransform:'uppercase', marginBottom:4, fontFamily:F }}>
              Welcome back
            </p>
            <h1 style={{ fontSize:38, fontWeight:900, color:t.titleColor,
              letterSpacing:'-0.02em', lineHeight:1, fontFamily:F }}>
              Hello, {user?.name?.split(' ')[0]}!
            </h1>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Streak pill */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px',
              borderRadius:16, background:t.streakBg, border:`1.5px solid ${t.streakBorder}`,
              boxShadow:'0 4px 16px rgba(245,158,11,0.1)' }}>
              <div style={{ width:34, height:34, borderRadius:10, display:'flex',
                alignItems:'center', justifyContent:'center', color:'white',
                background:t.streakIconBg, boxShadow:'0 4px 12px rgba(249,115,22,0.3)', flexShrink:0 }}>
                <FireIcon/>
              </div>
              <div>
                <p style={{ fontSize:9, fontWeight:800, color:t.streakTextTop,
                  textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:F }}>
                  You're on fire!
                </p>
                <p style={{ fontSize:12, fontWeight:800, color:t.streakTextBot, fontFamily:F }}>
                  {liveAmb.streak ?? user?.streak ?? 1}-day streak going!
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px',
                borderRadius:99, border:'none', cursor:'pointer', fontFamily:F,
                background:t.toggleBg, color:t.toggleColor, fontSize:12, fontWeight:800,
                letterSpacing:'0.04em', boxShadow:t.toggleShadow, transition:'all 0.3s' }}>
              {isDark ? <SunIcon/> : <MoonIcon/>}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* ── ROW 1: STAT CARDS ── */}
        <div style={{ display:'flex', gap:12, marginBottom:14,
          opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(12px)',
          transition:'all 0.5s 0.1s' }}>

          {/* XP Hero card */}
          <div style={{ flex:1.5, borderRadius:24, padding:'24px 28px', display:'flex',
            flexDirection:'column', justifyContent:'space-between', minHeight:190,
            position:'relative', overflow:'hidden',
            background: isDark
              ? 'linear-gradient(135deg,#0F0C29 0%,#1E1040 50%,#2D1B69 100%)'
              : 'linear-gradient(135deg,#4F46E5 0%,#7C3AED 60%,#9333EA 100%)',
            boxShadow: isDark
              ? '0 20px 60px rgba(79,70,229,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 20px 60px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none',
              backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px)',
              backgroundSize:'22px 22px' }}/>
            <div style={{ position:'absolute', top:0, right:0, width:160, height:160,
              borderRadius:'50%', pointerEvents:'none',
              background:'radial-gradient(circle,rgba(255,255,255,0.08),transparent)',
              transform:'translate(30%,-30%)' }}/>
            {isDark && [{top:'12%',left:'18%',s:2},{top:'38%',left:'62%',s:1.5},
              {top:'68%',left:'28%',s:1},{top:'22%',left:'78%',s:2},
              {top:'58%',left:'82%',s:1.5},{top:'82%',left:'55%',s:1},
            ].map((st,i) => (
              <div key={i} style={{ position:'absolute', top:st.top, left:st.left,
                width:st.s, height:st.s, borderRadius:'50%', background:'white',
                opacity:0.5, pointerEvents:'none' }}/>
            ))}
            <div style={{ position:'relative' }}>
              <p style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.5)',
                letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:8, fontFamily:F }}>
                Current XP
              </p>
              {/* ── animPts re-animates whenever points changes ── */}
              <p style={{ fontSize:64, fontWeight:900, color:'white', lineHeight:1,
                letterSpacing:'-0.03em', fontFamily:F }}>
                {formatNumber(animPts)}
              </p>
              <p style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', marginTop:4, fontFamily:F }}>
                {level.name} {level.emoji} Ambassador
              </p>
            </div>
            <div style={{ position:'relative', marginTop:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:9,
                fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:6,
                textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:F }}>
                <span>Level Progress</span>
                <span>{toNext > 0 ? `${toNext} to next` : 'MAX LEVEL!'}</span>
              </div>
              <div style={{ height:6, borderRadius:99, background:'rgba(255,255,255,0.12)' }}>
                <div style={{ height:6, borderRadius:99, width:mounted?`${progress}%`:'0%',
                  background:'linear-gradient(90deg,rgba(255,255,255,0.5),white)',
                  boxShadow:'0 0 12px rgba(255,255,255,0.4)', transition:'width 1s 0.4s' }}/>
              </div>
            </div>
          </div>

          <StatCard
            label="Your Level" value={level.name} sub={level.emoji + ' Rank'}
            icon={<CrownIcon/>}
            bg={isDark ? '#1C1840' : '#FFFBEB'}
            iconBg={isDark ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'linear-gradient(135deg,#F59E0B,#FCD34D)'}
            iconColor={isDark ? '#C4B5FD' : '#D97706'}
            valueColor={isDark ? '#E8E0FF' : '#111827'}
            shadow={isDark ? 'rgba(79,70,229,0.15)' : 'rgba(245,158,11,0.2)'}/>

          <StatCard
            label="Day Streak" value={liveAmb.streak ?? user?.streak ?? 1} sub="Keep it going!"
            icon={<FireIcon/>}
            bg={isDark ? '#1C1228' : '#FFF7ED'}
            iconBg={isDark ? 'linear-gradient(135deg,#9333EA,#C026D3)' : 'linear-gradient(135deg,#F97316,#EF4444)'}
            iconColor={isDark ? '#E879F9' : '#EA580C'}
            valueColor={isDark ? '#E8E0FF' : '#111827'}
            shadow={isDark ? 'rgba(147,51,234,0.15)' : 'rgba(249,115,22,0.2)'}/>

          <StatCard
            label="Global Rank" value={`#${userRank}`} sub="Keep climbing!"
            icon={<CrownIcon/>}
            bg={isDark ? '#0F1A2E' : '#F0FDF4'}
            iconBg={isDark ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : 'linear-gradient(135deg,#10B981,#059669)'}
            iconColor={isDark ? '#7DD3FC' : '#059669'}
            valueColor={isDark ? '#E8E0FF' : '#111827'}
            shadow={isDark ? 'rgba(14,165,233,0.15)' : 'rgba(16,185,129,0.2)'}/>

          <StatCard
            label="Tasks Done" value={liveAmb.tasksCompleted ?? user?.tasksCompleted ?? 0}
            sub={`${(liveAmb.badges ?? user?.badges ?? []).length} badges`}
            icon={<LightningIcon/>}
            bg={isDark ? '#1A0F2E' : '#FDF4FF'}
            iconBg={isDark ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : 'linear-gradient(135deg,#A855F7,#7C3AED)'}
            iconColor={isDark ? '#FCD34D' : '#7C3AED'}
            valueColor={isDark ? '#E8E0FF' : '#111827'}
            shadow={isDark ? 'rgba(245,158,11,0.15)' : 'rgba(168,85,247,0.2)'}/>
        </div>

        {/* ── ROW 2: CHART + LEADERBOARD ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:14, marginBottom:14,
          opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(12px)',
          transition:'all 0.5s 0.2s' }}>

          {/* Chart */}
          <div style={{ borderRadius:24, padding:'24px 26px', background:t.card,
            boxShadow:t.cardShadow, position:'relative', overflow:'hidden' }}>
            {isDark && (
              <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
                width:300, height:120, borderRadius:'50%',
                background:'radial-gradient(ellipse, rgba(79,70,229,0.12), transparent)',
                pointerEvents:'none' }}/>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:900, color:t.titleColor, marginBottom:2, fontFamily:F }}>
                  Weekly Activity
                </h2>
                <p style={{ fontSize:10, fontWeight:700, color:t.labelColor,
                  textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:F }}>
                  XP earned per day
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                <div style={{ padding:'5px 12px', borderRadius:99, background:t.pillBg,
                  color:t.pillColor, fontSize:10, fontWeight:800, fontFamily:F }}>
                  This Week
                </div>
                <p style={{ fontSize:10, fontWeight:700, color:t.subColor, fontFamily:F,
                  display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ color: isDark ? '#4ADE80' : '#10B981' }}><TrendIcon/></span>
                  {(weeklyActivity || []).reduce((s,d) => s + d.points, 0)} XP this week
                </p>
              </div>
            </div>

            <div style={{ display:'flex', gap:6, marginBottom:16, marginTop:10, flexWrap:'wrap' }}>
              {(weeklyActivity || []).map((d,i) => (
                <div key={i} style={{
                  padding:'3px 10px', borderRadius:99, fontFamily:F,
                  fontSize:9, fontWeight:800, letterSpacing:'0.08em',
                  background: d.points === maxPoints
                    ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : t.pillBg,
                  color: d.points === maxPoints ? 'white' : t.pillColor,
                  boxShadow: d.points === maxPoints ? '0 4px 12px rgba(79,70,229,0.35)' : 'none',
                }}>
                  {d.day}
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={weeklyActivity} barSize={28} barCategoryGap="20%"
                margin={{ top:4, right:4, left:4, bottom:0 }}>
                <defs>
                  <linearGradient id="peakLight"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#4F46E5" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="normalLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#C4B5FD" stopOpacity={0.7}/>
                    <stop offset="100%" stopColor="#DDD6FE" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="peakDark"   x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#A78BFA" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.9}/>
                  </linearGradient>
                  <linearGradient id="normalDark"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3B2F6E" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#1E1A3E" stopOpacity={0.6}/>
                  </linearGradient>
                  <filter id="barGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fontSize:11, fill:t.subColor, fontFamily:F, fontWeight:700 }}/>
                <YAxis hide/>
                <Tooltip content={<CustomTooltip isDark={isDark} F={F}/>} cursor={{ fill:'transparent' }}/>
                <Bar dataKey="points" radius={[12,12,4,4]}>
                  {(weeklyActivity || []).map((d,i) => (
                    <Cell key={i} fill={barColors[i]}
                      filter={d.points === maxPoints ? 'url(#barGlow)' : undefined}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leaderboard */}
          <div style={{ borderRadius:24, padding:'24px 22px', background:t.card, boxShadow:t.cardShadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:t.titleColor, fontFamily:F }}>Top Ranks</h2>
              <button onClick={() => navigate('/ambassador/leaderboard')}
                style={{ padding:'5px 12px', borderRadius:99, border:'none', cursor:'pointer',
                  background:t.pillBg, color:t.pillColor, fontSize:10, fontWeight:800, fontFamily:F }}>
                See all →
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {leaderboard.slice(0, 4).map((amb, i) => (
                <div key={amb.id}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                    borderRadius:14, cursor:'pointer', transition:'background 0.2s',
                    background: i === 0 ? t.lbRow1Bg : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.lbRowHover}
                  onMouseLeave={e => e.currentTarget.style.background = i === 0 ? t.lbRow1Bg : 'transparent'}>
                  <div style={{ width:32, height:32, borderRadius:10, display:'flex',
                    alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900,
                    flexShrink:0, fontFamily:F,
                    background: i === 0 ? 'linear-gradient(135deg,#F59E0B,#FCD34D)' :
                                i === 1 ? 'linear-gradient(135deg,#9CA3AF,#D1D5DB)' :
                                i === 2 ? 'linear-gradient(135deg,#F97316,#FB923C)' : t.pillBg,
                    color: i > 2 ? t.pillColor : 'white',
                    boxShadow: i === 0 ? '0 4px 12px rgba(245,158,11,0.4)' : 'none' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:800, color:t.titleColor, fontFamily:F,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{amb.name}</p>
                    <p style={{ fontSize:10, fontWeight:600, color:t.subColor, fontFamily:F,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{amb.college}</p>
                  </div>
                  <p style={{ fontSize:12, fontWeight:900, color:t.pillColor, fontFamily:F }}>
                    {formatNumber(amb.points)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 3: TASKS + SECRET ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:14,
          opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(12px)',
          transition:'all 0.5s 0.3s' }}>

          {/* Active Tasks */}
          <div style={{ borderRadius:24, padding:'24px 26px', background:t.card, boxShadow:t.cardShadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:t.titleColor, fontFamily:F }}>Active Tasks</h2>
              <button onClick={() => navigate('/ambassador/tasks')}
                style={{ padding:'5px 12px', borderRadius:99, border:'none', cursor:'pointer',
                  background:t.pillBg, color:t.pillColor, fontSize:10, fontWeight:800, fontFamily:F }}>
                See all →
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {activeTasks.map(task => {
                const tc = getTaskColor(task.category, isDark);
                return (
                  <div key={task.id} onClick={() => navigate('/ambassador/tasks')}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px',
                      borderRadius:16, cursor:'pointer', transition:'all 0.2s',
                      border:`1.5px solid ${t.cardBorder}`, background:t.taskRowBg }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = t.taskHoverBorder;
                      e.currentTarget.style.background  = t.taskHoverBg;
                      e.currentTarget.style.transform   = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = t.cardBorder;
                      e.currentTarget.style.background  = t.taskRowBg;
                      e.currentTarget.style.transform   = 'none';
                    }}>
                    <div style={{ width:40, height:40, borderRadius:12, display:'flex',
                      alignItems:'center', justifyContent:'center', flexShrink:0,
                      background:tc.bg, color:tc.color, boxShadow:`0 4px 12px ${tc.shadow}` }}>
                      {taskIcon(task.category)}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:t.titleColor, fontFamily:F,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {task.title}
                      </p>
                      <p style={{ fontSize:10, fontWeight:600, color:t.subColor, marginTop:2, fontFamily:F }}>
                        Due {task.deadline}
                      </p>
                    </div>
                    <div style={{ padding:'6px 12px', borderRadius:10, background:t.pillBg,
                      color:t.pillColor, fontSize:13, fontWeight:900, flexShrink:0, fontFamily:F }}>
                      +{task.points}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secret Mission */}
          <div onClick={() => navigate('/ambassador/tasks')}
            style={{ borderRadius:24, padding:26, display:'flex', flexDirection:'column',
              justifyContent:'space-between', position:'relative', overflow:'hidden',
              cursor:'pointer', minHeight:240, transition:'transform 0.3s',
              background: isDark
                ? 'linear-gradient(145deg,#0D0B1A 0%,#1E1040 50%,#2D1B69 100%)'
                : 'linear-gradient(145deg,#1A1035 0%,#2D1B69 50%,#3B0764 100%)',
              boxShadow: isDark
                ? '0 16px 48px rgba(124,58,237,0.25)'
                : '0 16px 48px rgba(124,58,237,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none',
              backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.25) 1px,transparent 1px)',
              backgroundSize:'18px 18px', opacity:0.1 }}/>
            <div style={{ position:'absolute', top:0, right:0, width:120, height:120,
              borderRadius:'50%', pointerEvents:'none',
              background:'radial-gradient(circle,rgba(124,58,237,0.5),transparent)',
              transform:'translate(20%,-20%)' }}/>
            {[{top:'12%',left:'12%',s:2},{top:'32%',left:'72%',s:1.5},
              {top:'62%',left:'22%',s:1},{top:'78%',left:'68%',s:2},
              {top:'48%',left:'48%',s:1.5},{top:'18%',left:'88%',s:1}
            ].map((st,i) => (
              <div key={i} style={{ position:'absolute', top:st.top, left:st.left,
                width:st.s, height:st.s, borderRadius:'50%', background:'white',
                opacity:0.4, pointerEvents:'none' }}/>
            ))}
            <div style={{ position:'relative' }}>
              <div style={{ width:44, height:44, borderRadius:14, display:'flex',
                alignItems:'center', justifyContent:'center', marginBottom:16, color:'#1A1A2E',
                background:'linear-gradient(135deg,#FBBF24,#F59E0B)',
                boxShadow:'0 8px 24px rgba(251,191,36,0.4)' }}>
                <LightningIcon/>
              </div>
              <p style={{ fontSize:9, fontWeight:900, color:'#9F7AEA', letterSpacing:'0.25em',
                textTransform:'uppercase', marginBottom:8, fontFamily:F }}>
                Secret Mission
              </p>
              <h3 style={{ fontSize:28, fontWeight:900, color:'white', lineHeight:1.2,
                marginBottom:10, fontFamily:F }}>
                Viral<br/>Challenge
              </h3>
              <p style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)',
                lineHeight:1.6, fontFamily:F }}>
                First 5 to complete get 2x points. Limited time only!
              </p>
            </div>
            <div style={{ position:'relative', display:'flex', alignItems:'center',
              justifyContent:'space-between', marginTop:20 }}>
              <div style={{ padding:'8px 16px', borderRadius:12, fontSize:13, fontWeight:900,
                color:'white', fontFamily:F,
                background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
                boxShadow:'0 4px 16px rgba(79,70,229,0.5)' }}>
                +{secretTask?.points ?? 800} pts
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:800,
                  textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:F }}>
                  Expires
                </p>
                <p style={{ fontSize:14, fontWeight:900, color:'#FBBF24', fontFamily:F }}>
                  {secretTask?.expiresIn ?? '18h 42m'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}