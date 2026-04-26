import { useState, useEffect, Component } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import AmbassadorNav from '../../components/AmbassadorNav';
import { REWARDS as REWARDS_RAW, LEVELS as LEVELS_RAW } from '../../data/mockData';

// ── Safe data with fallbacks ──────────────────────────────────────────────
const FALLBACK_LEVELS = [
  { name: 'Bronze',   min: 0,     max: 999,    color: '#cd7f32' },
  { name: 'Silver',   min: 1000,  max: 2499,   color: '#9ca3af' },
  { name: 'Gold',     min: 2500,  max: 4999,   color: '#f59e0b' },
  { name: 'Platinum', min: 5000,  max: 9999,   color: '#60a5fa' },
  { name: 'Legend',   min: 10000, max: 999999, color: '#a78bfa' },
];
const LEVELS = (Array.isArray(LEVELS_RAW) && LEVELS_RAW.length > 0) ? LEVELS_RAW : FALLBACK_LEVELS;

const FALLBACK_REWARDS = [
  { id:'r1', name:'Completion Certificate',  category:'certificate', pointsCost:500,  description:'Official digital certificate of excellence',      stock:999 },
  { id:'r2', name:'Mentorship Session',       category:'mentorship',  pointsCost:1000, description:'30-min 1:1 session with an industry mentor',      stock:5   },
  { id:'r3', name:'Ambassador Hoodie',        category:'merch',       pointsCost:2000, description:'Limited edition ambassador hoodie',               stock:4   },
  { id:'r4', name:'LinkedIn Recommendation',  category:'career',      pointsCost:1500, description:'Personal recommendation from our CEO',            stock:10  },
  { id:'r5', name:'Amazon Gift Voucher',      category:'voucher',     pointsCost:2500, description:'Redeemable Amazon gift voucher worth Rs.500',     stock:8   },
  { id:'r6', name:'Excellence Trophy',        category:'trophy',      pointsCost:5000, description:'Exclusive physical trophy for top performers',    stock:2   },
  { id:'r7', name:'AstralIQ T-Shirt',         category:'merch',       pointsCost:800,  description:'Branded AstralIQ tee, premium quality',           stock:15  },
  { id:'r8', name:'Swiggy Voucher',           category:'voucher',     pointsCost:400,  description:'Food delivery treat on us',                       stock:20  },
  { id:'r9', name:'Premium Course Access',    category:'digital',     pointsCost:600,  description:'1-month Coursera premium access',                 stock:25  },
];
const REWARDS = (Array.isArray(REWARDS_RAW) && REWARDS_RAW.length > 0) ? REWARDS_RAW : FALLBACK_REWARDS;

// ── Helpers ───────────────────────────────────────────────────────────────
const safeStr = (v) => (v != null ? String(v) : '');
const safeNum = (v) => (typeof v === 'number' && !isNaN(v) ? v : 0);

