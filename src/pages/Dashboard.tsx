
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
      return <div>Loading...</div>;
    }

    switch (user.role) {
      case 'student':
        return <StudentDashboard activeView={activeView} />;
      case 'teacher':
        return <TeacherDashboard activeView={activeView} />;
      case 'committee':
        return <CommitteeDashboard activeView={activeView} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            {renderDashboard()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
