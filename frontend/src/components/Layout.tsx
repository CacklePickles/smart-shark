import React, { ReactNode } from 'react'
import { Box, BottomNavigation, BottomNavigationAction, Paper, Typography, AppBar, Toolbar, Container, IconButton, useTheme } from '@mui/material'
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material'
import sharkIcon from '../assets/shark-icon.svg'

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Scan', icon: <SecurityIcon />, path: '/scan' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
]

interface LayoutProps {
  children: ReactNode;
  toggleTheme: () => void;
}

const Layout = ({ children, toggleTheme }: LayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const theme = useTheme()

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      pb: '64px', // Add padding bottom to account for fixed navigation
    }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => navigate('/')}
          >
            <img
              src={sharkIcon}
              alt="Smart Shark"
              style={{ width: 40, height: 40, marginRight: 8 }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Shark
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      <Paper
        sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={currentPath}
          onChange={(_, newValue) => {
            navigate(newValue)
          }}
          sx={{
            backgroundColor: '#002B5C',
            height: 64,
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#ffffff',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            },
          }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              value={item.path}
              icon={item.icon}
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  '&.Mui-selected': {
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default Layout