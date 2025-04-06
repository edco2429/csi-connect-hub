
import React, { useState } from 'react';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import TeacherDashboard from '../components/dashboards/TeacherDashboard';
import CommitteeDashboard from '../components/dashboards/CommitteeDashboard';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  // Any props the Dashboard component might need
}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  // Determine which dashboard to render based on user role
  const renderDashboard = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (user.role) {
      case 'student':
        return <StudentDashboard activeView={activeView} />;
      case 'teacher':
        return <TeacherDashboard activeView={activeView} />;
      case 'committee':
        return <CommitteeDashboard activeView={activeView} />;
      default:
        return (
          <div className="text-center p-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
              <p className="font-bold">Unknown Role</p>
              <p>Your account has an unknown role: {user.role}. Please contact the administrator.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'Student Dashboard' : 
             user?.role === 'teacher' ? 'Teacher Dashboard' : 
             user?.role === 'committee' ? 'Committee Dashboard' : 'Dashboard'}
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg">
              {renderDashboard()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
