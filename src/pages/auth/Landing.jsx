import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'ambassador') navigate('/ambassador/dashboard');
    if (user?.role === 'admin') navigate('/admin/dashboard');
  }, [user]);

  const enterDemo = () => {
    localStorage.setItem('astraliq_user', JSON.stringify({
      role: 'ambassador',
      name: 'Priya Sharma',
      college: 'Mumbai University',
      email: 'demo@astraliq.com',
      points: 1240,
      level: 'Gold',
      streak: 7,
      badges: ['First Task', 'On Fire', 'Century'],
      tasksCompleted: 14,
      isDemo: true
    }));
    navigate('/ambassador/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-violet-100 flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-5 flex justify-between items-center backdrop-blur-sm bg-white/70 border-b border-indigo-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-extrabold text-indigo-700 tracking-tight">AstralIQ</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <span className="cursor-pointer hover:text-indigo-600 transition">How it Works</span>
          <span className="cursor-pointer hover:text-indigo-600 transition" onClick={enterDemo}>Live Demo</span>
          <button
            onClick={() => navigate('/github-comparison')}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition text-xs font-semibold"
          >
            ⚡ GitHub Comparison
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        {/* Animated Orb */}
        <div className="relative w-44 h-44 mb-12">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 opacity-10 animate-ping" style={{animationDuration:'3s'}} />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 opacity-15 animate-ping" style={{animationDuration:'2s'}} />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 opacity-30 blur-xl" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl flex items-center justify-center">
            <span className="text-white text-5xl">✦</span>
          </div>
          {/* Orbiting dots */}
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-indigo-400"
              style={{
                top: `${50 + 45 * Math.sin(i * Math.PI / 2)}%`,
                left: `${50 + 45 * Math.cos(i * Math.PI / 2)}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 0.6
              }}
            />
          ))}
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-5 leading-tight">
          Ambassador programs,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
            finally intelligent.
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-12 leading-relaxed">
          AstralIQ replaces WhatsApp chaos and Excel spreadsheets with an AI-powered platform that tracks, motivates, and grows your campus ambassador program in real time.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => navigate('/ambassador/login')}
            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            I'm an Ambassador 🚀
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            I'm an Organization 🏢
          </button>
        </div>

        <button onClick={enterDemo} className="text-sm text-indigo-400 hover:text-indigo-600 underline underline-offset-4 transition">
          ✨ View Live Demo — no signup needed
        </button>

        {/* Stats */}
        <div className="mt-20 flex gap-12 md:gap-20 text-center">
          {[['4,500+', 'Ambassadors'], ['120+', 'Colleges'], ['1.2M+', 'Points Earned'], ['98%', 'Retention Rate']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-indigo-600">{num}</div>
              <div className="text-sm text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border-t border-indigo-50 py-20 px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-16">How AstralIQ Works</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          {[
            { step: '01', icon: '🎯', title: 'Join Your Program', desc: 'Ambassadors sign up, set goals, and get instantly onboarded with a personalized mission plan.' },
            { step: '02', icon: '⚡', title: 'Complete AI-Powered Tasks', desc: 'AI recommends tasks based on your strengths. Complete them, earn points, climb the leaderboard.' },
            { step: '03', icon: '🏆', title: 'Rise Through the Ranks', desc: 'Bronze to Legend — unlock badges, redeem rewards, and become the top ambassador at your college.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="flex-1 text-center p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
              <div className="text-4xl mb-4">{icon}</div>
              <div className="text-xs font-bold text-indigo-400 mb-2 tracking-widest">STEP {step}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
          <span className="font-bold text-indigo-600">AstralIQ</span>
        </div>
        <p className="text-sm text-gray-400">Built for students. Powered by AI. Designed to make impact.</p>
      </footer>
    </div>
  );
}