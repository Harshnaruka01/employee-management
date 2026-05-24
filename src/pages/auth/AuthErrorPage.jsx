import { Alert, Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext.jsx'

export function AuthErrorPage() {
  const { roleError, logout } = useAuth()

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
            Can’t verify admin access
          </Typography>
          <Typography color="text.secondary">
            This usually happens when Firestore security rules block reads, or Firestore isn’t enabled yet.
          </Typography>
        </Stack>

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack spacing={2}>
              <Alert severity="error">
                {roleError || 'Unknown error while loading admin profile.'}
              </Alert>
              <Typography color="text.secondary">
                Check:
                <br />- Firestore is enabled in Firebase Console
                <br />- Your rules allow the signed-in user to read <code>admins/&lt;uid&gt;</code>
              </Typography>
              <Button variant="outlined" color="inherit" onClick={logout}>
                Sign out
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

