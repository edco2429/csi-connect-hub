
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'committee';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (email: string, password: string, role: string, name: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Create provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock functions - will be replaced with Supabase
  const login = async (email: string, password: string, role: string) => {
    // This is a mock - will be replaced with Supabase auth
    const mockUser: User = {
      id: '123',
      email,
      role: role as 'student' | 'teacher' | 'committee',
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, role: string, name: string) => {
    // This is a mock - will be replaced with Supabase auth
    const mockUser: User = {
      id: '123',
      email,
      role: role as 'student' | 'teacher' | 'committee',
      name,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create hook
export const useAuth = () => useContext(AuthContext);
