import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .al-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes al-drift {
    0%,100% { transform:translateY(0) translateX(0); opacity:.4; }
    33%      { transform:translateY(-16px) translateX(6px); opacity:.8; }
    66%      { transform:translateY(-6px) translateX(-5px); opacity:.45; }
  }
  @keyframes al-fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes al-shimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes al-blink { 0%,100%{opacity:1;} 50%{opacity:.25;} }
  @keyframes al-pulse {
    0%,100%{transform:scale(1);opacity:.55;}
    50%{transform:scale(1.12);opacity:.18;}
  }
  @keyframes al-float {
    0%,100%{transform:translateY(0);}
    50%{transform:translateY(-10px);}
  }

  .al-card {
    animation: al-fadeUp .7s cubic-bezier(.16,1,.3,1) .1s both;
  }

  .al-input {
    width:100%; padding:13px 16px;
    background:rgba(255,255,255,0.04);
    border:1.5px solid rgba(196,181,253,0.15);
    border-radius:14px;
    color:#E8E0FF;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; font-weight:500;
    outline:none;
    transition:border-color .25s, box-shadow .25s, background .25s;
  }
  .al-input::placeholder { color:#4B4280; }
  .al-input:focus {
    border-color:rgba(124,58,237,0.7);
    background:rgba(124,58,237,0.07);
    box-shadow:0 0 0 3px rgba(124,58,237,0.15);
  }

  .al-btn {
    width:100%; padding:14px;
    background:linear-gradient(135deg,#4F46E5,#7C3AED);
    border:none; border-radius:14px; cursor:pointer;
    color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; font-weight:800; letter-spacing:.04em;
    box-shadow:0 8px 32px rgba(79,70,229,.45), inset 0 1px 0 rgba(255,255,255,.14);
    transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s;
    text-transform:uppercase;
  }
  .al-btn:hover  { transform:translateY(-2px) scale(1.02); box-shadow:0 14px 44px rgba(79,70,229,.6); }
  .al-btn:active { transform:translateY(0) scale(.99); }

  .al-back {
    background:none; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
    font-weight:600; color:#4B4280; display:flex; align-items:center; gap:6px;
    transition:color .2s, transform .2s; padding:0;
  }
  .al-back:hover { color:#C4B5FD; transform:translateX(-3px); }

  .al-toggle {
    color:#818CF8; font-weight:700; cursor:pointer;
    background:none; border:none; font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; padding:0; transition:color .2s;
    text-decoration:underline; text-underline-offset:3px; text-decoration-color:transparent;
  }
  .al-toggle:hover { color:#C4B5FD; text-decoration-color:#C4B5FD; }
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
          style={{ animation:`al-drift ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </svg>
  );
};

const FloatOrb = ({ top, left, size, color, delay }) => (
  <div style={{
    position:'absolute', top, left, width:size, height:size, borderRadius:'50%',
    background:`radial-gradient(circle,${color} 0%,transparent 70%)`,
    pointerEvents:'none', animation:`al-float 6s ease-in-out ${delay}s infinite`,
  }} />
);

export default function AmbassadorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]     = useState({ name:'', email:'', college:'', password:'' });
  const [isLogin, setIsLogin] = useState(false);
  const F = "'Plus Jakarta Sans',sans-serif";

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      role:'ambassador', name:form.name||'Ambassador',
      email:form.email, college:form.college||'My College',
      points:0, level:'Bronze', streak:0, badges:[], tasksCompleted:0, isNew:true,
    });
    navigate('/onboarding');
  };

  const fields = isLogin
    ? [
        { key:'email',    label:'Email',    placeholder:'Your college email',     type:'email'    },
        { key:'password', label:'Password', placeholder:'Your password',          type:'password' },
      ]
    : [
        { key:'name',     label:'Full Name',     placeholder:'Your full name',    type:'text'     },
        { key:'college',  label:'College Name',  placeholder:'Your college name', type:'text'     },
        { key:'email',    label:'Email',          placeholder:'Your college email',type:'email'    },
        { key:'password', label:'Password',       placeholder:'Create a strong password',type:'password'},
      ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="al-wrap" style={{
        minHeight:'100vh', background:'#0D0B1A',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'32px 20px', fontFamily:F, position:'relative', overflow:'hidden',
      }}>
        <Stars />

        {/* Ambient blobs */}
        <div style={{ position:'absolute',top:-180,left:-180,width:600,height:600,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(79,70,229,.14) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-160,right:-120,width:520,height:520,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(124,58,237,.11) 0%,transparent 70%)',pointerEvents:'none' }} />
        <FloatOrb top="15%" left="8%"  size="120px" color="rgba(79,70,229,.18)"  delay={0} />
        <FloatOrb top="65%" left="78%" size="90px"  color="rgba(124,58,237,.15)" delay={2} />

        {/* Grid */}
        <div style={{ position:'absolute',inset:0,pointerEvents:'none',
          backgroundImage:`linear-gradient(rgba(196,181,253,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(196,181,253,.05) 1px,transparent 1px)`,
          backgroundSize:'52px 52px' }} />

        {/* Card */}
        <div className="al-card" style={{
          width:'100%', maxWidth:460, position:'relative', zIndex:1,
          background:'rgba(255,255,255,0.03)',
          border:'1.5px solid rgba(196,181,253,0.12)',
          borderRadius:28, padding:'40px 36px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 32px 80px rgba(0,0,0,.55), 0 0 60px rgba(79,70,229,.1)',
        }}>
          {/* Back */}
          <button className="al-back" onClick={() => navigate('/')} style={{ marginBottom:28 }}>
            <svg viewBox="0 0 20 20" fill="currentColor" style={{width:15,height:15}}>
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Home
          </button>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            <div style={{
              width:54, height:54, borderRadius:18, flexShrink:0,
              background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 8px 24px rgba(79,70,229,.5)',
              fontSize:26, animation:'al-float 4s ease-in-out infinite',
            }}>🚀</div>
            <div>
              <h2 style={{ fontFamily:F, fontWeight:900, fontSize:22,
                color:'#E8E0FF', lineHeight:1.2, letterSpacing:'-.02em' }}>
                {isLogin ? 'Welcome Back' : 'Join as Ambassador'}
              </h2>
              <p style={{ fontFamily:F, fontSize:12, fontWeight:500, color:'#4B4280', marginTop:4 }}>
                {isLogin ? 'Sign in to continue your journey' : 'Start your journey today'}
              </p>
            </div>
          </div>

          {/* Pill badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:7,
            background:'rgba(79,70,229,.12)', border:'1px solid rgba(79,70,229,.3)',
            borderRadius:99, padding:'5px 14px', marginBottom:28 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#818CF8',
              animation:'al-blink 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:F,fontSize:10,fontWeight:800,color:'#818CF8',
              letterSpacing:'.12em',textTransform:'uppercase' }}>
              Ambassador Portal
            </span>
          </div>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={{ fontFamily:F, fontSize:11, fontWeight:800,
                  color:'#7C6FD0', letterSpacing:'.08em', textTransform:'uppercase',
                  display:'block', marginBottom:8 }}>{label}</label>
                <input className="al-input" type={type} placeholder={placeholder}
                  value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button className="al-btn" onClick={handleSubmit} style={{ marginTop:28 }}>
            {isLogin ? '🚀 Sign In' : '🚀 Create Account'}
          </button>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(196,181,253,.1)' }} />
            <span style={{ fontFamily:F, fontSize:11, fontWeight:600, color:'#4B4280' }}>or</span>
            <div style={{ flex:1, height:1, background:'rgba(196,181,253,.1)' }} />
          </div>

          {/* Toggle */}
          <p style={{ textAlign:'center', fontFamily:F, fontSize:13, fontWeight:500, color:'#4B4280' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="al-toggle" onClick={() => setIsLogin(l => !l)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

          {/* Glow ring bottom */}
          <div style={{ position:'absolute', bottom:-1, left:'20%', right:'20%', height:1,
            background:'linear-gradient(90deg,transparent,rgba(124,58,237,.6),transparent)',
            borderRadius:99 }} />
        </div>
      </div>
    </>
  );
}