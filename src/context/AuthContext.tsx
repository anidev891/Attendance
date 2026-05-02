import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Employee, LocationBoundary, AuthUser } from '../types';
import { defaultLocationBoundary } from '../data/mockData';
import { login as apiLogin } from '../apis/authApi';
import { getCookie, deleteCookie } from '../utils/cookies';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  employee: Employee | null;
  locationBoundary: LocationBoundary;
  loginEmployee: (username: string, password: string) => Promise<boolean>;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLocationBoundary: (boundary: LocationBoundary) => void;
  updateProfile: (updates: Partial<Employee>) => void;
  resetPassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mapAuthUserToEmployee = (user: AuthUser): Employee => ({
  id: user.userId.toString(),
  name: user.fullName,
  email: user.username,
  department: 'Operations', // Default values since API doesn't provide them yet
  designation: user.role === 'ADMIN' ? 'Administrator' : 'Staff',
  phone: user.username,
  avatar: user.fullName.charAt(0),
  joinDate: new Date().toISOString(),
  status: 'active'
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [locationBoundary, setLocationBoundary] = useState<LocationBoundary>(defaultLocationBoundary);

  useEffect(() => {
    // Restore session from cookies
    const savedUser = getCookie('user') as AuthUser | null;
    const token = getCookie('token');

    if (savedUser && token) {
      setIsAuthenticated(true);
      setIsAdmin(savedUser.userTypeId === 1);
      setEmployee(mapAuthUserToEmployee(savedUser));
    }
  }, []);

  const loginEmployee = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(username, password);
      if (response.status === 0 && response.data) {
        const { user } = response.data;
        setIsAuthenticated(true);
        setIsAdmin(user.userTypeId === 1);
        setEmployee(mapAuthUserToEmployee(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    return loginEmployee(username, password); // Same API for both
  };

  const logout = () => {
    deleteCookie('token');
    deleteCookie('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setEmployee(null);
    window.location.href = '/login';
  };

  const updateProfile = (updates: Partial<Employee>) => {
    setEmployee(prev => prev ? { ...prev, ...updates } : null);
  };

  const resetPassword = (newPassword: string) => {
    // In a real app, this would call an API
    console.log('Resetting password to:', newPassword);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, isAdmin, employee, locationBoundary, 
      loginEmployee, loginAdmin, logout, setLocationBoundary, 
      updateProfile, resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
