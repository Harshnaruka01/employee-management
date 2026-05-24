import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'

const drawerWidth = 272

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

