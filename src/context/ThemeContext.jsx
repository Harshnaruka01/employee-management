import { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const ThemeModeContext = createContext(null)

const STORAGE_KEY = 'esm.themeMode'

function getInitialMode() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return 'light'
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode)

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: { main: '#4F46E5' }, // indigo
        secondary: { main: '#06B6D4' }, // cyan
        background: {
          default: mode === 'dark' ? '#0B1220' : '#F6F7FB',
          paper: mode === 'dark' ? '#0F1A2E' : '#FFFFFF',
        },
      },
      shape: { borderRadius: 12 },
      typography: {
        fontFamily: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ].join(','),
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : 'none',
            },
          },
        },
      },
    })
  }, [mode])

  const value = useMemo(() => {
    return {
      mode,
      setMode: (next) => {
        setMode(next)
        localStorage.setItem(STORAGE_KEY, next)
      },
      toggle: () => {
        setMode((prev) => {
          const next = prev === 'dark' ? 'light' : 'dark'
          localStorage.setItem(STORAGE_KEY, next)
          return next
        })
      },
    }
  }, [mode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within AppThemeProvider')
  return ctx
}

