import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ orgName: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      role: 'admin',
      name: form.orgName,
      email: form.email,
    });
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-violet-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-indigo-100">
        <button onClick={() => navigate('/')} className="text-sm text-indigo-400 hover:text-indigo-600 mb-8 transition">
          ← Back to Home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg">
            🏢
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Organization Login</h2>
            <p className="text-gray-400 text-sm">Manage your ambassador program</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { key: 'orgName', label: 'Organization Name', placeholder: 'e.g. UnsaidTalks', type: 'text' },
            { key: 'email', label: 'Work Email', placeholder: 'admin@organization.com', type: 'email' },
            { key: 'password', label: 'Password', placeholder: 'Your password', type: 'password' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm transition"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-2 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-200"
          >
            Enter Dashboard 🏢
          </button>
        </form>
      </div>
    </div>
  );
}