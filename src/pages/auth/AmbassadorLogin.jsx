import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AmbassadorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', college: '', password: '' });
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      role: 'ambassador',
      name: form.name || 'Ambassador',
      email: form.email,
      college: form.college || 'My College',
      points: 0,
      level: 'Bronze',
      streak: 0,
      badges: [],
      tasksCompleted: 0,
      isNew: true
    };
    login(userData);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-violet-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-indigo-100">
        <button onClick={() => navigate('/')} className="text-sm text-indigo-400 hover:text-indigo-600 mb-8 flex items-center gap-1 transition">
          ← Back to Home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg">
            🚀
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Join as Ambassador</h2>
            <p className="text-gray-400 text-sm">Start your journey today</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm transition"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">College Name</label>
                <input
                  type="text"
                  placeholder="Your college name"
                  value={form.college}
                  onChange={e => setForm({ ...form, college: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm transition"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="Your college email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm transition"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm transition"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-200"
          >
            {isLogin ? 'Login 🚀' : 'Create Account 🚀'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}