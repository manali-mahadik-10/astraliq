import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🏢</div>
        <h1 className="text-2xl font-bold text-indigo-600 mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-6">Welcome, {user?.name} — Full UI coming in Phase 5</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/admin/ambassadors')} className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl text-sm">Ambassadors</button>
          <button onClick={() => navigate('/admin/tasks')} className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl text-sm">Tasks</button>
          <button onClick={() => navigate('/admin/analytics')} className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl text-sm">Analytics</button>
          <button onClick={() => navigate('/admin/ai-insights')} className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl text-sm">AI Insights</button>
          <button onClick={() => { logout(); navigate('/'); }} className="px-4 py-2 bg-red-100 text-red-500 rounded-xl text-sm">Logout</button>
        </div>
      </div>
    </div>
  );
}