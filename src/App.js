import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './components/Landing';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import Auth from './components/Auth';
import { Loader2 } from 'lucide-react';

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🔒 Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}

// Main App Component (wrapped in AuthProvider)
function AppContent() {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'admin'
  const [dark, setDark] = useState(true);
  const { user, loading } = useAuth();  // ✅ Removed isAdmin

  // Auto-redirect based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        // If logged in and on landing/auth, go to dashboard
        if (view === 'landing' || view === 'auth') {
          setView('dashboard');
        }
      } else {
        // If not logged in and trying to access protected routes
        if (view === 'dashboard' || view === 'admin') {
          setView('landing');
        }
      }
    }
  }, [user, loading, view]);

  // Theme management
  useEffect(() => {
    document.body.style.backgroundColor = dark ? '#0a0a0f' : '#f9fafb';
    document.body.style.margin = '0';
  }, [dark]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Nexus AI...</p>
        </div>
      </div>
    );
  }

  // Landing Page
  if (view === 'landing' && !user) {
    return <Landing setView={setView} dark={dark} />;
  }

  // Auth Page
  if (view === 'auth' || (!user && view !== 'landing')) {
    return <Auth onSuccess={() => setView('dashboard')} />;
  }

  // User Dashboard
  if (view === 'dashboard') {
    return (
      <ProtectedRoute>
        <UserDashboard 
          dark={dark} 
          setDark={setDark}
          onNavigateToAdmin={() => setView('admin')}
        />
      </ProtectedRoute>
    );
  }

  // Admin Dashboard
  if (view === 'admin') {
    return (
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard 
          dark={dark} 
          setDark={setDark}
          onNavigateToDashboard={() => setView('dashboard')}
        />
      </ProtectedRoute>
    );
  }

  return <Landing setView={setView} dark={dark} />;
}

// App wrapper with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}