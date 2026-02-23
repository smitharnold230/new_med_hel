import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar'; // We might need this if we want to include it here, but it's used in pages
import MedicineReminder from './components/common/MedicineReminder';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HealthChartsPage from './pages/HealthChartsPage';
import DoctorsPage from './pages/DoctorsPage';
import MedicinePage from './pages/MedicinePage';
import AIChatPage from './pages/AIChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/common/BottomNav';
import QuickActionsFAB from './components/common/QuickActionsFAB';
import HealthLogger from './components/health/HealthLogger';
import SafetyCheckModal from './components/ai/SafetyCheckModal';
import { UIProvider, useUI } from './context/UIContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './index.css';

function App() {
  useEffect(() => {
    // Apply theme on initial load
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <UIProvider>
        <Toaster position="top-right" />
        <MedicineReminder />
        <Router>
          <AppContent />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { showLogger, closeLogger, showSafetyCheck } = useUI();
  const { token } = useAuth();

  const handleLogSubmit = async (formData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/health-logs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Health data logged successfully');
      closeLogger();
      // Optionally refresh data if on dashboard, but since it's global, 
      // simple toast is safest for now.
    } catch (error) {
      console.error('Error logging health data:', error);
      toast.error('Failed to log health data');
    }
  };

  return (
    <>
      <BottomNav />
      <QuickActionsFAB />
      {showSafetyCheck && <SafetyCheckModal />}

      {showLogger && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-2xl relative">
            <button
              onClick={closeLogger}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            >
              ✕
            </button>
            <HealthLogger onSubmit={handleLogSubmit} />
          </div>
        </div>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/charts"
          element={
            <PrivateRoute>
              <HealthChartsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <PrivateRoute>
              <DoctorsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/medicines"
          element={
            <PrivateRoute>
              <MedicinePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <PrivateRoute>
              <AIChatPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
