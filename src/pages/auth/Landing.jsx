import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

// ── Inline keyframe styles ──────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes drift {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0.4; }
    33%  { transform: translateY(-18px) translateX(8px); opacity: 0.8; }
    66%  { transform: translateY(-8px) translateX(-6px); opacity: 0.5; }
    100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); opacity: 0.6; }
    50%  { transform: scale(1.05); opacity: 0.2; }
    100% { transform: scale(0.95); opacity: 0.6; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes spin-slow-rev {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes blink-dot {
    0%, 100% { opacity: 1; } 50% { opacity: 0.2; }
  }
  @keyframes scan-line {
    0%   { top: 0%; opacity: 0; }
    10%  { opacity: 0.4; }
    90%  { opacity: 0.4; }
    100% { top: 100%; opacity: 0; }
  }

  .fade-up-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  .fade-up-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
  .fade-up-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
  .fade-up-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
  .fade-up-5 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s both; }

  .nav-link {
    font-size: 13px; font-weight: 500; color: #7C6FD0;
    cursor: pointer; letter-spacing: 0.04em;
    transition: color 0.2s;
    font-family: 'DM Sans', sans-serif;
    background: none; border: none; padding: 0;
  }
  .nav-link:hover { color: #C4B5FD; }

  .btn-primary {
    padding: 14px 36px; border-radius: 14px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    color: white;
    box-shadow: 0 8px 32px rgba(79,70,229,0.45), inset 0 1px 0 rgba(255,255,255,0.1);
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative; overflow: hidden;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(79,70,229,0.6); }

  .btn-secondary {
    padding: 14px 36px; border-radius: 14px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    background: transparent;
    border: 1px solid rgba(196,181,253,0.25);
    color: #C4B5FD;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    backdrop-filter: blur(8px);
  }
  .btn-secondary:hover {
    border-color: rgba(196,181,253,0.6);
    background: rgba(196,181,253,0.06);
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: #4B4280; letter-spacing: 0.03em;
    transition: color 0.2s; padding: 0;
    text-decoration: underline; text-underline-offset: 4px;
    text-decoration-color: transparent;
  }
  .btn-ghost:hover { color: #7C6FD0; text-decoration-color: #7C6FD0; }

  .feature-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(196,181,253,0.1);
    border-radius: 24px;
    padding: 32px 28px;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative; overflow: hidden;
  }
  .feature-card:hover { border-color: rgba(196,181,253,0.25); transform: translateY(-4px); }

  .stat-num {
    font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800;
    background: linear-gradient(135deg, #C4B5FD, #818CF8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; line-height: 1;
  }
`;

// ── Star field ──────────────────────────────────────────────────
const Stars = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: (i * 37.7) % 100,
    y: (i * 53.3) % 100,
    r: (i % 3) * 0.5 + 0.4,
    delay: (i % 6),
    dur: (i % 4) + 4,
  }));
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {stars.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
          style={{ animation: `drift ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
    </svg>
  );
};

// ── Orbital graphic ─────────────────────────────────────────────
const OrbitalCore = () => (
  <div style={{ position: 'relative', width: 280, height: 280, flexShrink: 0 }}>
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '50%',
      border: '1px solid rgba(196,181,253,0.12)',
      animation: 'spin-slow 30s linear infinite',
    }}>
      <div style={{
        position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
        width: 8, height: 8, borderRadius: '50%',
        background: '#818CF8', boxShadow: '0 0 12px #818CF8',
      }} />
    </div>
    <div style={{
      position: 'absolute', inset: 28, borderRadius: '50%',
      border: '1px solid rgba(124,58,237,0.2)',
      animation: 'spin-slow-rev 20s linear infinite',
    }}>
      <div style={{
        position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
        width: 6, height: 6, borderRadius: '50%',
        background: '#7C3AED', boxShadow: '0 0 10px #7C3AED',
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: -4, transform: 'translateY(-50%)',
        width: 5, height: 5, borderRadius: '50%',
        background: '#C4B5FD', boxShadow: '0 0 8px #C4B5FD',
      }} />
    </div>
    <div style={{
      position: 'absolute', inset: 60, borderRadius: '50%',
      border: '1px solid rgba(196,181,253,0.15)',
      animation: 'spin-slow 12s linear infinite',
    }}>
      <div style={{
        position: 'absolute', top: -3, left: '30%',
        width: 5, height: 5, borderRadius: '50%',
        background: '#4F46E5', boxShadow: '0 0 8px #4F46E5',
      }} />
    </div>
    <div style={{
      position: 'absolute', inset: 88, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(79,70,229,0.3), rgba(124,58,237,0.15))',
      animation: 'pulse-ring 3s ease-in-out infinite',
    }} />
    <div style={{
      position: 'absolute', inset: 96, borderRadius: '50%',
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      boxShadow: '0 0 60px rgba(79,70,229,0.6), 0 0 120px rgba(124,58,237,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'float 4s ease-in-out infinite',
    }}>
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 40, height: 40 }}>
        <path d="M20 4L22.5 15H34L24.75 22L27.5 33L20 26L12.5 33L15.25 22L6 15H17.5L20 4Z"
          fill="white" opacity="0.95"/>
      </svg>
    </div>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(196,181,253,0.4), transparent)',
        animation: 'scan-line 4s ease-in-out infinite',
      }} />
    </div>
  </div>
);

