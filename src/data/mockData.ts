import type { Employee, AttendanceRecord, LeaveRequest, WfhRequest, ExpenseRequest, LocationBoundary } from '../types';

export const employees: Employee[] = [
  { id: 'emp1', name: 'Aarav Sharma', email: 'aarav@company.com', department: 'Engineering', designation: 'Senior Developer', phone: '+91 98765 43210', avatar: 'AS', joinDate: '2023-01-15', status: 'active' },
  { id: 'emp2', name: 'Priya Patel', email: 'priya@company.com', department: 'Design', designation: 'UI/UX Designer', phone: '+91 98765 43211', avatar: 'PP', joinDate: '2023-03-20', status: 'active' },
  { id: 'emp3', name: 'Rahul Verma', email: 'rahul@company.com', department: 'Marketing', designation: 'Marketing Lead', phone: '+91 98765 43212', avatar: 'RV', joinDate: '2022-11-01', status: 'active' },
  { id: 'emp4', name: 'Sneha Reddy', email: 'sneha@company.com', department: 'HR', designation: 'HR Manager', phone: '+91 98765 43213', avatar: 'SR', joinDate: '2022-06-10', status: 'active' },
  { id: 'emp5', name: 'Vikram Singh', email: 'vikram@company.com', department: 'Engineering', designation: 'Tech Lead', phone: '+91 98765 43214', avatar: 'VS', joinDate: '2021-09-05', status: 'active' },
  { id: 'emp6', name: 'Ananya Gupta', email: 'ananya@company.com', department: 'Finance', designation: 'Financial Analyst', phone: '+91 98765 43215', avatar: 'AG', joinDate: '2023-07-12', status: 'active' },
  { id: 'emp7', name: 'Karan Mehta', email: 'karan@company.com', department: 'Engineering', designation: 'Backend Developer', phone: '+91 98765 43216', avatar: 'KM', joinDate: '2024-01-08', status: 'active' },
  { id: 'emp8', name: 'Divya Nair', email: 'divya@company.com', department: 'Design', designation: 'Product Designer', phone: '+91 98765 43217', avatar: 'DN', joinDate: '2023-05-22', status: 'active' },
];

const today = new Date().toISOString().split('T')[0];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'att1', employeeId: 'emp1', date: today, checkIn: '09:05', checkOut: null, latitude: 12.9716, longitude: 77.5946, status: 'present' },
  { id: 'att2', employeeId: 'emp2', date: today, checkIn: '09:15', checkOut: '18:30', latitude: 12.9716, longitude: 77.5946, status: 'present' },
  { id: 'att3', employeeId: 'emp3', date: today, checkIn: null, checkOut: null, latitude: null, longitude: null, status: 'absent' },
  { id: 'att4', employeeId: 'emp4', date: today, checkIn: null, checkOut: null, latitude: null, longitude: null, status: 'leave' },
  { id: 'att5', employeeId: 'emp5', date: today, checkIn: '08:50', checkOut: null, latitude: 12.9716, longitude: 77.5946, status: 'present' },
  { id: 'att6', employeeId: 'emp6', date: today, checkIn: '09:30', checkOut: '18:00', latitude: null, longitude: null, status: 'wfh' },
  { id: 'att7', employeeId: 'emp7', date: today, checkIn: '09:00', checkOut: null, latitude: 12.9716, longitude: 77.5946, status: 'present' },
  { id: 'att8', employeeId: 'emp8', date: today, checkIn: null, checkOut: null, latitude: null, longitude: null, status: 'absent' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'lr1', employeeId: 'emp4', employeeName: 'Sneha Reddy', type: 'casual', startDate: today, endDate: today, reason: 'Personal work', status: 'pending', appliedOn: today },
  { id: 'lr2', employeeId: 'emp3', employeeName: 'Rahul Verma', type: 'sick', startDate: today, endDate: today, reason: 'Not feeling well', status: 'pending', appliedOn: today },
  { id: 'lr3', employeeId: 'emp1', employeeName: 'Aarav Sharma', type: 'earned', startDate: '2024-12-20', endDate: '2024-12-25', reason: 'Family vacation', status: 'approved', appliedOn: '2024-12-10' },
  { id: 'lr4', employeeId: 'emp2', employeeName: 'Priya Patel', type: 'casual', startDate: '2024-11-15', endDate: '2024-11-15', reason: 'Doctor appointment', status: 'approved', appliedOn: '2024-11-10' },
  { id: 'lr5', employeeId: 'emp8', employeeName: 'Divya Nair', type: 'unpaid', startDate: '2024-10-01', endDate: '2024-10-05', reason: 'Personal travel', status: 'rejected', appliedOn: '2024-09-25' },
];

