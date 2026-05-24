import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export function UnauthorizedPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'grid',
        placeItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Access denied
          </Typography>
          <Typography color="text.secondary">
            You signed in as <b>{user?.email || 'a user'}</b> but this account is not an admin.
          </Typography>
        </Stack>

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack spacing={2}>
              <Typography color="text.secondary">
                To grant admin access, create a Firestore document:
              </Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  overflowX: 'auto',
                }}
              >
                {`Collection: admins
Document ID: ${user?.uid || '<USER_UID>'}
Fields: { name: 'Admin', email: '${user?.email || '<EMAIL>'}', disabled: false }`}
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login', { replace: true })}
                >
                  Back to login
                </Button>
                <Button variant="outlined" color="inherit" onClick={logout}>
                  Sign out
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

