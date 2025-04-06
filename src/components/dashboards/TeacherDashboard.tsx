
import React from 'react';

interface TeacherDashboardProps {
  activeView: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ activeView }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Manage Registrations</h2>
          <p>View and track student event registrations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Monitor Payments</h2>
          <p>Oversee payment statuses of registered students</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Attendance Management</h2>
          <p>Mark and manage event attendance</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Calendar</h2>
          <p>Add, delete, and update event schedules</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p>Receive alerts about student registrations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p>Customize dashboard preferences</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
