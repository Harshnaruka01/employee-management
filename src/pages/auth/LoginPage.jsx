import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, firebaseConfigError, isFirebaseConfigured } from '../../firebase/firebase.js'
import { useAuth } from '../../context/AuthContext.jsx'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [authError, setAuthError] = useState('')
  const { roleStatus, isAdmin } = useAuth()

  const defaultValues = useMemo(() => ({ email: '', password: '' }), [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setAuthError('')
    try {
      if (!isFirebaseConfigured || !auth) {
        setAuthError('Firebase is not configured yet. Add your .env values and restart the dev server.')
        return
      }
      await signInWithEmailAndPassword(auth, values.email, values.password)
      enqueueSnackbar('Welcome back!', { variant: 'success' })
      navigate('/', { replace: true })
    } catch (e) {
      setAuthError(e?.message || 'Login failed')
    }
  })

  useEffect(() => {
    if (isAdmin) navigate('/', { replace: true })
    if (roleStatus === 'unauthorized') navigate('/unauthorized', { replace: true })
    if (roleStatus === 'error') navigate('/auth-error', { replace: true })
  }, [isAdmin, navigate, roleStatus])

  if (!isFirebaseConfigured) {
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
              Firebase setup required
            </Typography>
            <Typography color="text.secondary">
              Add Firebase env variables to <code>frontend/.env</code> then restart the dev server.
            </Typography>
          </Stack>

          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Stack spacing={1.5}>
                <Alert severity="warning">
                  {firebaseConfigError?.message || 'Missing Firebase configuration.'}
                </Alert>
                {firebaseConfigError?.missingEnv?.length ? (
                  <Box component="pre" sx={{ m: 0, p: 2, borderRadius: 2, bgcolor: 'background.default', overflowX: 'auto' }}>
                    {firebaseConfigError.missingEnv.map((k) => `${k}=\n`).join('')}
                  </Box>
                ) : null}
                <Typography variant="body2" color="text.secondary">
                  Tip: copy <code>.env.example</code> to <code>.env</code> and fill in values from Firebase Console.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

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
            Admin Login
          </Typography>
          <Typography color="text.secondary">
            Sign in to manage employees and monthly salary records.
          </Typography>
        </Stack>

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack component="form" spacing={2} onSubmit={onSubmit}>
              {authError ? <Alert severity="error">{authError}</Alert> : null}

              <TextField
                label="Email"
                autoComplete="email"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>

              <Typography variant="body2" color="text.secondary">
                Admin access is controlled by the Firestore collection{' '}
                <code>admins</code>.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

