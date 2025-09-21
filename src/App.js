import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ReportIssuePage from './components/ReportIssuePage';
import MyReportsPage from './components/MyReportsPage';
import LoginPage from './components/LoginPage';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/report" element={user ? <ReportIssuePage /> : <Navigate to="/login" />} />
      <Route path="/my-reports" element={user ? <MyReportsPage /> : <Navigate to="/login" />} />
      <Route path="/analytics" element={user ? <AnalyticsDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <OfflineProvider>
            <NotificationProvider>
              <Router>
                <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
                  <AppRoutes />
                </div>
              </Router>
            </NotificationProvider>
          </OfflineProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
