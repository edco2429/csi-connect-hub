
import { supabase as supabaseClient } from '../integrations/supabase/client';

// Use the initialized client from the integrations folder
export const supabase = supabaseClient;

// Type definitions for our database tables
export type User = {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'committee';
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Profile type definitions
export type StudentProfile = {
  profile_id: string;
  roll_number?: string;
  department?: string;
  year_of_study?: number;
  created_at?: string;
  updated_at?: string;
}

export type TeacherProfile = {
  profile_id: string;
  department?: string;
  employee_id?: string;
  specialization?: string;
  created_at?: string;
  updated_at?: string;
}

export type CommitteeProfile = {
  profile_id: string;
  committee_name?: string;
  position?: string;
  term_start?: string;
  term_end?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper functions to fetch profile data
export const getStudentProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('profile_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
  
  return data as StudentProfile;
};

export const getTeacherProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('teacher_profiles')
    .select('*')
    .eq('profile_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching teacher profile:', error);
    return null;
  }
  
  return data as TeacherProfile;
};

export const getCommitteeProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('committee_profiles')
    .select('*')
    .eq('profile_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching committee profile:', error);
    return null;
  }
  
  return data as CommitteeProfile;
};

// Function to get the appropriate profile based on user role
export const getUserProfileByRole = async (userId: string, role: 'student' | 'teacher' | 'committee') => {
  switch (role) {
    case 'student':
      return getStudentProfile(userId);
    case 'teacher':
      return getTeacherProfile(userId);
    case 'committee':
      return getCommitteeProfile(userId);
    default:
      return null;
  }
};

// Helper function to update profiles
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const updateStudentProfile = async (userId: string, updates: Partial<StudentProfile>) => {
  const { data, error } = await supabase
    .from('student_profiles')
    .update(updates)
    .eq('profile_id', userId);
  
  if (error) {
    console.error('Error updating student profile:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const updateTeacherProfile = async (userId: string, updates: Partial<TeacherProfile>) => {
  const { data, error } = await supabase
    .from('teacher_profiles')
    .update(updates)
    .eq('profile_id', userId);
  
  if (error) {
    console.error('Error updating teacher profile:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const updateCommitteeProfile = async (userId: string, updates: Partial<CommitteeProfile>) => {
  const { data, error } = await supabase
    .from('committee_profiles')
    .update(updates)
    .eq('profile_id', userId);
  
  if (error) {
    console.error('Error updating committee profile:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

// User authentication helper function
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
  
  return data as User;
};

// Event-related types and functions
export type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  created_by: string;
  created_at: string;
}

export type Registration = {
  id: string;
  user_id: string;
  event_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  events?: Event;
}

// Function to get all events
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data as Event[];
};

// Function to get user registrations
export const getUserRegistrations = async (userId: string) => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, events(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user registrations:', error);
    return [];
  }
  
  return data as Registration[];
};

// Function to register for an event
export const registerForEvent = async (userId: string, eventId: string) => {
  const { data, error } = await supabase
    .from('registrations')
    .insert([
      { user_id: userId, event_id: eventId, status: 'pending' }
    ]);
  
  if (error) {
    console.error('Error registering for event:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};
