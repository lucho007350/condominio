import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  alpha,
  IconButton,
  Drawer,
  Tooltip,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Apartment as BuildingIcon,
  Payment as PaymentIcon,
  Badge as EmployeeIcon,
  ReceiptLong as FacturaIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  MarkEmailUnread as PqrsIcon,
  PersonAdd as PersonAddIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";

const navbarColors = {
  primary: '#0a1c2c',
  secondary: '#0f2a3a',
  accent: '#2c5f6e',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.7)',
  hover: 'rgba(255,255,255,0.1)',
};

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const [user] = useState(storedUser);
  const [isAdmin] = useState(storedUser.role === 'admin' || storedUser.rol === 'administrador');
  const [isPropietario] = useState(storedUser.role === 'propietario' || storedUser.rol === 'propietario');

  const homePath = isAdmin ? '/' : isPropietario ? '/' : '/inicio';

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    navigate('/perfil');
    handleMenuClose();
  };

  const handleNotificationsClick = () => {
    navigate('/comunicacion');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleManualClick = () => {
    const manualUrl = `${import.meta.env.BASE_URL}MANUAL_DE_USUARIO.html`;
    window.open(manualUrl, '_blank', 'noopener,noreferrer');
  };

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    const items = [
      { path: homePath, label: 'Inicio', icon: <HomeIcon /> },
    ];
    
    if (isAdmin) {
      items.push(
        { path: '/residents', label: 'Residentes', icon: <PeopleIcon /> },
        { path: '/employees', label: 'Empleados', icon: <EmployeeIcon /> },
        { path: '/units', label: 'Unidades', icon: <BuildingIcon /> },
        { path: '/facturas', label: 'Facturas', icon: <FacturaIcon /> },
        { path: '/payments', label: 'Pagos', icon: <PaymentIcon /> },
        { path: '/admin/pqrs', label: 'PQRS', icon: <PqrsIcon /> }        
      );
    } else if (isPropietario) {
      // Para propietario: solo Inicio, Mis Pagos y PQRS
      items.push(
        { path: '/mis-pagos', label: 'Mis Pagos', icon: <ReceiptIcon /> },
        { path: '/propietario/pqrs', label: 'PQRS', icon: <PqrsIcon /> }
      );
    } else {
      // Para residente
      items.push(
        { path: '/mis-pagos', label: 'Mis Pagos', icon: <ReceiptIcon /> },
        { path: '/pqrs', label: 'PQRS', icon: <PqrsIcon /> }
      );
    }
    
    return items;
  };
  
  const navItems = getNavItems();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            backgroundColor: navbarColors.primary,
            color: navbarColors.text,
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
            borderRight: 'none',
            top: 0,
            height: '100vh',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'space-between' : 'center',
          borderBottom: `1px solid ${alpha(navbarColors.text, 0.1)}`,
        }}>
          {open && (
            <Typography variant="h6" sx={{ fontWeight: 700, color: navbarColors.text }}>
              Condova
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle} sx={{ color: navbarColors.text }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Box sx={{ 
          p: 2, 
          textAlign: 'center', 
          borderBottom: `1px solid ${alpha(navbarColors.text, 0.1)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar
            sx={{
              width: open ? 56 : 40,
              height: open ? 56 : 40,
              margin: '0 auto',
              bgcolor: alpha(navbarColors.accent, 0.6),
              fontSize: open ? '1.5rem' : '1rem',
              fontWeight: 'bold',
              mb: open ? 1 : 0,
              transition: 'all 0.2s ease',
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          {open && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
                {user.name || user.nombre || 'Usuario'}
              </Typography>
              <Typography variant="caption" sx={{ color: navbarColors.textMuted }}>
                {isAdmin ? 'Administrador' : isPropietario ? 'Propietario' : 'Residente'}
              </Typography>
            </>
          )}
        </Box>

        <List sx={{ px: 1, py: 2, flex: 1 }}>
          {navItems.map((item) => (
            <Tooltip key={item.path} title={!open ? item.label : ''} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    justifyContent: open ? 'initial' : 'center',
                    px: open ? 2 : 1,
                    backgroundColor: isActive(item.path) ? alpha(navbarColors.accent, 0.3) : 'transparent',
                    '&:hover': { backgroundColor: alpha(navbarColors.accent, 0.2) },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: navbarColors.text, 
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, ml: open ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`, transition: 'margin 0.2s ease', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#ffffff',
            width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
            ml: open ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
            transition: 'width 0.2s ease, margin 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '& .MuiToolbar-root': {
              minHeight: 48,
            },
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleRegisterClick}
                  sx={{
                    bgcolor: navbarColors.secondary,
                    color: '#ffffff',
                    '&:hover': { 
                      bgcolor: navbarColors.accent,
                    },
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 500,
                  }}
                >
                  Registrar
                </Button>
              )}

              <Tooltip title="Comunicados">
                <IconButton 
                  size="large" 
                  sx={{ color: '#64748b' }}
                  onClick={handleNotificationsClick}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Manual de usuario">
                <IconButton
                  size="large"
                  sx={{ color: '#64748b' }}
                  onClick={handleManualClick}
                  aria-label="Manual de usuario"
                >
                  <MenuBookIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Perfil">
                <IconButton onClick={handleMenuOpen} size="small">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      bgcolor: '#2c5f6e',
                      fontSize: '0.9rem',
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <MenuItem onClick={handleViewProfile} sx={{ py: 1.5 }}>
                  <PersonIcon sx={{ mr: 2, fontSize: 20, color: '#2c5f6e' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Ver Perfil</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#ef4444' }} />
                  <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 500 }}>Cerrar Sesión</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ pt: '56px', px: 3, pb: 3, width: '100%', boxSizing: 'border-box' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
