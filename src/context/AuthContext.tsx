import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Employee, LocationBoundary } from '../types';
import { employees, defaultLocationBoundary, employeeCredentials as initialCreds, adminCredentials } from '../data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  employee: Employee | null;
  locationBoundary: LocationBoundary;
  loginEmployee: (email: string, password: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  setLocationBoundary: (boundary: LocationBoundary) => void;
  updateProfile: (updates: Partial<Employee>) => void;
  resetPassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [locationBoundary, setLocationBoundary] = useState<LocationBoundary>(defaultLocationBoundary);
  const [creds, setCreds] = useState(initialCreds);

  const loginEmployee = (email: string, password: string): boolean => {
    const cred = creds.find(c => c.email === email && c.password === password);
    if (cred) {
      const emp = employees.find(e => e.id === cred.employeeId);
      if (emp) {
        setEmployee(emp);
        setIsAuthenticated(true);
        setIsAdmin(false);
        return true;
      }
    }
    return false;
  };

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setEmployee(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setEmployee(null);
  };

  const updateProfile = (updates: Partial<Employee>) => {
    setEmployee(prev => prev ? { ...prev, ...updates } : null);
  };

  const resetPassword = (newPassword: string) => {
    if (!employee) return;
    setCreds(prev => prev.map(c => 
      c.employeeId === employee.id ? { ...c, password: newPassword } : c
    ));
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
