import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://127.0.0.1:8000';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('codeOptimizer_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const userData: User = await response.json();
      setUser(userData);
      localStorage.setItem('codeOptimizer_user', JSON.stringify(userData));
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (username: string, password: string, mobileNumber?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, mobile_number: mobileNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const userData: User = await response.json();
      // Auto login after register
      setUser(userData);
      localStorage.setItem('codeOptimizer_user', JSON.stringify(userData));
      toast.success('Registration successful!');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codeOptimizer_user');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
