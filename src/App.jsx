import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
// Auth
import Landing from './pages/auth/Landing';
import AmbassadorLogin from './pages/auth/AmbassadorLogin';
import AdminLogin from './pages/auth/AdminLogin';
import Onboarding from './pages/auth/Onboarding';

// Ambassador
import AmbassadorDashboard from './pages/ambassador/AmbassadorDashboard';
import TaskCenter from './pages/ambassador/TaskCenter';
import Leaderboard from './pages/ambassador/Leaderboard';
import BadgeCollection from './pages/ambassador/BadgeCollection';
import AmbassadorProfile from './pages/ambassador/AmbassadorProfile';
import RewardsStore from './pages/ambassador/RewardsStore';
import AICoach from './pages/ambassador/AICoach';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AmbassadorManagement from './pages/admin/AmbassadorManagement';
import TaskManagement from './pages/admin/TaskManagement';
import Analytics from './pages/admin/Analytics';
import AIInsights from './pages/admin/AIInsights';

// Special
import LiveDemo from './pages/special/LiveDemo';
import LoadingTransition from './pages/special/LoadingTransition';
import GitHubComparison from './pages/special/GitHubComparison';

const ProtectedAmbassador = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== 'ambassador') return <Navigate to="/" />;
  return children;
};

const ProtectedAdmin = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<LiveDemo />} />
      <Route path="/loading" element={<LoadingTransition />} />
      <Route path="/github-comparison" element={<GitHubComparison />} />

      {/* AUTH */}
      <Route path="/ambassador/login" element={<AmbassadorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* AMBASSADOR - Protected */}
      <Route path="/ambassador/dashboard" element={
        <ProtectedAmbassador><AmbassadorDashboard /></ProtectedAmbassador>
      } />
      <Route path="/ambassador/tasks" element={
        <ProtectedAmbassador><TaskCenter /></ProtectedAmbassador>
      } />
      <Route path="/ambassador/leaderboard" element={
        <ProtectedAmbassador><Leaderboard /></ProtectedAmbassador>
      } />
      <Route path="/ambassador/badges" element={
        <ProtectedAmbassador><BadgeCollection /></ProtectedAmbassador>
      } />
      <Route path="/ambassador/profile" element={
        <ProtectedAmbassador><AmbassadorProfile /></ProtectedAmbassador>
      } />
      <Route path="/ambassador/rewards" element={
        <ProtectedAmbassador><RewardsStore /></ProtectedAmbassador>
      } />
      <Route path="/ambassador/ai-coach" element={
        <ProtectedAmbassador><AICoach /></ProtectedAmbassador>
      } />

      {/* ADMIN - Protected */}
      <Route path="/admin/dashboard" element={
        <ProtectedAdmin><AdminDashboard /></ProtectedAdmin>
      } />
      <Route path="/admin/ambassadors" element={
        <ProtectedAdmin><AmbassadorManagement /></ProtectedAdmin>
      } />
      <Route path="/admin/tasks" element={
        <ProtectedAdmin><TaskManagement /></ProtectedAdmin>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedAdmin><Analytics /></ProtectedAdmin>
      } />
      <Route path="/admin/ai-insights" element={
        <ProtectedAdmin><AIInsights /></ProtectedAdmin>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}



function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;