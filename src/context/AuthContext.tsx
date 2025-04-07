
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { User } from '../lib/supabase';

// Define types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  register: (email: string, password: string, role: string, name: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ error: null }),
  register: async () => ({ error: null }),
  logout: async () => {},
});

// Create provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session) {
          try {
            const fetchUserProfile = () => {
              supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
                .then(({ data: userData, error }) => {
                  if (error) {
                    console.error("Error fetching user data:", error);
                  }
                  
                  if (userData) {
                    console.log("User data found:", userData);
                    setUser(userData as User);
                  } else {
                    console.warn("No user data found for ID:", session.user.id);
                  }
                  
                  setLoading(false);
                });
            };
            
            // Use setTimeout to prevent potential Supabase deadlocks
            setTimeout(fetchUserProfile, 0);
          } catch (err) {
            console.error("Exception in auth state change handler:", err);
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Existing session check:", session?.user?.id);
        
        if (session) {
          const { data: userData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user data from session:", error);
          }
          
          if (userData) {
            console.log("User data from session:", userData);
            setUser(userData as User);
          } else {
            console.warn("No user data found for session ID:", session.user.id);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Exception in session fetch:", err);
        setLoading(false);
      }
    };

    fetchSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt for email:", email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
    } else {
      console.log("Login successful");
    }
    
    return { error };
  };

  const register = async (email: string, password: string, role: string, name: string) => {
    console.log("Register attempt:", { email, role, name });
    
    // Create the auth user
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role
        }
      }
    });

    if (signUpError || !data.user) {
      console.error("Signup error:", signUpError);
      return { error: signUpError };
    }

    console.log("Auth signup successful, user ID:", data.user.id);

    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create hook
export const useAuth = () => useContext(AuthContext);
