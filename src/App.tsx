
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/auth'} />} />
      </Routes>
    </Router>
  );
};

export default App;
