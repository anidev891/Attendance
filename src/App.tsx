import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import EmployeeLoginPage from './components/login/EmployeeLoginPage';
import AdminLoginPage from './components/login/AdminLoginPage';
import EmployeeLayout from './components/employee/EmployeeLayout';
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEmployees from './components/admin/AdminEmployees';
import AdminLeaveApprovals from './components/admin/AdminLeaveApprovals';
import AdminWfhApprovals from './components/admin/AdminWfhApprovals';
import AdminExpenseApprovals from './components/admin/AdminExpenseApprovals';
import AdminAttendanceReport from './components/admin/AdminAttendanceReport';
import AdminLeaveReport from './components/admin/AdminLeaveReport';
import AdminExpenseReport from './components/admin/AdminExpenseReport';
import AdminSettings from './components/admin/AdminSettings';

// Employee Pages
import EmployeeHome from './components/employee/EmployeeHome';
import EmployeeLeave from './components/employee/EmployeeLeave';
import EmployeeWfh from './components/employee/EmployeeWfh';
import EmployeeExpenses from './components/employee/EmployeeExpenses';
import EmployeeProfile from './components/employee/EmployeeProfile';

function ProtectedRoute({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/employee" replace />;
  }

  return children;
}

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <EmployeeLoginPage />
      } />
      <Route path="/admin/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <AdminLoginPage />
      } />

      {/* Root Redirection */}
      <Route path="/" element={
        !isAuthenticated 
          ? <Navigate to="/login" replace /> 
          : (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/employee" replace />)
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="leave-approvals" element={<AdminLeaveApprovals />} />
        <Route path="wfh-approvals" element={<AdminWfhApprovals />} />
        <Route path="expense-approvals" element={<AdminExpenseApprovals />} />
        <Route path="attendance-report" element={<AdminAttendanceReport />} />
        <Route path="leave-report" element={<AdminLeaveReport />} />
        <Route path="expense-report" element={<AdminExpenseReport />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={
        <ProtectedRoute>
          <EmployeeLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EmployeeHome />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="wfh" element={<EmployeeWfh />} />
        <Route path="expenses" element={<EmployeeExpenses />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppDataProvider>
              <AppContent />
            </AppDataProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
