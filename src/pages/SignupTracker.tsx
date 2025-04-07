
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Define type for signup tracking data
type SignupRecord = {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'committee';
  signup_date: string | null;
  browser: string | null;
  device: string | null;
  ip_address: string | null;
  success: boolean | null;
  // Include the detailed profiles data for joining
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
  const [signups, setSignups] = useState<SignupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'teacher' | 'committee'>('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchSignupData = async () => {
      try {
        setLoading(true);
        // Fetch signup tracking data
        const { data: signupData, error: signupError } = await supabase
          .from('signup_tracking')
          .select('*')
          .order('signup_date', { ascending: false });

        if (signupError) {
          throw signupError;
        }

        // Create a map to store detailed signup records
        const detailedSignups: SignupRecord[] = [];

        // Process each signup to fetch role-specific details
        for (const signup of signupData || []) {
          const detailedSignup: SignupRecord = { ...signup };

          // Fetch profile to get the user ID
          if (signup.user_id) {
            // Fetch specific profile details based on role
            if (signup.role === 'student') {
              const { data: studentData } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('profile_id', signup.user_id)
                .single();
              
              detailedSignup.studentProfile = studentData;
            } else if (signup.role === 'teacher') {
              const { data: teacherData } = await supabase
                .from('teacher_profiles')
                .select('*')
                .eq('profile_id', signup.user_id)
                .single();
              
              detailedSignup.teacherProfile = teacherData;
            } else if (signup.role === 'committee') {
              const { data: committeeData } = await supabase
                .from('committee_profiles')
                .select('*')
                .eq('profile_id', signup.user_id)
                .single();
              
              detailedSignup.committeeProfile = committeeData;
            }
          }

          detailedSignups.push(detailedSignup);
        }

        setSignups(detailedSignups);
      } catch (err: any) {
        console.error('Error fetching signup data:', err);
        setError(err.message || 'Failed to fetch signup data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSignupData();
    }
  }, [user]);

  // Filter signups based on active tab
  const filteredSignups = signups.filter(signup => {
    if (activeTab === 'all') return true;
    return signup.role === activeTab;
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

        {/* Signups table */}
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device Info
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSignups.length > 0 ? (
                    filteredSignups.map((signup) => (
                      <tr key={signup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{signup.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{signup.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${signup.role === 'student' ? 'bg-green-100 text-green-800' : 
                              signup.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 
                              'bg-purple-100 text-purple-800'}`}>
                            {signup.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {signup.role === 'student' && signup.studentProfile && (
                              <div>
                                <p>Roll Number: {signup.studentProfile.roll_number || 'Not provided'}</p>
                                <p>Department: {signup.studentProfile.department || 'Not provided'}</p>
                                <p>Year: {signup.studentProfile.year_of_study || 'Not provided'}</p>
                              </div>
                            )}
                            {signup.role === 'teacher' && signup.teacherProfile && (
                              <div>
                                <p>Employee ID: {signup.teacherProfile.employee_id || 'Not provided'}</p>
                                <p>Department: {signup.teacherProfile.department || 'Not provided'}</p>
                                <p>Specialization: {signup.teacherProfile.specialization || 'Not provided'}</p>
                              </div>
                            )}
                            {signup.role === 'committee' && signup.committeeProfile && (
                              <div>
                                <p>Committee: {signup.committeeProfile.committee_name || 'Not provided'}</p>
                                <p>Position: {signup.committeeProfile.position || 'Not provided'}</p>
                                <p>Term: {signup.committeeProfile.term_start ? `${signup.committeeProfile.term_start} to ${signup.committeeProfile.term_end}` : 'Not provided'}</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {signup.signup_date ? new Date(signup.signup_date).toLocaleDateString() : 'Not available'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {signup.browser && (
                            <div>
                              <p>Browser: {signup.browser}</p>
                              <p>Device: {signup.device || 'Unknown'}</p>
                              <p>IP: {signup.ip_address || 'Unknown'}</p>
                            </div>
                          ) || 'Not available'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {activeTab === 'all' ? 
                          'No signup records found.' : 
                          `No ${activeTab} signup records found.`}
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
