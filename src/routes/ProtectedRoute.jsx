import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute({ children }) {
  const { loading, isAdmin, roleStatus } = useAuth()

  if (loading || roleStatus === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (roleStatus === 'unauthorized') return <Navigate to="/unauthorized" replace />
  if (roleStatus === 'error') return <Navigate to="/auth-error" replace />
  if (!isAdmin) return <Navigate to="/login" replace />

  return children
}

