import { useMemo } from 'react'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useThemeMode } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export function Topbar() {
  const { mode, toggle } = useThemeMode()
  const { adminProfile, logout } = useAuth()

  const initials = useMemo(() => {
    const name = adminProfile?.name || adminProfile?.email || 'Admin'
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('')
  }, [adminProfile])

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        bgcolor: (t) =>
          t.palette.mode === 'dark'
            ? 'rgba(15, 26, 46, 0.72)'
            : 'rgba(255, 255, 255, 0.72)',
      }}
    >
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Employee Salary Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Tooltip title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <IconButton onClick={toggle} aria-label="toggle theme">
            {mode === 'dark' ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title={`Logout (${initials})`}>
          <IconButton onClick={logout} aria-label="logout">
            <LogoutOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

