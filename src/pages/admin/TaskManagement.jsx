import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  .tm * { box-sizing:border-box; margin:0; padding:0; }

  @keyframes tm-fadeUp {
    from { opacity:0; transform:translateY(24px) scale(.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes tm-blink { 0%,100%{opacity:1;} 50%{opacity:.3;} }
  @keyframes tm-spin  { to { transform:rotate(360deg); } }
  @keyframes tm-pulse {
    0%,100%{transform:scale(1);opacity:.6;}
    50%{transform:scale(1.12);opacity:.2;}
  }
  @keyframes tm-slide-in {
    from { opacity:0; transform:translateX(40px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes tm-overlay-in {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes tm-modal-in {
    from { opacity:0; transform:scale(.92) translateY(20px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }

  .tm-f1 { animation:tm-fadeUp .6s cubic-bezier(.16,1,.3,1) .05s both; }
  .tm-f2 { animation:tm-fadeUp .6s cubic-bezier(.16,1,.3,1) .12s both; }
  .tm-f3 { animation:tm-fadeUp .6s cubic-bezier(.16,1,.3,1) .19s both; }
  .tm-f4 { animation:tm-fadeUp .6s cubic-bezier(.16,1,.3,1) .26s both; }
  .tm-f5 { animation:tm-fadeUp .6s cubic-bezier(.16,1,.3,1) .33s both; }

  .tm-nav-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 14px; border-radius:12px; width:100%;
    border:none; cursor:pointer; text-align:left;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600;
    transition:all .2s; background:transparent; color:#4B4280;
  }
  .tm-nav-item:hover { background:rgba(196,181,253,.07); color:#C4B5FD; }
  .tm-nav-item.active {
    background:linear-gradient(135deg,#4F46E5,#7C3AED);
    color:white; box-shadow:0 4px 14px rgba(79,70,229,.35);
  }

  .tm-card {
    background:rgba(255,255,255,.025);
    border:1px solid rgba(196,181,253,.1);
    border-radius:20px;
    transition:all .3s cubic-bezier(.16,1,.3,1);
    transform-style:preserve-3d;
  }
  .tm-card:hover {
    border-color:rgba(196,181,253,.22);
    transform:translateY(-3px) perspective(600px) rotateX(1deg);
    box-shadow:0 20px 50px rgba(0,0,0,.4), 0 0 30px rgba(79,70,229,.1);
  }

  .tm-photo-card {
    background:rgba(255,255,255,.03);
    border:1.5px solid rgba(196,181,253,.12);
    border-radius:16px; overflow:hidden;
    transition:all .3s cubic-bezier(.16,1,.3,1);
    cursor:pointer; transform-style:preserve-3d;
  }
  .tm-photo-card:hover {
    border-color:rgba(124,58,237,.45);
    transform:translateY(-4px) perspective(500px) rotateX(2deg) rotateY(-1deg);
    box-shadow:0 18px 48px rgba(0,0,0,.5), 0 0 30px rgba(124,58,237,.2);
  }

  .tm-tab {
    padding:8px 18px; border-radius:10px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700;
    letter-spacing:.04em; transition:all .25s; text-transform:uppercase;
  }
  .tm-tab-active {
    background:linear-gradient(135deg,#4F46E5,#7C3AED);
    color:white; box-shadow:0 4px 14px rgba(79,70,229,.4);
  }
  .tm-tab-inactive {
    background:rgba(196,181,253,.07); color:#4B4280;
    border:1px solid rgba(196,181,253,.1);
  }
  .tm-tab-inactive:hover { background:rgba(196,181,253,.12); color:#C4B5FD; }

  .tm-btn-approve {
    display:flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:800;
    letter-spacing:.06em; text-transform:uppercase;
    background:rgba(16,185,129,.12); color:#10B981;
    border:1px solid rgba(16,185,129,.25);
    transition:all .2s;
  }
  .tm-btn-approve:hover { background:rgba(16,185,129,.22); transform:translateY(-1px); box-shadow:0 4px 16px rgba(16,185,129,.25); }

  .tm-btn-reject {
    display:flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:800;
    letter-spacing:.06em; text-transform:uppercase;
    background:rgba(239,68,68,.1); color:#F87171;
    border:1px solid rgba(239,68,68,.22);
    transition:all .2s;
  }
  .tm-btn-reject:hover { background:rgba(239,68,68,.2); transform:translateY(-1px); }

  .tm-btn-primary {
    display:flex; align-items:center; gap:8px;
    padding:10px 22px; border-radius:12px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:800;
    letter-spacing:.05em; text-transform:uppercase;
    background:linear-gradient(135deg,#4F46E5,#7C3AED); color:white;
    box-shadow:0 6px 22px rgba(79,70,229,.4);
    transition:all .3s cubic-bezier(.16,1,.3,1);
  }
  .tm-btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(79,70,229,.55); }

  .tm-btn-ghost {
    display:flex; align-items:center; gap:8px;
    padding:10px 22px; border-radius:12px; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700;
    letter-spacing:.04em; text-transform:uppercase;
    background:rgba(196,181,253,.07); color:#7C6FD0;
    border:1px solid rgba(196,181,253,.15);
    transition:all .2s;
  }
  .tm-btn-ghost:hover { background:rgba(196,181,253,.13); color:#C4B5FD; }

  .tm-input {
    width:100%; padding:11px 14px;
    background:rgba(255,255,255,.04);
    border:1.5px solid rgba(196,181,253,.15);
    border-radius:12px; color:#E8E0FF;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:500;
    outline:none; transition:border-color .25s, box-shadow .25s;
  }
  .tm-input::placeholder { color:#4B4280; }
  .tm-input:focus { border-color:rgba(124,58,237,.6); box-shadow:0 0 0 3px rgba(124,58,237,.12); }

  .tm-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:200;
    display:flex; align-items:center; justify-content:center;
    animation:tm-overlay-in .2s ease both;
    backdrop-filter:blur(8px);
  }
  .tm-modal {
    background:#0F0D24; border:1.5px solid rgba(196,181,253,.18);
    border-radius:28px; padding:32px;
    box-shadow:0 40px 100px rgba(0,0,0,.8), 0 0 60px rgba(79,70,229,.15);
    animation:tm-modal-in .35s cubic-bezier(.16,1,.3,1) both;
    max-height:90vh; overflow-y:auto;
  }
`;

// ── SVG Icons ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:size, height:size, flexShrink:0, ...style }}>
    <path d={d}/>
  </svg>
);
const IC = {
  dashboard:   'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  ambassadors: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  tasks:       'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  analytics:   'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  insights:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
  logout:      'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
  plus:        'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  check:       'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  x:           'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  eye:         'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  photo:       'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  clock:       'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  star:        'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  filter:      'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  search:      'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  warning:     'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  trash:       'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  edit:        'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  expand:      'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',
  xp:          'M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z',
};

// ── Admin Nav ──────────────────────────────────────────────────
const AdminNav = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const F = "'Plus Jakarta Sans',sans-serif";
  const nav = [
    { label:'Dashboard',   path:'/admin/dashboard',   icon:IC.dashboard   },
    { label:'Ambassadors', path:'/admin/ambassadors', icon:IC.ambassadors },
    { label:'Tasks',       path:'/admin/tasks',       icon:IC.tasks       },
    { label:'Analytics',   path:'/admin/analytics',   icon:IC.analytics   },
    { label:'AI Insights', path:'/admin/ai-insights', icon:IC.insights    },
  ];
  return (
    <aside style={{ position:'fixed',left:0,top:0,height:'100vh',width:220,
      background:'#0D0B1F', borderRight:'1px solid rgba(196,181,253,.08)',
      display:'flex',flexDirection:'column',zIndex:50,
      boxShadow:'4px 0 30px rgba(0,0,0,.5)' }}>
      <div style={{ padding:'24px 20px 18px', borderBottom:'1px solid rgba(196,181,253,.07)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer' }} onClick={()=>navigate('/')}>
          <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:F,fontWeight:900,fontSize:15,color:'white',
            boxShadow:'0 4px 14px rgba(79,70,229,.4)' }}>A</div>
          <div>
            <p style={{ fontFamily:F,fontSize:14,fontWeight:900,color:'#E8E0FF',lineHeight:1 }}>AstralIQ</p>
            <p style={{ fontFamily:F,fontSize:10,fontWeight:500,color:'#4B4280',marginTop:2 }}>Admin Console</p>
          </div>
        </div>
      </div>
      <div style={{ margin:'14px 14px 6px',padding:'12px 14px',borderRadius:14,
        background:'rgba(79,70,229,.1)',border:'1px solid rgba(79,70,229,.2)' }}>
        <p style={{ fontFamily:F,fontSize:12,fontWeight:800,color:'#C4B5FD',lineHeight:1 }}>{user?.name??'Admin'}</p>
        <p style={{ fontFamily:F,fontSize:10,color:'#4B4280',marginTop:3 }}>Organization Admin</p>
        <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:8 }}>
          <div style={{ width:5,height:5,borderRadius:'50%',background:'#10B981',animation:'tm-blink 2s ease-in-out infinite' }}/>
          <span style={{ fontFamily:F,fontSize:10,color:'#10B981',fontWeight:600 }}>System Online</span>
        </div>
      </div>
      <div style={{ flex:1,padding:'8px 10px',overflowY:'auto' }}>
        <p style={{ fontFamily:F,fontSize:9,fontWeight:700,color:'#2D2660',letterSpacing:'.2em',
          textTransform:'uppercase',padding:'8px 4px 6px',marginBottom:4 }}>Navigation</p>
        {nav.map(({ label,path,icon }) => {
          const active = location.pathname===path;
          return (
            <button key={path} onClick={()=>navigate(path)}
              className={`tm-nav-item${active?' active':''}`} style={{ marginBottom:2 }}>
              <Ic d={icon} size={16}/><span>{label}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding:'10px 10px 20px',borderTop:'1px solid rgba(196,181,253,.07)' }}>
        <button className="tm-nav-item" onClick={()=>{logout();navigate('/');}}
          style={{ color:'#4B4280' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,.1)';e.currentTarget.style.color='#F87171';}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#4B4280';}}>
          <Ic d={IC.logout} size={16}/><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

// ── Mock pending submissions ───────────────────────────────────
const MOCK_SUBMISSIONS = [
  { id:'s1', ambassadorName:'Priya Sharma',   college:'Mumbai University', taskTitle:'Instagram Story Post',   xp:120, submittedAt:'2h ago',   status:'pending',  photoUrl:'https://picsum.photos/seed/task1/400/300', notes:'Posted on my story with the campaign hashtag.' },
  { id:'s2', ambassadorName:'Arjun Mehta',    college:'IIT Bombay',        taskTitle:'College Fest Booth',     xp:250, submittedAt:'4h ago',   status:'pending',  photoUrl:'https://picsum.photos/seed/task2/400/300', notes:'Set up booth at the annual fest. Got 40+ sign-ups.' },
  { id:'s3', ambassadorName:'Sneha Patil',    college:'Pune University',   taskTitle:'Referral Drive',         xp:180, submittedAt:'6h ago',   status:'pending',  photoUrl:'https://picsum.photos/seed/task3/400/300', notes:'Referred 5 new ambassadors through my network.' },
  { id:'s4', ambassadorName:'Rahul Kumar',    college:'Delhi University',  taskTitle:'LinkedIn Post',          xp:90,  submittedAt:'1d ago',   status:'approved', photoUrl:'https://picsum.photos/seed/task4/400/300', notes:'Published a post about AstralIQ benefits.' },
  { id:'s5', ambassadorName:'Ananya Singh',   college:'VIT Vellore',       taskTitle:'Campus Presentation',    xp:300, submittedAt:'1d ago',   status:'rejected', photoUrl:'https://picsum.photos/seed/task5/400/300', notes:'Presented to 30 students in the CS department.' },
  { id:'s6', ambassadorName:'Karan Joshi',    college:'BITS Pilani',       taskTitle:'WhatsApp Campaign',      xp:150, submittedAt:'2d ago',   status:'approved', photoUrl:'https://picsum.photos/seed/task6/400/300', notes:'Sent campaign messages to 3 groups.' },
  { id:'s7', ambassadorName:'Riya Desai',     college:'NIT Surathkal',     taskTitle:'YouTube Shorts Post',    xp:200, submittedAt:'3h ago',   status:'pending',  photoUrl:'https://picsum.photos/seed/task7/400/300', notes:'Created a 45-second short about the platform.' },
  { id:'s8', ambassadorName:'Mohit Verma',    college:'Jadavpur University','taskTitle':'Banner Placement',    xp:110, submittedAt:'5h ago',   status:'pending',  photoUrl:'https://picsum.photos/seed/task8/400/300', notes:'Placed 3 banners around campus notice boards.' },
];

const MOCK_TASKS = [
  { id:'t1', title:'Social Media Post',   xp:100, category:'Social',    assigned:45, completed:38, deadline:'May 5' },
  { id:'t2', title:'Campus Event',        xp:300, category:'Event',     assigned:20, completed:12, deadline:'May 10' },
  { id:'t3', title:'Referral Drive',      xp:200, category:'Referral',  assigned:60, completed:41, deadline:'May 15' },
  { id:'t4', title:'Content Creation',    xp:150, category:'Content',   assigned:30, completed:22, deadline:'May 8'  },
  { id:'t5', title:'Feedback Collection', xp:80,  category:'Research',  assigned:55, completed:50, deadline:'May 3'  },
];

export default function TaskManagement() {
  const F = "'Plus Jakarta Sans',sans-serif";
  const [tab,          setTab]          = useState('submissions'); // 'submissions' | 'tasks'
  const [filter,       setFilter]       = useState('pending');
  const [submissions,  setSubmissions]  = useState(MOCK_SUBMISSIONS);
  const [viewSub,      setViewSub]      = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [newTask,      setNewTask]      = useState({ title:'', xp:'', category:'Social', description:'', deadline:'' });
  const [search,       setSearch]       = useState('');

  const filtered = submissions.filter(s =>
    (filter === 'all' || s.status === filter) &&
    (s.ambassadorName.toLowerCase().includes(search.toLowerCase()) ||
     s.taskTitle.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = (id) => {
    setSubmissions(p => p.map(s => s.id===id ? { ...s, status:'approved' } : s));
    setViewSub(null);
  };
  const reject = (id) => {
    setSubmissions(p => p.map(s => s.id===id ? { ...s, status:'rejected' } : s));
    setViewSub(null);
  };

  const pendingCount  = submissions.filter(s=>s.status==='pending').length;
  const approvedCount = submissions.filter(s=>s.status==='approved').length;
  const rejectedCount = submissions.filter(s=>s.status==='rejected').length;

  const statusColor = (s) => ({
    pending:  { bg:'rgba(245,158,11,.12)',  color:'#FCD34D', border:'rgba(245,158,11,.25)' },
    approved: { bg:'rgba(16,185,129,.1)',   color:'#10B981', border:'rgba(16,185,129,.22)' },
    rejected: { bg:'rgba(239,68,68,.1)',    color:'#F87171', border:'rgba(239,68,68,.2)'   },
  }[s]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="tm" style={{ display:'flex',minHeight:'100vh',background:'#0A0818',fontFamily:F }}>
        <AdminNav />
        <main style={{ marginLeft:220,flex:1,padding:'32px 36px 60px',overflowX:'hidden' }}>

          {/* Header */}
          <div className="tm-f1" style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32 }}>
            <div>
              <p style={{ fontFamily:F,fontSize:11,fontWeight:700,color:'#4B4280',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:6 }}>Admin Console</p>
              <h1 style={{ fontFamily:F,fontSize:28,fontWeight:900,color:'#E8E0FF',lineHeight:1.1,letterSpacing:'-.02em' }}>Task Management</h1>
              <p style={{ fontFamily:F,fontSize:13,color:'#4B4280',marginTop:4 }}>Review submissions, verify photos, manage task catalog</p>
            </div>
            <button className="tm-btn-primary" onClick={()=>setShowCreate(true)}>
              <Ic d={IC.plus} size={16}/>Create Task
            </button>
          </div>

          {/* Summary strip */}
          <div className="tm-f2" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:28 }}>
            {[
              { label:'Pending Review', value:pendingCount,   color:'#FCD34D', icon:IC.clock   },
              { label:'Approved',       value:approvedCount,  color:'#10B981', icon:IC.check   },
              { label:'Rejected',       value:rejectedCount,  color:'#F87171', icon:IC.x       },
              { label:'Active Tasks',   value:MOCK_TASKS.length, color:'#818CF8', icon:IC.tasks },
            ].map(({ label,value,color,icon }) => (
              <div key={label} className="tm-card" style={{ padding:'20px 22px',display:'flex',alignItems:'center',gap:14 }}>
                <div style={{ width:42,height:42,borderRadius:12,background:`${color}18`,
                  display:'flex',alignItems:'center',justifyContent:'center',color,flexShrink:0 }}>
                  <Ic d={icon} size={20}/>
                </div>
                <div>
                  <p style={{ fontFamily:F,fontSize:28,fontWeight:900,color:'#E8E0FF',lineHeight:1 }}>{value}</p>
                  <p style={{ fontFamily:F,fontSize:11,color:'#4B4280',marginTop:3,fontWeight:600 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tm-f3" style={{ display:'flex',gap:8,marginBottom:24 }}>
            {[['submissions','Photo Submissions'],['tasks','Task Catalog']].map(([key,label])=>(
              <button key={key} className={`tm-tab ${tab===key?'tm-tab-active':'tm-tab-inactive'}`}
                onClick={()=>setTab(key)}>{label}</button>
            ))}
          </div>

          {/* ── SUBMISSIONS TAB ── */}
          {tab === 'submissions' && (
            <div className="tm-f3">
              {/* Filters + search */}
              <div style={{ display:'flex',gap:10,marginBottom:22,alignItems:'center' }}>
                <div style={{ position:'relative',flex:1,maxWidth:320 }}>
                  <Ic d={IC.search} size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#4B4280' }}/>
                  <input className="tm-input" placeholder="Search ambassador or task..."
                    value={search} onChange={e=>setSearch(e.target.value)}
                    style={{ paddingLeft:36 }}/>
                </div>
                {['all','pending','approved','rejected'].map(f=>(
                  <button key={f} className={`tm-tab ${filter===f?'tm-tab-active':'tm-tab-inactive'}`}
                    onClick={()=>setFilter(f)} style={{ textTransform:'capitalize' }}>
                    {f==='all'?'All':f} {f==='pending'&&pendingCount>0?`(${pendingCount})`:''}
                  </button>
                ))}
              </div>

              {/* Photo grid */}
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18 }}>
                {filtered.map((sub,i) => {
                  const sc = statusColor(sub.status);
                  return (
                    <div key={sub.id} className="tm-photo-card"
                      style={{ animation:`tm-fadeUp .5s cubic-bezier(.16,1,.3,1) ${i*.06}s both` }}
                      onClick={()=>setViewSub(sub)}>
                      {/* Photo */}
                      <div style={{ position:'relative',height:180,overflow:'hidden',background:'#0D0B1F' }}>
                        <img src={sub.photoUrl} alt="submission"
                          style={{ width:'100%',height:'100%',objectFit:'cover',opacity:.85,transition:'opacity .3s,transform .4s' }}
                          onMouseEnter={e=>{e.target.style.opacity=1;e.target.style.transform='scale(1.04)';}}
                          onMouseLeave={e=>{e.target.style.opacity=.85;e.target.style.transform='scale(1)';}}/>
                        {/* Status badge */}
                        <div style={{ position:'absolute',top:10,right:10,
                          padding:'4px 10px',borderRadius:99,
                          background:sc.bg, border:`1px solid ${sc.border}`,
                          fontFamily:F,fontSize:9,fontWeight:800,color:sc.color,
                          letterSpacing:'.1em',textTransform:'uppercase',backdropFilter:'blur(8px)' }}>
                          {sub.status}
                        </div>
                        {/* XP badge */}
                        <div style={{ position:'absolute',top:10,left:10,
                          padding:'4px 10px',borderRadius:99,
                          background:'rgba(79,70,229,.7)',backdropFilter:'blur(8px)',
                          fontFamily:F,fontSize:9,fontWeight:800,color:'#C4B5FD',
                          border:'1px solid rgba(196,181,253,.3)',letterSpacing:'.08em' }}>
                          +{sub.xp} XP
                        </div>
                        {/* Expand hint */}
                        <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          transition:'background .3s' }}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,0,0,.35)';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0)';
                            e.currentTarget.querySelector('svg').style.opacity=0;}}>
                          <Ic d={IC.expand} size={28} style={{ color:'white',opacity:0,transition:'opacity .3s' }}/>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding:'14px 16px' }}>
                        <p style={{ fontFamily:F,fontSize:13,fontWeight:800,color:'#E8E0FF',marginBottom:3 }}>{sub.taskTitle}</p>
                        <p style={{ fontFamily:F,fontSize:11,fontWeight:600,color:'#7C6FD0',marginBottom:10 }}>{sub.ambassadorName} · {sub.college}</p>
                        <p style={{ fontFamily:F,fontSize:11,color:'#4B4280',lineHeight:1.55,marginBottom:12 }}
                          style={{ display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>
                          {sub.notes}
                        </p>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                          <span style={{ fontFamily:F,fontSize:10,color:'#4B4280',fontWeight:600,display:'flex',alignItems:'center',gap:4 }}>
                            <Ic d={IC.clock} size={11}/>{sub.submittedAt}
                          </span>
                          {sub.status === 'pending' && (
                            <div style={{ display:'flex',gap:6 }} onClick={e=>e.stopPropagation()}>
                              <button className="tm-btn-approve" style={{ padding:'5px 10px',fontSize:10 }} onClick={()=>approve(sub.id)}>
                                <Ic d={IC.check} size={11}/>Approve
                              </button>
                              <button className="tm-btn-reject" style={{ padding:'5px 10px',fontSize:10 }} onClick={()=>reject(sub.id)}>
                                <Ic d={IC.x} size={11}/>Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div style={{ textAlign:'center',padding:'80px 0' }}>
                  <Ic d={IC.photo} size={48} style={{ color:'#2D2660',margin:'0 auto 16px',display:'block' }}/>
                  <p style={{ fontFamily:F,fontWeight:800,fontSize:16,color:'#4B4280' }}>No submissions found</p>
                </div>
              )}
            </div>
          )}

          {/* ── TASKS TAB ── */}
          {tab === 'tasks' && (
            <div className="tm-f3">
              <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                {MOCK_TASKS.map((task,i)=>{
                  const pct = Math.round((task.completed/task.assigned)*100);
                  return (
                    <div key={task.id} className="tm-card"
                      style={{ padding:'22px 26px',display:'flex',alignItems:'center',gap:24,
                        animation:`tm-fadeUp .5s cubic-bezier(.16,1,.3,1) ${i*.07}s both` }}>
                      <div style={{ width:46,height:46,borderRadius:14,flexShrink:0,
                        background:'rgba(79,70,229,.14)',border:'1px solid rgba(79,70,229,.25)',
                        display:'flex',alignItems:'center',justifyContent:'center',color:'#818CF8' }}>
                        <Ic d={IC.tasks} size={22}/>
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6 }}>
                          <p style={{ fontFamily:F,fontWeight:800,fontSize:15,color:'#E8E0FF' }}>{task.title}</p>
                          <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                            <span style={{ fontFamily:F,fontSize:10,fontWeight:800,
                              background:'rgba(129,140,248,.15)',color:'#818CF8',
                              border:'1px solid rgba(129,140,248,.25)',
                              padding:'3px 10px',borderRadius:99,letterSpacing:'.08em' }}>{task.category}</span>
                            <span style={{ fontFamily:F,fontSize:11,fontWeight:800,color:'#FCD34D',
                              display:'flex',alignItems:'center',gap:4 }}>
                              <Ic d={IC.star} size={12} style={{ color:'#FCD34D' }}/>{task.xp} XP
                            </span>
                          </div>
                        </div>
                        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                          <div style={{ flex:1,height:5,background:'rgba(196,181,253,.08)',borderRadius:99,overflow:'hidden' }}>
                            <div style={{ height:5,borderRadius:99,width:`${pct}%`,
                              background:'linear-gradient(90deg,#4F46E5,#7C3AED)',
                              transition:'width 1s cubic-bezier(.34,1.56,.64,1)' }}/>
                          </div>
                          <span style={{ fontFamily:F,fontSize:11,fontWeight:700,color:'#C4B5FD',flexShrink:0 }}>
                            {task.completed}/{task.assigned} done
                          </span>
                          <span style={{ fontFamily:F,fontSize:10,color:'#4B4280',flexShrink:0,
                            display:'flex',alignItems:'center',gap:4 }}>
                            <Ic d={IC.clock} size={11}/>Due {task.deadline}
                          </span>
                        </div>
                      </div>
                      <div style={{ display:'flex',gap:8,flexShrink:0 }}>
                        <button className="tm-btn-ghost" style={{ padding:'7px 12px' }}>
                          <Ic d={IC.edit} size={14}/>
                        </button>
                        <button className="tm-btn-reject" style={{ padding:'7px 12px' }}>
                          <Ic d={IC.trash} size={14}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {/* ── PHOTO DETAIL MODAL ── */}
        {viewSub && (
          <div className="tm-overlay" onClick={()=>setViewSub(null)}>
            <div className="tm-modal" style={{ width:'90%',maxWidth:820 }}
              onClick={e=>e.stopPropagation()}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24 }}>
                <div>
                  <p style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#7C3AED',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:6 }}>
                    Submission Review
                  </p>
                  <h2 style={{ fontFamily:F,fontSize:20,fontWeight:900,color:'#E8E0FF' }}>{viewSub.taskTitle}</h2>
                  <p style={{ fontFamily:F,fontSize:13,color:'#7C6FD0',marginTop:4 }}>{viewSub.ambassadorName} · {viewSub.college}</p>
                </div>
                <button onClick={()=>setViewSub(null)} style={{ background:'rgba(196,181,253,.08)',border:'1px solid rgba(196,181,253,.15)',
                  borderRadius:10,padding:'8px',cursor:'pointer',color:'#7C6FD0',display:'flex',transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.color='#F87171';e.currentTarget.style.background='rgba(239,68,68,.1)';}}
                  onMouseLeave={e=>{e.currentTarget.style.color='#7C6FD0';e.currentTarget.style.background='rgba(196,181,253,.08)';}}>
                  <Ic d={IC.x} size={18}/>
                </button>
              </div>

              <div style={{ display:'grid',gridTemplateColumns:'1fr 340px',gap:24 }}>
                {/* Photo */}
                <div style={{ borderRadius:18,overflow:'hidden',background:'#0D0B1F',
                  border:'1px solid rgba(196,181,253,.1)',position:'relative' }}>
                  <img src={viewSub.photoUrl} alt="submission proof"
                    style={{ width:'100%',height:380,objectFit:'cover' }}/>
                  <div style={{ position:'absolute',top:12,left:12,
                    padding:'5px 12px',borderRadius:99,
                    background:'rgba(0,0,0,.65)',backdropFilter:'blur(8px)',
                    fontFamily:F,fontSize:10,fontWeight:800,color:'#C4B5FD',
                    border:'1px solid rgba(196,181,253,.2)' }}>
                    Proof Photo
                  </div>
                </div>

                {/* Details */}
                <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                  {/* Meta */}
                  <div style={{ background:'rgba(255,255,255,.03)',border:'1px solid rgba(196,181,253,.1)',
                    borderRadius:16,padding:'18px' }}>
                    {[
                      { label:'Ambassador',  value:viewSub.ambassadorName },
                      { label:'College',     value:viewSub.college        },
                      { label:'Task',        value:viewSub.taskTitle      },
                      { label:'XP Reward',   value:`+${viewSub.xp} XP`   },
                      { label:'Submitted',   value:viewSub.submittedAt    },
                    ].map(({ label,value })=>(
                      <div key={label} style={{ display:'flex',justifyContent:'space-between',
                        padding:'8px 0',borderBottom:'1px solid rgba(196,181,253,.06)' }}>
                        <span style={{ fontFamily:F,fontSize:11,color:'#4B4280',fontWeight:600 }}>{label}</span>
                        <span style={{ fontFamily:F,fontSize:11,color:'#C4B5FD',fontWeight:700 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  <div style={{ background:'rgba(255,255,255,.03)',border:'1px solid rgba(196,181,253,.1)',
                    borderRadius:16,padding:'18px',flex:1 }}>
                    <p style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#7C3AED',
                      letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10 }}>Ambassador Notes</p>
                    <p style={{ fontFamily:F,fontSize:13,color:'#C4B5FD',lineHeight:1.65,fontWeight:400 }}>
                      {viewSub.notes}
                    </p>
                  </div>

                  {/* Current status */}
                  {viewSub.status !== 'pending' && (
                    <div style={{ padding:'12px 16px',borderRadius:14,
                      background: viewSub.status==='approved'?'rgba(16,185,129,.1)':'rgba(239,68,68,.1)',
                      border: `1px solid ${viewSub.status==='approved'?'rgba(16,185,129,.25)':'rgba(239,68,68,.2)'}` }}>
                      <p style={{ fontFamily:F,fontSize:12,fontWeight:800,
                        color:viewSub.status==='approved'?'#10B981':'#F87171',textTransform:'uppercase',letterSpacing:'.1em' }}>
                        {viewSub.status==='approved'?'Approved':'Rejected'}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {viewSub.status === 'pending' && (
                    <div style={{ display:'flex',gap:10 }}>
                      <button className="tm-btn-approve" style={{ flex:1,justifyContent:'center',padding:'12px' }}
                        onClick={()=>approve(viewSub.id)}>
                        <Ic d={IC.check} size={16}/>Approve +{viewSub.xp} XP
                      </button>
                      <button className="tm-btn-reject" style={{ flex:1,justifyContent:'center',padding:'12px' }}
                        onClick={()=>reject(viewSub.id)}>
                        <Ic d={IC.x} size={16}/>Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CREATE TASK MODAL ── */}
        {showCreate && (
          <div className="tm-overlay" onClick={()=>setShowCreate(false)}>
            <div className="tm-modal" style={{ width:'90%',maxWidth:520 }}
              onClick={e=>e.stopPropagation()}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
                <div>
                  <p style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#7C3AED',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:6 }}>New Task</p>
                  <h2 style={{ fontFamily:F,fontSize:20,fontWeight:900,color:'#E8E0FF' }}>Create Task</h2>
                </div>
                <button onClick={()=>setShowCreate(false)} style={{ background:'rgba(196,181,253,.08)',border:'1px solid rgba(196,181,253,.15)',
                  borderRadius:10,padding:'8px',cursor:'pointer',color:'#7C6FD0',display:'flex',transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.color='#F87171';}}
                  onMouseLeave={e=>{e.currentTarget.style.color='#7C6FD0';}}>
                  <Ic d={IC.x} size={18}/>
                </button>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                {[
                  { key:'title',       label:'Task Title',   placeholder:'e.g. Instagram Story Post', type:'text'   },
                  { key:'xp',          label:'XP Reward',    placeholder:'e.g. 150',                  type:'number' },
                  { key:'deadline',    label:'Deadline',     placeholder:'e.g. May 15',               type:'text'   },
                  { key:'description', label:'Description',  placeholder:'What should ambassadors do?',type:'textarea'},
                ].map(({ key,label,placeholder,type })=>(
                  <div key={key}>
                    <label style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#7C6FD0',
                      letterSpacing:'.1em',textTransform:'uppercase',display:'block',marginBottom:8 }}>{label}</label>
                    {type==='textarea'
                      ? <textarea className="tm-input" placeholder={placeholder} rows={3}
                          value={newTask[key]} onChange={e=>setNewTask({...newTask,[key]:e.target.value})}
                          style={{ resize:'vertical' }}/>
                      : <input className="tm-input" type={type} placeholder={placeholder}
                          value={newTask[key]} onChange={e=>setNewTask({...newTask,[key]:e.target.value})}/>
                    }
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#7C6FD0',
                    letterSpacing:'.1em',textTransform:'uppercase',display:'block',marginBottom:8 }}>Category</label>
                  <select className="tm-input" value={newTask.category}
                    onChange={e=>setNewTask({...newTask,category:e.target.value})}>
                    {['Social','Event','Referral','Content','Research'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex',gap:10,marginTop:8 }}>
                  <button className="tm-btn-ghost" style={{ flex:1,justifyContent:'center' }} onClick={()=>setShowCreate(false)}>Cancel</button>
                  <button className="tm-btn-primary" style={{ flex:1,justifyContent:'center' }} onClick={()=>setShowCreate(false)}>
                    <Ic d={IC.plus} size={16}/>Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}