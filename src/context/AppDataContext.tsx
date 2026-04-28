import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Employee, AttendanceRecord, LeaveRequest, WfhRequest, ExpenseRequest, AppSettings } from '../types';
import { 
  employees as initialEmployees, 
  attendanceRecords as initialAttendance, 
  leaveRequests as initialLeaves, 
  wfhRequests as initialWfh, 
  expenseRequests as initialExpenses,
  defaultLocationBoundary
} from '../data/mockData';

interface AppDataContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  wfhRequests: WfhRequest[];
  expenses: ExpenseRequest[];
  settings: AppSettings;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  addAttendance: (record: AttendanceRecord) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  addLeave: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
  addWfhRequest: (request: WfhRequest) => void;
  updateWfhStatus: (id: string, status: WfhRequest['status']) => void;
  addExpense: (request: ExpenseRequest) => void;
  updateExpenseStatus: (id: string, status: ExpenseRequest['status']) => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [wfhRequests, setWfhRequests] = useState<WfhRequest[]>(initialWfh);
  const [expenses, setExpenses] = useState<ExpenseRequest[]>(initialExpenses);
  const [settings, setSettings] = useState<AppSettings>({
    officeLocation: defaultLocationBoundary,
    checkInTime: '09:00',
    checkOutTime: '18:00',
  });

  const addEmployee = (employee: Employee) => setEmployees(prev => [...prev, employee]);
  const updateEmployee = (id: string, updates: Partial<Employee>) =>
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  const deleteEmployee = (id: string) =>
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings);

  const addAttendance = (record: AttendanceRecord) => setAttendance(prev => [...prev, record]);
  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) =>
    setAttendance(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

  const addLeave = (request: LeaveRequest) => setLeaves(prev => [request, ...prev]);
  const updateLeaveStatus = (id: string, status: LeaveRequest['status']) =>
    setLeaves(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const addWfhRequest = (request: WfhRequest) => setWfhRequests(prev => [request, ...prev]);
  const updateWfhStatus = (id: string, status: WfhRequest['status']) =>
    setWfhRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const addExpense = (request: ExpenseRequest) => setExpenses(prev => [request, ...prev]);
  const updateExpenseStatus = (id: string, status: ExpenseRequest['status']) =>
    setExpenses(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  return (
    <AppDataContext.Provider value={{
      employees, attendance, leaves, wfhRequests, expenses, settings,
      addEmployee, updateEmployee, deleteEmployee, updateSettings,
      addAttendance, updateAttendance,
      addLeave, updateLeaveStatus,
      addWfhRequest, updateWfhStatus,
      addExpense, updateExpenseStatus,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