const StepMark = ({ n }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
    fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: 'white',
  }}>{n}</div>
);

// ══════════════════════════════════════════════════════════════
export default function Landing() {
  const navigate = useNavigate();
  const { user }  = useAuth();

  useEffect(() => {
    if (user?.role === 'ambassador') navigate('/ambassador/dashboard');
    if (user?.role === 'admin')      navigate('/admin/dashboard');
  }, [user]);

  const enterDemo = () => {
    localStorage.setItem('astraliq_user', JSON.stringify({
      id: 'a1',
      role: 'ambassador',
      name: 'Priya Sharma',
      college: 'Mumbai University',
      email: 'demo@astraliq.com',
      points: 1240,
      level: 'Gold',
      streak: 7,
      badges: ['newcomer', 'first_task', 'on_fire', 'century'],
      tasksCompleted: 14,
      isDemo: true,
    }));
    navigate('/ambassador/dashboard');
  };

  const F  = "'Syne', sans-serif";
  const FB = "'DM Sans', sans-serif";

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: '100vh', background: '#0A0818', color: 'white', fontFamily: FB, overflowX: 'hidden', position: 'relative' }}>

        {/* Ambient blobs */}
        <div style={{ position: 'fixed', top: -200, left: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* NAV */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 48px',
          background: 'rgba(10,8,24,0.8)',
          borderBottom: '1px solid rgba(196,181,253,0.08)',
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79,70,229,0.5)',
              fontFamily: F, fontWeight: 900, fontSize: 16, color: 'white',
            }}>A</div>
            <div>
              <p style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: '#E8E0FF', lineHeight: 1 }}>AstralIQ</p>
              <p style={{ fontFamily: FB, fontSize: 10, fontWeight: 500, color: '#4B4280', lineHeight: 1, marginTop: 2 }}>Ambassador Platform</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <button className="nav-link">How it Works</button>
            <button className="nav-link" onClick={enterDemo}>Live Demo</button>
            <button className="nav-link" onClick={() => navigate('/github-comparison')}>GitHub Comparison</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" style={{ padding: '9px 20px', fontSize: 12 }} onClick={() => navigate('/ambassador/login')}>Sign In</button>
            <button className="btn-primary"   style={{ padding: '9px 20px', fontSize: 12 }} onClick={() => navigate('/admin/login')}>For Organizations</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          position: 'relative', zIndex: 1,
          minHeight: 'calc(100vh - 73px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 48px', overflow: 'hidden',
        }}>
          <Stars />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(196,181,253,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(196,181,253,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          <div style={{ maxWidth: 1100, width: '100%', display: 'flex', alignItems: 'center', gap: 80 }}>
            {/* Left */}
            <div style={{ flex: 1 }}>
              <div className="fade-up-1" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)',
                borderRadius: 99, padding: '6px 16px', marginBottom: 28,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', animation: 'blink-dot 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  AI-Powered Ambassador Platform
                </span>
              </div>

              <h1 className="fade-up-2" style={{
                fontFamily: F, fontWeight: 800, fontSize: 'clamp(36px, 5vw, 58px)',
                lineHeight: 1.08, color: '#E8E0FF', letterSpacing: '-0.02em', marginBottom: 20,
              }}>
                Ambassador programs,<br />
                <span style={{
                  background: 'linear-gradient(135deg, #818CF8, #C4B5FD, #7C3AED)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', animation: 'shimmer 4s linear infinite',
                }}>finally intelligent.</span>
              </h1>

              <p className="fade-up-3" style={{
                fontFamily: FB, fontSize: 17, fontWeight: 300, color: '#7C6FD0',
                lineHeight: 1.7, maxWidth: 480, marginBottom: 40,
              }}>
                Replace WhatsApp chaos and Excel spreadsheets with an AI-powered platform that tracks, motivates, and grows your campus ambassador program in real time.
              </p>

              <div className="fade-up-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
                <button className="btn-primary"   onClick={() => navigate('/ambassador/login')}>Join as Ambassador</button>
                <button className="btn-secondary" onClick={() => navigate('/admin/login')}>For Organizations</button>
              </div>

              <div className="fade-up-5">
                <button className="btn-ghost" onClick={enterDemo}>View live demo — no signup needed</button>
              </div>

              <div className="fade-up-5" style={{
                display: 'flex', gap: 32, marginTop: 48,
                paddingTop: 32, borderTop: '1px solid rgba(196,181,253,0.1)',
              }}>
                {[['4,500+', 'Ambassadors'], ['120+', 'Colleges'], ['1.2M+', 'Points Earned']].map(([num, label]) => (
                  <div key={label}>
                    <p style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: '#C4B5FD', lineHeight: 1 }}>{num}</p>
                    <p style={{ fontFamily: FB, fontSize: 12, color: '#4B4280', marginTop: 4, fontWeight: 500 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div style={{ flexShrink: 0 }}>
              <OrbitalCore />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ position: 'relative', zIndex: 1, padding: '100px 48px', borderTop: '1px solid rgba(196,181,253,0.07)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#4B4280', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Process</p>
            <h2 style={{ fontFamily: F, fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#E8E0FF', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 64 }}>How AstralIQ Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { n: '01', title: 'Join Your Program', desc: 'Ambassadors sign up, set goals, and get instantly onboarded with a personalized mission plan built around their strengths.' },
                { n: '02', title: 'Complete AI-Powered Tasks', desc: 'AI recommends tasks based on your strengths. Complete them, earn XP, and climb the leaderboard in real time.' },
                { n: '03', title: 'Rise Through the Ranks', desc: 'Bronze to Legend — unlock exclusive badges, redeem premium rewards, and become the top ambassador at your college.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="feature-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <StepMark n={n} />
                    <div style={{ height: 1, flex: 1, background: 'rgba(196,181,253,0.1)' }} />
                  </div>
                  <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: '#E8E0FF', marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontFamily: FB, fontSize: 14, color: '#7C6FD0', lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={{
          position: 'relative', zIndex: 1, padding: '80px 48px',
          background: 'rgba(79,70,229,0.04)',
          borderTop: '1px solid rgba(196,181,253,0.07)',
          borderBottom: '1px solid rgba(196,181,253,0.07)',
        }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
              {[['4,500+', 'Active Ambassadors'], ['120+', 'Partner Colleges'], ['1.2M+', 'XP Points Awarded'], ['98%', 'Retention Rate']].map(([num, label], i) => (
                <div key={label} style={{
                  textAlign: 'center', padding: '40px 20px',
                  borderRight: i < 3 ? '1px solid rgba(196,181,253,0.07)' : 'none',
                }}>
                  <p className="stat-num">{num}</p>
                  <p style={{ fontFamily: FB, fontSize: 13, color: '#4B4280', marginTop: 10, fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <section style={{
          position: 'relative', zIndex: 1, padding: '100px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 500, height: 300, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#4B4280', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Get Started</p>
          <h2 style={{ fontFamily: F, fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#E8E0FF', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16, maxWidth: 640 }}>
            Ready to build the most intelligent ambassador program?
          </h2>
          <p style={{ fontFamily: FB, fontSize: 15, color: '#7C6FD0', fontWeight: 300, marginBottom: 40, maxWidth: 480, lineHeight: 1.7 }}>
            Join thousands of students already earning XP, unlocking badges, and climbing the ranks.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
            <button className="btn-primary"   onClick={() => navigate('/ambassador/login')}>Join as Ambassador</button>
            <button className="btn-secondary" onClick={() => navigate('/admin/login')}>For Organizations</button>
          </div>
          <button className="btn-ghost" onClick={enterDemo}>View live demo — no signup needed</button>
        </section>

        {/* FOOTER */}
        <footer style={{
          borderTop: '1px solid rgba(196,181,253,0.08)', padding: '28px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F, fontWeight: 900, fontSize: 12, color: 'white',
            }}>A</div>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: '#4B4280' }}>AstralIQ</span>
          </div>
          <p style={{ fontFamily: FB, fontSize: 12, color: '#2D2660', fontWeight: 400 }}>
            Built for students. Powered by AI.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <button className="nav-link" style={{ fontSize: 12 }}>Privacy</button>
            <button className="nav-link" style={{ fontSize: 12 }}>Terms</button>
            <button className="nav-link" style={{ fontSize: 12 }}>Contact</button>
          </div>
        </footer>
      </div>
    </>
  );
}