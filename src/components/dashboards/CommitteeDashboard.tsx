
import React from 'react';

interface CommitteeDashboardProps {
  activeView: string;
}

const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({ activeView }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Committee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Event Management</h2>
          <p>Add new events with details and poster images</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Registration Tracking</h2>
          <p>Monitor student registrations for each event</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Committee Members</h2>
          <p>View committee members' information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Attendance History</h2>
          <p>Upload and store attendance sheet images</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Calendar</h2>
          <p>Manage committee-related tasks and events</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p>Control website-wide settings and preferences</p>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
