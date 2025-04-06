
import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual values once connected to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type User = {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'committee';
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer_id: string;
  created_at?: string;
  updated_at?: string;
}

export type Registration = {
  id: string;
  user_id: string;
  event_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export type Attendance = {
  id: string;
  user_id: string;
  event_id: string;
  status: 'present' | 'absent';
  created_at?: string;
}

export type Payment = {
  id: string;
  user_id: string;
  event_id: string;
  payment_status: 'pending' | 'completed' | 'failed';
  amount: number;
  transaction_id?: string;
  created_at?: string;
}

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export type Settings = {
  id: string;
  user_id: string;
  preferences: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Database helper functions
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*');
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data as Event[];
};

export const getUserRegistrations = async (userId: string) => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      events:event_id (*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
  
  return data;
};

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

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
    console.error('Error fetching settings:', error);
    return null;
  }
  
  return data as Settings | null;
};

export const updateUserSettings = async (userId: string, preferences: Record<string, any>) => {
  // First check if the settings already exist
  const existingSettings = await getUserSettings(userId);
  
  if (existingSettings) {
    // Update existing settings
    const { data, error } = await supabase
      .from('settings')
      .update({ preferences })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating settings:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } else {
    // Create new settings
    const { data, error } = await supabase
      .from('settings')
      .insert([{ user_id: userId, preferences }]);
    
    if (error) {
      console.error('Error creating settings:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  }
};
