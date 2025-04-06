
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
