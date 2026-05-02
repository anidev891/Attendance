export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'present' | 'absent' | 'leave' | 'wfh';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'casual' | 'sick' | 'earned' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export interface WfhRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export interface ExpenseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'travel' | 'food' | 'other';
  amount: number;
  description: string;
  billFile: string | null;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export interface LocationBoundary {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface AppSettings {
  officeLocation: LocationBoundary;
  checkInTime: string;
  checkOutTime: string;
}

export type EmployeeTab = 'home' | 'leave' | 'wfh' | 'expenses' | 'profile';
export type AdminSection = 'dashboard' | 'employees' | 'leave-approvals' | 'wfh-approvals' | 'expense-approvals' | 'attendance-report' | 'leave-report' | 'expense-report' | 'settings';

export interface AuthUser {
  userId: number;
  userTypeId: number;
  username: string;
  fullName: string;
  role: string;
  isLoggedIn: number;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
