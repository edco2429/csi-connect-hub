
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Define types for our detailed profiles
type DetailedProfile = User & {
  studentProfile?: {
    roll_number: string | null;
    department: string | null;
    year_of_study: number | null;
  } | null;
  teacherProfile?: {
    employee_id: string | null;
    department: string | null;
    specialization: string | null;
  } | null;
  committeeProfile?: {
    committee_name: string | null;
    position: string | null;
    term_start: string | null;
    term_end: string | null;
  } | null;
};

const SignupTracker: React.FC = () => {
  const [users, setUsers] = useState<DetailedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'teacher' | 'committee'>('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          throw profilesError;
        }

        // Create a map to store detailed profiles
        const detailedProfiles: DetailedProfile[] = [];

        // Process each profile to fetch role-specific details
        for (const profile of profilesData || []) {
          const detailedProfile: DetailedProfile = { ...profile };

          // Fetch specific profile details based on role
          if (profile.role === 'student') {
            const { data: studentData } = await supabase
              .from('student_profiles')
              .select('*')
              .eq('profile_id', profile.id)
              .single();
            
            detailedProfile.studentProfile = studentData;
          } else if (profile.role === 'teacher') {
            const { data: teacherData } = await supabase
              .from('teacher_profiles')
              .select('*')
              .eq('profile_id', profile.id)
              .single();
            
            detailedProfile.teacherProfile = teacherData;
          } else if (profile.role === 'committee') {
            const { data: committeeData } = await supabase
              .from('committee_profiles')
              .select('*')
              .eq('profile_id', profile.id)
              .single();
            
            detailedProfile.committeeProfile = committeeData;
          }

          detailedProfiles.push(detailedProfile);
        }

        setUsers(detailedProfiles);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError(err.message || 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
    }
  }, [user]);

  // Filter users based on active tab
  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    return user.role === activeTab;
  });

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to view sign-up tracking.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Registration Tracker</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'student'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teacher'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Teachers
            </button>
            <button
              onClick={() => setActiveTab('committee')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'committee'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Committee
            </button>
          </nav>
        </div>

        {/* Users table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role-Specific Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'student' ? 'bg-green-100 text-green-800' : 
                              user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 
                              'bg-purple-100 text-purple-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.role === 'student' && user.studentProfile && (
                              <div>
                                <p>Roll Number: {user.studentProfile.roll_number || 'Not provided'}</p>
                                <p>Department: {user.studentProfile.department || 'Not provided'}</p>
                                <p>Year: {user.studentProfile.year_of_study || 'Not provided'}</p>
                              </div>
                            )}
                            {user.role === 'teacher' && user.teacherProfile && (
                              <div>
                                <p>Employee ID: {user.teacherProfile.employee_id || 'Not provided'}</p>
                                <p>Department: {user.teacherProfile.department || 'Not provided'}</p>
                                <p>Specialization: {user.teacherProfile.specialization || 'Not provided'}</p>
                              </div>
                            )}
                            {user.role === 'committee' && user.committeeProfile && (
                              <div>
                                <p>Committee: {user.committeeProfile.committee_name || 'Not provided'}</p>
                                <p>Position: {user.committeeProfile.position || 'Not provided'}</p>
                                <p>Term: {user.committeeProfile.term_start ? `${user.committeeProfile.term_start} to ${user.committeeProfile.term_end}` : 'Not provided'}</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at || '').toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {activeTab === 'all' ? 
                          'No users found.' : 
                          `No ${activeTab} users found.`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupTracker;
