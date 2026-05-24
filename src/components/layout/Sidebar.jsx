import { NavLink } from 'react-router-dom'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
  { to: '/employees', label: 'Employees', icon: <PeopleOutlinedIcon /> },
  { to: '/salary-records', label: 'Salary Records', icon: <ReceiptLongOutlinedIcon /> },
]

export function Sidebar({ drawerWidth }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="overline" color="text.secondary">
          HR Suite
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          Salary Admin
        </Typography>
      </Box>
      <Divider />

      <List sx={{ p: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              borderRadius: 2,
              my: 0.5,
              '&.active': {
                bgcolor: (t) =>
                  t.palette.mode === 'dark'
                    ? 'rgba(79, 70, 229, 0.18)'
                    : 'rgba(79, 70, 229, 0.10)',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

