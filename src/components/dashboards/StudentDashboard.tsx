
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEvents, getUserRegistrations, registerForEvent, Event, Registration } from '../../lib/supabase';

interface StudentDashboardProps {
  activeView: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeView }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        // Fetch events
        const eventsData = await getEvents();
        setEvents(eventsData);
        
        // Fetch registrations
        const registrationsData = await getUserRegistrations(user.id);
        setRegistrations(registrationsData);
        
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleRegister = async (eventId: string) => {
    if (!user) return;
    
    setRegistering(true);
    setMessage('');
    
    const result = await registerForEvent(user.id, eventId);
    
    if (result.success) {
      setMessage('Successfully registered for event. Awaiting approval.');
      // Refresh registrations
      const registrationsData = await getUserRegistrations(user.id);
      setRegistrations(registrationsData);
    } else {
      setMessage(`Registration failed: ${result.error.message}`);
    }
    
    setRegistering(false);
  };

  // Check if user is already registered for an event
  const isRegistered = (eventId: string) => {
    return registrations.some(reg => reg.event_id === eventId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 col-span-full">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          
          {events.length === 0 ? (
            <p className="text-gray-500">No upcoming events found.</p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">{event.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Date:</span> {event.date}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {event.time}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Location:</span> {event.location}
                    </div>
                  </div>
                  <div className="mt-4">
                    {isRegistered(event.id) ? (
                      <button 
                        className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                        disabled
                      >
                        Already Registered
                      </button>
                    ) : (
                      <button 
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => handleRegister(event.id)}
                        disabled={registering}
                      >
                        {registering ? 'Registering...' : 'Register Now'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Registration Status</h2>
          {registrations.length === 0 ? (
            <p className="text-gray-500">No registrations found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <li key={reg.id} className="py-3">
                  <p className="font-medium">{reg.events?.name}</p>
                  <p className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${
                      reg.status === 'approved' ? 'text-green-600' : 
                      reg.status === 'rejected' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
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
