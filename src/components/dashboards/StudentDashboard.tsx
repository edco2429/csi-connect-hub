
import React from 'react';

interface StudentDashboardProps {
  activeView: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeView }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
          <p>View events with details and register for participation</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Registration Status</h2>
          <p>Track your registration approval status</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Payment Processing</h2>
          <p>Make secure event fee payments</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">User Profile</h2>
          <p>View and edit your profile information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Calendar</h2>
          <p>Manage your personal schedule</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p>Personalize your account settings</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
