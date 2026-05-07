import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Playlist from './pages/Playlist';
import Courses from './pages/Courses';
import Notes from './pages/Notes';
import PYQs from './pages/PYQs';
import Campus from './pages/Campus';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingCompletePage from './pages/OnboardingCompletePage';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[rgb(var(--border-primary))] border-t-[rgb(var(--color-primary))] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const { isAuthenticated, isOnboardingComplete, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[rgb(var(--border-primary))] border-t-[rgb(var(--color-primary))] animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          {/* Public auth routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Onboarding complete (needs auth but shown before dashboard) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding-complete" element={<OnboardingCompletePage />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/pyqs" element={<PYQs />} />
              <Route path="/campus" element={<Campus />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}