export const wfhRequests: WfhRequest[] = [
  { id: 'wf1', employeeId: 'emp6', employeeName: 'Ananya Gupta', date: today, reason: 'Home renovation, need to be available for workers', status: 'approved', appliedOn: today },
  { id: 'wf2', employeeId: 'emp2', employeeName: 'Priya Patel', date: today, reason: 'Feeling unwell but can work from home', status: 'pending', appliedOn: today },
  { id: 'wf3', employeeId: 'emp7', employeeName: 'Karan Mehta', date: today, reason: 'Internet issue at office area', status: 'pending', appliedOn: today },
  { id: 'wf4', employeeId: 'emp1', employeeName: 'Aarav Sharma', date: '2024-12-10', reason: 'Child care', status: 'approved', appliedOn: '2024-12-09' },
  { id: 'wf5', employeeId: 'emp3', employeeName: 'Rahul Verma', date: '2024-11-20', reason: 'Dental appointment in morning', status: 'rejected', appliedOn: '2024-11-18' },
];

export const expenseRequests: ExpenseRequest[] = [
  { id: 'ex1', employeeId: 'emp1', employeeName: 'Aarav Sharma', type: 'travel', amount: 2500, description: 'Client visit - Bangalore to Mysore', billFile: 'travel_bill.pdf', status: 'pending', appliedOn: today },
  { id: 'ex2', employeeId: 'emp3', employeeName: 'Rahul Verma', type: 'food', amount: 850, description: 'Team lunch with client', billFile: 'food_bill.jpg', status: 'pending', appliedOn: today },
  { id: 'ex3', employeeId: 'emp5', employeeName: 'Vikram Singh', type: 'travel', amount: 5000, description: 'Conference travel - Delhi', billFile: 'conference_travel.pdf', status: 'approved', appliedOn: '2024-12-15' },
  { id: 'ex4', employeeId: 'emp2', employeeName: 'Priya Patel', type: 'other', amount: 1200, description: 'Design software subscription', billFile: 'software_receipt.pdf', status: 'approved', appliedOn: '2024-12-01' },
  { id: 'ex5', employeeId: 'emp8', employeeName: 'Divya Nair', type: 'food', amount: 450, description: 'Client dinner meeting', billFile: null, status: 'rejected', appliedOn: '2024-11-28' },
];

export const defaultLocationBoundary: LocationBoundary = {
  latitude: 12.9716,
  longitude: 77.5946,
  radius: 100,
};

export const employeeCredentials = [
  { email: 'aarav@company.com', password: 'emp123', employeeId: 'emp1' },
  { email: 'priya@company.com', password: 'emp123', employeeId: 'emp2' },
  { email: 'rahul@company.com', password: 'emp123', employeeId: 'emp3' },
  { email: 'sneha@company.com', password: 'emp123', employeeId: 'emp4' },
  { email: 'vikram@company.com', password: 'emp123', employeeId: 'emp5' },
  { email: 'ananya@company.com', password: 'emp123', employeeId: 'emp6' },
  { email: 'karan@company.com', password: 'emp123', employeeId: 'emp7' },
  { email: 'divya@company.com', password: 'emp123', employeeId: 'emp8' },
];

export const adminCredentials = { username: 'admin', password: 'admin123' };
