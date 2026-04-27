import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .adl-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes adl-drift {
    0%,100% { transform:translateY(0) translateX(0); opacity:.4; }
    33%      { transform:translateY(-16px) translateX(6px); opacity:.8; }
    66%      { transform:translateY(-6px) translateX(-5px); opacity:.45; }
  }
  @keyframes adl-fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes adl-blink { 0%,100%{opacity:1;} 50%{opacity:.25;} }
  @keyframes adl-float {
    0%,100%{transform:translateY(0) rotate(0deg);}
    50%{transform:translateY(-10px) rotate(3deg);}
  }
  @keyframes adl-spin-slow { to { transform:rotate(360deg); } }

  .adl-card { animation: adl-fadeUp .7s cubic-bezier(.16,1,.3,1) .1s both; }

  .adl-input {
    width:100%; padding:13px 16px;
    background:rgba(255,255,255,0.04);
    border:1.5px solid rgba(196,181,253,0.15);
    border-radius:14px; color:#E8E0FF;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; font-weight:500; outline:none;
    transition:border-color .25s, box-shadow .25s, background .25s;
  }
  .adl-input::placeholder { color:#4B4280; }
  .adl-input:focus {
    border-color:rgba(124,58,237,0.7);
    background:rgba(124,58,237,0.07);
    box-shadow:0 0 0 3px rgba(124,58,237,0.15);
  }

  .adl-btn {
    width:100%; padding:14px;
    background:linear-gradient(135deg,#4F46E5,#7C3AED);
    border:none; border-radius:14px; cursor:pointer;
    color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; font-weight:800; letter-spacing:.04em;
    box-shadow:0 8px 32px rgba(79,70,229,.45), inset 0 1px 0 rgba(255,255,255,.14);
    transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s;
    text-transform:uppercase;
  }
  .adl-btn:hover  { transform:translateY(-2px) scale(1.02); box-shadow:0 14px 44px rgba(79,70,229,.6); }
  .adl-btn:active { transform:translateY(0) scale(.99); }

  .adl-back {
    background:none; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
    font-weight:600; color:#4B4280; display:flex; align-items:center; gap:6px;
    transition:color .2s, transform .2s; padding:0;
  }
  .adl-back:hover { color:#C4B5FD; transform:translateX(-3px); }
`;

const Stars = () => {
  const s = Array.from({ length: 70 }, (_, i) => ({
    id:i, x:(i*41.3)%100, y:(i*57.7)%100,
    r:(i%3)*.5+.25, delay:i%5, dur:(i%4)+4,
  }));
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }}>
      {s.map(p => (
        <circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill="white"
          style={{ animation:`adl-drift ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </svg>
  );
};

// Mini orbital decoration for admin page
const MiniOrbital = () => (
  <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
    <div style={{ position:'absolute', inset:0, borderRadius:'50%',
      border:'1px solid rgba(196,181,253,.18)',
      animation:'adl-spin-slow 12s linear infinite' }}>
      <div style={{ position:'absolute', top:-3, left:'50%', transform:'translateX(-50%)',
        width:6, height:6, borderRadius:'50%', background:'#818CF8',
        boxShadow:'0 0 10px #818CF8' }} />
    </div>
    <div style={{ position:'absolute', inset:18, borderRadius:'50%',
      border:'1px solid rgba(124,58,237,.25)',
      animation:'adl-spin-slow 7s linear reverse infinite' }}>
      <div style={{ position:'absolute', bottom:-3, left:'50%', transform:'translateX(-50%)',
        width:5, height:5, borderRadius:'50%', background:'#7C3AED',
        boxShadow:'0 0 8px #7C3AED' }} />
    </div>
    <div style={{ position:'absolute', inset:30, borderRadius:'50%',
      background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
      boxShadow:'0 0 24px rgba(79,70,229,.7)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:16, animation:'adl-float 4s ease-in-out infinite' }}>🏢</div>
  </div>
);

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ orgName:'', email:'', password:'' });
  const F = "'Plus Jakarta Sans',sans-serif";

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ role:'admin', name:form.orgName, email:form.email });
    navigate('/admin/dashboard');
  };

  const fields = [
    { key:'orgName',  label:'Organization Name', placeholder:'e.g. UnsaidTalks',       type:'text'     },
    { key:'email',    label:'Work Email',         placeholder:'admin@organization.com',  type:'email'    },
    { key:'password', label:'Password',           placeholder:'Your password',           type:'password' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="adl-wrap" style={{
        minHeight:'100vh', background:'#0D0B1A',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'32px 20px', fontFamily:F, position:'relative', overflow:'hidden',
      }}>
        <Stars />

        {/* Blobs */}
        <div style={{ position:'absolute',top:-200,right:-150,width:600,height:600,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(79,70,229,.13) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-160,left:-120,width:500,height:500,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 70%)',pointerEvents:'none' }} />

        {/* Grid */}
        <div style={{ position:'absolute',inset:0,pointerEvents:'none',
          backgroundImage:`linear-gradient(rgba(196,181,253,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(196,181,253,.05) 1px,transparent 1px)`,
          backgroundSize:'52px 52px' }} />

        {/* Card */}
        <div className="adl-card" style={{
          width:'100%', maxWidth:460, position:'relative', zIndex:1,
          background:'rgba(255,255,255,0.03)',
          border:'1.5px solid rgba(196,181,253,0.12)',
          borderRadius:28, padding:'40px 36px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 32px 80px rgba(0,0,0,.55), 0 0 60px rgba(79,70,229,.1)',
        }}>
          {/* Back */}
          <button className="adl-back" onClick={() => navigate('/')} style={{ marginBottom:28 }}>
            <svg viewBox="0 0 20 20" fill="currentColor" style={{width:15,height:15}}>
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Home
          </button>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            <MiniOrbital />
            <div>
              <h2 style={{ fontFamily:F, fontWeight:900, fontSize:22,
                color:'#E8E0FF', lineHeight:1.2, letterSpacing:'-.02em' }}>
                Organization Login
              </h2>
              <p style={{ fontFamily:F, fontSize:12, fontWeight:500, color:'#4B4280', marginTop:4 }}>
                Manage your ambassador program
              </p>
            </div>
          </div>

          {/* Admin badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:7,
            background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.3)',
            borderRadius:99, padding:'5px 14px', marginBottom:28 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#A78BFA',
              animation:'adl-blink 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#A78BFA',
              letterSpacing:'.12em',textTransform:'uppercase' }}>
              Admin Portal
            </span>
          </div>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={{ fontFamily:F, fontSize:11, fontWeight:800,
                  color:'#7C6FD0', letterSpacing:'.08em', textTransform:'uppercase',
                  display:'block', marginBottom:8 }}>{label}</label>
                <input className="adl-input" type={type} placeholder={placeholder}
                  value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button className="adl-btn" onClick={handleSubmit} style={{ marginTop:28 }}>
            Enter Dashboard
          </button>

          {/* Stats strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:1, marginTop:28, paddingTop:22,
            borderTop:'1px solid rgba(196,181,253,.08)' }}>
            {[['4,500+','Ambassadors'],['120+','Colleges'],['98%','Retention']].map(([num,lbl],i) => (
              <div key={lbl} style={{ textAlign:'center', padding:'0 8px',
                borderRight: i < 2 ? '1px solid rgba(196,181,253,.08)' : 'none' }}>
                <p style={{ fontFamily:F, fontWeight:900, fontSize:16,
                  background:'linear-gradient(135deg,#C4B5FD,#818CF8)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                  backgroundClip:'text', lineHeight:1 }}>{num}</p>
                <p style={{ fontFamily:F, fontSize:10, fontWeight:600,
                  color:'#4B4280', marginTop:4 }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Bottom glow line */}
          <div style={{ position:'absolute', bottom:-1, left:'20%', right:'20%', height:1,
            background:'linear-gradient(90deg,transparent,rgba(124,58,237,.6),transparent)',
            borderRadius:99 }} />
        </div>
      </div>
    </>
  );
}