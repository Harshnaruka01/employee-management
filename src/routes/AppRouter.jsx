import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { LoginPage } from '../pages/auth/LoginPage.jsx'
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage.jsx'
import { AuthErrorPage } from '../pages/auth/AuthErrorPage.jsx'
import { AppLayout } from '../components/layout/AppLayout.jsx'
import { DashboardPage } from '../pages/dashboard/DashboardPage.jsx'
import { EmployeesPage } from '../pages/dashboard/EmployeesPage.jsx'
import { SalaryRecordsPage } from '../pages/dashboard/SalaryRecordsPage.jsx'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/auth-error" element={<AuthErrorPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="salary-records" element={<SalaryRecordsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