const genCode = (name) => {
  const prefix = safeStr(name).replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'RWD';
  return `${prefix}-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
};

const getLevel = (points) => {
  const p = safeNum(points);
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (p >= safeNum(LEVELS[i]?.min)) return LEVELS[i];
  }
  return LEVELS[0] || FALLBACK_LEVELS[0];
};

const getPopupType = (category) => {
  const cat = safeStr(category).toLowerCase();
  if (['voucher','digital','cash','certificate'].includes(cat)) return 'coupon';
  if (['merch','merchandise','trophy'].includes(cat))           return 'contact';
  if (['mentorship','experience','career'].includes(cat))       return 'booking';
  return 'coupon';
};

// ── Category config ───────────────────────────────────────────────────────
const CAT = {
  certificate:  { color:'#f59e0b', label:'Certificate' },
  mentorship:   { color:'#a78bfa', label:'Mentorship'  },
  merch:        { color:'#60a5fa', label:'Merch'       },
  merchandise:  { color:'#60a5fa', label:'Merch'       },
  career:       { color:'#34d399', label:'Career'      },
  voucher:      { color:'#fb923c', label:'Voucher'     },
  trophy:       { color:'#facc15', label:'Trophy'      },
  experience:   { color:'#a78bfa', label:'Experience'  },
  digital:      { color:'#34d399', label:'Digital'     },
  cash:         { color:'#fb923c', label:'Cash'        },
};
const getVis = (category, idx = 0) => {
  const key = safeStr(category).toLowerCase();
  if (CAT[key]) return CAT[key];
  const all = Object.values(CAT);
  return all[idx % all.length];
};

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  .rw-page { font-family:'Plus Jakarta Sans',sans-serif; }

  @keyframes rw-float {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-5px); }
  }
  @keyframes rw-shimmer {
    0%   { background-position:-300% center; }
    100% { background-position:300% center; }
  }
  @keyframes rw-twinkle {
    0%,100% { opacity:0.7; }
    50%      { opacity:0.1; }
  }

  .rw-card { transition:transform 0.22s ease,box-shadow 0.22s ease; }
  .rw-card:not(.locked):hover { transform:translateY(-4px); box-shadow:0 12px 28px rgba(124,58,237,0.15) !important; }
  .rw-card.locked { opacity:0.52; }

  .rw-btn {
    border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-weight:800;
    transition:filter 0.15s ease,transform 0.15s ease;
  }
  .rw-btn:hover:not(:disabled) { filter:brightness(1.1); transform:scale(1.02); }
  .rw-btn:disabled { cursor:not-allowed; }

  .rw-pill {
    border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
    transition:all 0.15s ease;
  }

  .rw-code {
    font-family:'Courier New',monospace; letter-spacing:3px;
    background:linear-gradient(90deg,#a78bfa,#60a5fa,#34d399,#a78bfa);
    background-size:250% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:rw-shimmer 2.5s linear infinite;
  }
`;

// ── Error Boundary ────────────────────────────────────────────────────────
class ModalErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error:null }; }
  static getDerivedStateFromError(err) { return { error:err }; }
  render() {
    if (this.state.error) {
      return (
        <div onClick={this.props.onClose} style={{
          position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.7)',
          display:'flex',alignItems:'center',justifyContent:'center',padding:16,
        }}>
          <div style={{background:'#fff',borderRadius:20,padding:'32px 28px',maxWidth:420,width:'100%'}}>
            <div style={{fontWeight:800,fontSize:16,color:'#1e1b4b',marginBottom:8}}>Modal Error</div>
            <div style={{fontSize:12,color:'#6b7280',marginBottom:4,fontFamily:'monospace'}}>
              {this.state.error?.message || 'Unknown error'}
            </div>
            <div style={{fontSize:11,color:'#9ca3af',marginBottom:16}}>
              Check browser console for full details.
            </div>
            <button className="rw-btn" onClick={this.props.onClose}
              style={{background:'#7c3aed',color:'#fff',padding:'10px 24px',borderRadius:12,fontSize:13}}>
              Close
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Reward Icon ───────────────────────────────────────────────────────────
function RewardIcon({ category, color, size=48, unlocked }) {
  const s = size || 48;
  const c = unlocked ? (color || '#7c3aed') : '#4b5563';
  const cat = safeStr(category).toLowerCase();

  const shapes = {
    certificate: <><rect x={s*.2} y={s*.15} width={s*.6} height={s*.7} rx={3} fill={c} opacity=".18" stroke={c} strokeWidth="1.5"/><line x1={s*.32} y1={s*.38} x2={s*.68} y2={s*.38} stroke={c} strokeWidth="1.5"/><line x1={s*.32} y1={s*.5} x2={s*.68} y2={s*.5} stroke={c} strokeWidth="1.2"/><circle cx={s*.5} cy={s*.72} r={s*.08} fill={c}/></>,
    voucher:     <><rect x={s*.15} y={s*.3} width={s*.7} height={s*.42} rx={4} fill={c} opacity=".2" stroke={c} strokeWidth="1.4"/><line x1={s*.15} y1={s*.51} x2={s*.85} y2={s*.51} stroke={c} strokeWidth="1" strokeDasharray="3,3"/><circle cx={s*.5} cy={s*.38} r={s*.06} fill={c}/></>,
    digital:     <><polygon points={`${s*.5},${s*.18} ${s*.78},${s*.62} ${s*.22},${s*.62}`} fill={c} opacity=".85"/><rect x={s*.44} y={s*.63} width={s*.12} height={s*.18} rx={2} fill={c} opacity=".7"/></>,
    trophy:      <><path d={`M${s*.3} ${s*.2} L${s*.7} ${s*.2} L${s*.7} ${s*.5} Q${s*.7} ${s*.72} ${s*.5} ${s*.72} Q${s*.3} ${s*.72} ${s*.3} ${s*.5}Z`} fill={c} opacity=".85"/><line x1={s*.5} y1={s*.72} x2={s*.5} y2={s*.8} stroke={c} strokeWidth="2"/><line x1={s*.33} y1={s*.8} x2={s*.67} y2={s*.8} stroke={c} strokeWidth="2"/></>,
    merch:       <><path d={`M${s*.25} ${s*.3} L${s*.18} ${s*.48} L${s*.3} ${s*.48} L${s*.3} ${s*.78} L${s*.7} ${s*.78} L${s*.7} ${s*.48} L${s*.82} ${s*.48} L${s*.75} ${s*.3} Q${s*.62} ${s*.18} ${s*.5} ${s*.22} Q${s*.38} ${s*.18} ${s*.25} ${s*.3}Z`} fill={c} opacity=".85"/></>,
    career:      <><rect x={s*.2} y={s*.42} width={s*.6} height={s*.38} rx={3} fill={c} opacity=".2" stroke={c} strokeWidth="1.4"/><path d={`M${s*.36} ${s*.42} L${s*.36} ${s*.32} Q${s*.36} ${s*.22} ${s*.5} ${s*.22} Q${s*.64} ${s*.22} ${s*.64} ${s*.32} L${s*.64} ${s*.42}`} stroke={c} strokeWidth="1.4" fill="none"/></>,
  };
  const icon = shapes[cat] || shapes['voucher'];
  return (
    <div style={{
      width:s, height:s, borderRadius:s*0.28, flexShrink:0,
      background: unlocked ? `radial-gradient(circle at 35% 35%,${c}33,${c}11)` : 'rgba(0,0,0,0.05)',
      border:`1.5px solid ${unlocked ? c+'44' : '#e5e7eb'}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      animation: unlocked ? 'rw-float 3s ease-in-out infinite' : 'none',
    }}>
      <svg width={s*0.6} height={s*0.6} viewBox={`0 0 ${s} ${s}`} fill="none">{icon}</svg>
    </div>
  );
}

// ── Info Row ──────────────────────────────────────────────────────────────
function InfoRow({ label, value, highlight, color }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:10,borderBottom:'1px solid #ede9fe'}}>
      <span style={{fontSize:11,color:'#9ca3af',fontWeight:600}}>{label}</span>
      <span style={{
        fontSize:12,fontWeight:700,color:'#1e1b4b',
        background: highlight ? (color||'#7c3aed')+'18' : 'transparent',
        padding: highlight ? '2px 8px' : 0,
        borderRadius: highlight ? 6 : 0,
      }}>{value}</span>
    </div>
  );
}

// ── Redeem Modal ──────────────────────────────────────────────────────────
function RedeemModal({ reward, onClose }) {
  const name     = safeStr(reward?.name || reward?.title || 'Reward');
  const desc     = safeStr(reward?.description || '');
  const category = safeStr(reward?.category || reward?.type || '');
  const vis      = getVis(category);
  const type     = getPopupType(category);

  const [code]   = useState(() => genCode(name));
  const [refNo]  = useState(() => `ASTRAL-${Math.floor(Math.random()*90000+10000)}`);
  const [bookId] = useState(() => `SES-${Math.floor(Math.random()*90000+10000)}`);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(code)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
        .catch(() => {});
    } catch { /* ignore */ }
  };

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.68)',
      backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:430, maxWidth:'100%', maxHeight:'90vh',
        background:'#ffffff',
        border:`2px solid ${vis.color}55`,
        borderRadius:24,
        padding:'32px 28px',
        boxShadow:'0 24px 60px rgba(0,0,0,0.25)',
        overflowY:'auto',
        position:'relative',
      }}>
        {/* Close */}
        <button className="rw-btn" onClick={onClose} style={{
          position:'absolute',top:14,right:14,
          width:30,height:30,borderRadius:'50%',
          background:'#ede9fe',color:'#7c3aed',
          fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',
        }}>&#215;</button>

        <RewardIcon category={category} color={vis.color} size={56} unlocked />

        <div style={{marginTop:16,marginBottom:4,fontSize:11,fontWeight:700,color:vis.color,letterSpacing:1,textTransform:'uppercase'}}>
          {type==='coupon' ? 'Your Reward Code' : type==='contact' ? 'Claim via Admin' : 'Session Booking'}
        </div>
        <div style={{fontSize:20,fontWeight:900,color:'#1e1b4b',marginBottom:6}}>{name}</div>
        {desc ? <div style={{fontSize:12,color:'#9ca3af',marginBottom:22,lineHeight:1.6}}>{desc}</div> : null}

        {/* COUPON */}
        {type === 'coupon' && (
          <>
            <div style={{background:'#f5f3ff',border:`1px solid ${vis.color}33`,borderRadius:14,padding:'18px 20px',marginBottom:14,textAlign:'center'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#9ca3af',marginBottom:8,letterSpacing:1}}>COUPON CODE</div>
              <div className="rw-code" style={{fontSize:22,fontWeight:900}}>{code}</div>
            </div>
            <button className="rw-btn" onClick={copyCode} style={{
              width:'100%',padding:'11px 0',borderRadius:12,fontSize:13,
              background: copied ? 'linear-gradient(135deg,#059669,#34d399)' : `linear-gradient(135deg,#7c3aed,${vis.color})`,
              color:'#fff', boxShadow:`0 4px 14px ${vis.color}44`,
            }}>
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <div style={{marginTop:10,fontSize:11,color:'#9ca3af',textAlign:'center'}}>Valid for 30 days from redemption.</div>
          </>
        )}

        {/* CONTACT */}
        {type === 'contact' && (
          <>
            <div style={{background:'#f5f3ff',border:`1px solid ${vis.color}33`,borderRadius:14,padding:'18px 20px',marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:'#9ca3af',marginBottom:14,letterSpacing:1}}>CONTACT ADMIN TO CLAIM</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <InfoRow label="Admin"   value="AstralIQ Team"       />
                <InfoRow label="Email"   value="rewards@astraliq.in" />
                <InfoRow label="Phone"   value="+91 98765 43210"      />
                <InfoRow label="Ref No." value={refNo} highlight color={vis.color}/>
              </div>
            </div>
            <div style={{fontSize:11,color:'#9ca3af',lineHeight:1.7}}>Contact admin with your reference number. Ships within 7 working days.</div>
          </>
        )}

        {/* BOOKING */}
        {type === 'booking' && (
          <>
            <div style={{background:'#f5f3ff',border:`1px solid ${vis.color}33`,borderRadius:14,padding:'18px 20px',marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:'#9ca3af',marginBottom:14,letterSpacing:1}}>SESSION DETAILS</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <InfoRow label="Booking ID" value={bookId} highlight color={vis.color}/>
                <InfoRow label="Contact"    value="sessions@astraliq.in"    />
                <InfoRow label="Schedule"   value="coordinator@astraliq.in" />
                <InfoRow label="Response"   value="Within 48 hours"         />
              </div>
            </div>
            <button className="rw-btn"
              onClick={() => { try { window.open(`mailto:sessions@astraliq.in?subject=Booking ${bookId}`,'_blank'); } catch{} }}
              style={{width:'100%',padding:'11px 0',borderRadius:12,fontSize:13,background:`linear-gradient(135deg,#7c3aed,${vis.color})`,color:'#fff',boxShadow:`0 4px 14px ${vis.color}44`}}>
              Send Email to Schedule
            </button>
            <div style={{marginTop:10,fontSize:11,color:'#9ca3af',textAlign:'center'}}>We respond within 48 hours to confirm your slot.</div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────
const STARS = Array.from({length:55},(_,i)=>({
  id:i, x:(Math.random()*100).toFixed(1), y:(Math.random()*100).toFixed(1),
  r:(Math.random()*1.2+0.4).toFixed(1), d:(Math.random()*4+2).toFixed(1), dl:(Math.random()*5).toFixed(1),
}));

// ── Main Component ────────────────────────────────────────────────────────
export default function Rewards() {
  const dataCtx     = useData();
  const ambassadors = dataCtx?.ambassadors;

  // Safe auth — some routes may not have AuthProvider
  let user = null;
  try { const a = useAuth(); user = a?.user ?? null; } catch { user = null; }

  const [isDark,   setIsDark]   = useState(() => { try { return localStorage.getItem('astraliq-theme')==='dark'; } catch { return false; } });
  const [filter,   setFilter]   = useState('all');
  const [redeemed, setRedeemed] = useState({});
  const [modal,    setModal]    = useState(null);

  useEffect(() => {
    const h = (e) => setIsDark(e.detail?.isDark ?? false);
    window.addEventListener('astraliq-theme-change', h);
    return () => window.removeEventListener('astraliq-theme-change', h);
  }, []);

  const me       = ambassadors?.find(a => a.id === user?.id) || ambassadors?.[0];
  const myPoints = safeNum(me?.points ?? 1200);
  const myLevel  = getLevel(myPoints);

  const categories = ['all', ...new Set(REWARDS.map(r => safeStr(r.category || r.type || 'other')))];
  const filtered   = filter === 'all' ? REWARDS : REWARDS.filter(r => safeStr(r.category || r.type) === filter);

  const handleRedeem = (reward) => {
    try {
      const cost = safeNum(reward.pointsCost ?? reward.cost ?? reward.points ?? 0);
      if (myPoints < cost) return;
      if (!redeemed[reward.id]) setRedeemed(prev => ({...prev, [reward.id]: true}));
      setModal(reward);
    } catch (err) {
      console.error('[Rewards] handleRedeem error:', err);
    }
  };

  const dk      = isDark;
  const txtPri  = dk ? '#e0e7ff' : '#1e1b4b';
  const txtSec  = dk ? '#8b5cf6' : '#7c3aed';
  const bg      = dk ? 'linear-gradient(160deg,#060110,#0a0520 55%,#0e0828)' : 'linear-gradient(160deg,#f5f3ff,#ede9fe 60%,#ddd6fe)';
  const cardBg  = dk ? 'rgba(13,8,38,0.88)' : 'rgba(255,255,255,0.92)';
  const cardBdr = dk ? '#1e1b4b' : '#ede9fe';

  return (
    <>
      <style>{CSS}</style>

      <div className="rw-page" style={{minHeight:'100vh',background:bg}}>
        <AmbassadorNav isDark={dk} activePage="rewards" />

        {dk && (
          <svg style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}>
            {STARS.map(s=>(
              <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
                style={{animation:`rw-twinkle ${s.d}s ${s.dl}s ease-in-out infinite`}}/>
            ))}
          </svg>
        )}

        <div style={{position:'relative',zIndex:1,marginLeft:220,padding:'80px 32px 60px',maxWidth:1100}}>

          {/* Header */}
          <div style={{marginBottom:28}}>
            <h1 style={{margin:0,fontSize:28,fontWeight:900,color:txtPri,letterSpacing:'-0.5px'}}>Mission Rewards</h1>
            <p style={{margin:'4px 0 0',fontSize:13,color:txtSec,fontWeight:600}}>Redeem your cosmic points for real-world rewards</p>
          </div>

          {/* Wallet row */}
          <div style={{display:'flex',gap:14,marginBottom:28,flexWrap:'wrap'}}>
            {/* Points */}
            <div style={{
              flex:'1 1 240px',
              background: dk ? 'linear-gradient(135deg,#2d1b69,#3b1f8c)' : 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
              border:`1.5px solid ${dk?'#7c3aed66':'#a78bfa88'}`,
              borderRadius:20, padding:'20px 24px',
              display:'flex', alignItems:'center', gap:18,
            }}>
              <div style={{width:52,height:52,borderRadius:14,flexShrink:0,background:'linear-gradient(135deg,#7c3aed,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 24px #7c3aed55',animation:'rw-float 3s ease-in-out infinite'}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" fill="white" opacity=".9"/>
                </svg>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:dk?'#c4b5fd':'#6d28d9',letterSpacing:1,textTransform:'uppercase'}}>Your Points</div>
                <div style={{fontSize:32,fontWeight:900,color:dk?'#e0e7ff':'#3b0764',lineHeight:1.1,letterSpacing:'-1px'}}>{myPoints.toLocaleString()}</div>
                <div style={{fontSize:11,color:dk?'#8b5cf6':'#7c3aed',fontWeight:600,marginTop:2}}>available to redeem</div>
              </div>
            </div>

            {/* Level */}
            <div style={{flex:'1 1 180px',background:cardBg,border:`1px solid ${cardBdr}`,borderRadius:20,padding:'20px 24px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:48,height:48,borderRadius:12,flexShrink:0,background:`${myLevel.color}22`,border:`1.5px solid ${myLevel.color}55`,display:'flex',alignItems:'center',justifyContent:'center',animation:'rw-float 3.5s ease-in-out 0.5s infinite'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" fill={myLevel.color} opacity=".9"/>
                </svg>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:txtSec,letterSpacing:1,textTransform:'uppercase'}}>Current Level</div>
                <div style={{fontSize:18,fontWeight:900,color:myLevel.color}}>{myLevel.name}</div>
                <div style={{fontSize:11,color:dk?'#6b7280':'#9ca3af',marginTop:2}}>
                  {myPoints >= safeNum(myLevel.max ?? 999999)
                    ? 'Max level reached'
                    : `${(safeNum(myLevel.max ?? 999999) - myPoints).toLocaleString()} pts to next`}
                </div>
              </div>
            </div>

            {/* Redeemed */}
            <div style={{flex:'0 1 150px',background:dk?'rgba(5,50,37,0.7)':'rgba(236,253,245,0.95)',border:'1px solid #34d39944',borderRadius:20,padding:'20px 24px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <div style={{fontSize:11,fontWeight:700,color:dk?'#6ee7b7':'#047857',letterSpacing:1,textTransform:'uppercase'}}>Redeemed</div>
              <div style={{fontSize:28,fontWeight:900,color:dk?'#34d399':'#065f46',lineHeight:1.1}}>{Object.keys(redeemed).length}</div>
              <div style={{fontSize:11,color:dk?'#34d39988':'#059669',marginTop:2}}>reward{Object.keys(redeemed).length!==1?'s':''} claimed</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
            {categories.map(cat => {
              const vis = CAT[cat];
              const isActive = filter === cat;
              return (
                <button key={cat} className="rw-pill" onClick={() => setFilter(cat)} style={{
                  padding:'7px 16px',borderRadius:30,fontSize:12,
                  background: isActive ? (vis?.color||'#7c3aed') : (dk?'rgba(255,255,255,0.06)':'rgba(124,58,237,0.08)'),
                  color: isActive ? '#fff' : (dk?'#c4b5fd':'#6d28d9'),
                  border: isActive ? 'none' : `1px solid ${dk?'#1e1b4b':'#ddd6fe'}`,
                }}>
                  {vis?.label || cat.charAt(0).toUpperCase()+cat.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(255px,1fr))',gap:18}}>
            {filtered.map((reward, idx) => {
              const name     = safeStr(reward.name || reward.title || 'Reward');
              const desc     = safeStr(reward.description || '');
              const category = safeStr(reward.category || reward.type || '');
              const cost     = safeNum(reward.pointsCost ?? reward.cost ?? reward.points ?? 0);
              const stock    = reward.stock;
              const id       = safeStr(reward.id || idx);

              const vis        = getVis(category, idx);
              const canAfford  = myPoints >= cost;
              const isRedeemed = !!redeemed[id];
              const isLocked   = !canAfford && !isRedeemed;

              return (
                <div key={id} className={`rw-card${isLocked?' locked':''}`} style={{
                  position:'relative',
                  background: isRedeemed ? (dk?'rgba(3,37,22,0.9)':'rgba(236,253,245,0.95)') : cardBg,
                  border: isRedeemed ? '1.5px solid #34d39966' : `1px solid ${cardBdr}`,
                  borderRadius:20, padding:'22px 20px 18px',
                  display:'flex', flexDirection:'column', gap:14,
                  boxShadow: !isLocked&&!isRedeemed ? `0 4px 20px ${vis.color}18` : 'none',
                }}>
                  {/* Tag */}
                  <div style={{position:'absolute',top:14,right:14}}>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:0.8,padding:'3px 8px',borderRadius:20,background:`${vis.color}18`,border:`1px solid ${vis.color}44`,color:vis.color,textTransform:'uppercase'}}>
                      {vis.label}
                    </span>
                  </div>

                  {/* Icon + cost */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <RewardIcon category={category} color={vis.color} size={52} unlocked={canAfford||isRedeemed}/>
                    <div style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:30,background:canAfford||isRedeemed?`${vis.color}1a`:(dk?'#ffffff0d':'#0000000a'),border:`1px solid ${canAfford||isRedeemed?vis.color+'44':(dk?'#ffffff18':'#00000015')}`}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" fill={canAfford||isRedeemed?vis.color:(dk?'#4b5563':'#9ca3af')}/>
                      </svg>
                      <span style={{fontSize:13,fontWeight:800,color:canAfford||isRedeemed?vis.color:(dk?'#4b5563':'#9ca3af')}}>{cost.toLocaleString()}</span>
                      <span style={{fontSize:10,color:dk?'#6b7280':'#9ca3af',fontWeight:600}}>pts</span>
                    </div>
                  </div>

                  {/* Name + desc */}
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:isLocked?(dk?'#4b5563':'#9ca3af'):txtPri,marginBottom:4}}>{name}</div>
                    <div style={{fontSize:12,color:dk?'#6b7280':'#9ca3af',lineHeight:1.5}}>{desc}</div>
                  </div>

                  {stock != null && stock < 10 && (
                    <div style={{fontSize:11,fontWeight:700,color:stock<=3?'#f87171':'#fb923c'}}>Only {stock} left</div>
                  )}

                  <button className="rw-btn" disabled={isLocked} onClick={() => handleRedeem(reward)} style={{
                    width:'100%',padding:'10px 0',borderRadius:12,fontSize:13,
                    background: isRedeemed ? 'linear-gradient(135deg,#059669,#34d399)' : isLocked ? (dk?'#1e1b4b':'#ede9fe') : `linear-gradient(135deg,#7c3aed,${vis.color})`,
                    color: isLocked&&!isRedeemed ? (dk?'#4b5563':'#9ca3af') : '#fff',
                    boxShadow: isRedeemed ? '0 4px 14px #34d39944' : (!isLocked?`0 4px 14px ${vis.color}44`:'none'),
                    marginTop:'auto',
                  }}>
                    {isRedeemed ? 'View Reward Details' : isLocked ? `Need ${(cost-myPoints).toLocaleString()} more pts` : 'Redeem Reward'}
                  </button>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{textAlign:'center',padding:'60px 0',color:dk?'#4b5563':'#9ca3af',fontSize:14}}>No rewards in this category yet</div>
          )}

          {/* Info bar */}
          <div style={{marginTop:40,padding:'16px 22px',background:cardBg,border:`1px solid ${cardBdr}`,borderRadius:16,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`${txtSec}22`,border:`1px solid ${txtSec}44`,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={txtSec} strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke={txtSec} strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill={txtSec}/>
              </svg>
            </div>
            <p style={{margin:0,fontSize:12,color:dk?'#8b5cf6':'#7c3aed',fontWeight:600,lineHeight:1.6}}>
              Complete tasks and climb the leaderboard to earn more points. Points are awarded instantly on task approval. Rewards are fulfilled within 7 working days.
            </p>
          </div>
        </div>
      </div>

      {modal && (
        <ModalErrorBoundary onClose={() => setModal(null)}>
          <RedeemModal reward={modal} onClose={() => setModal(null)} />
        </ModalErrorBoundary>
      )}
    </>
  );
}