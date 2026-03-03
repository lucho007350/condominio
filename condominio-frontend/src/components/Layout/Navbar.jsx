import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  Divider,
} from "@mui/material";

import {
  Home as HomeIcon,
  People as PeopleIcon,
  Apartment as BuildingIcon,
  Payment as PaymentIcon,
  Badge as EmployeeIcon,
  ExpandMore as ExpandMoreIcon,
  ReceiptLong as FacturaIcon,
  Campaign as ComunicadoIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon, // Agregar este ícono
} from "@mui/icons-material";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorAdmin, setAnchorAdmin] = useState(null);
  const [anchorGestion, setAnchorGestion] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);
  
  // Obtener usuario del storage
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPropietario, setIsPropietario] = useState(false); // Nuevo estado para propietario

  useEffect(() => {
    // Obtener usuario al cargar el componente
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setUser(userData);
    setIsAdmin(userData.role === 'admin');
    setIsPropietario(userData.role === 'propietario'); // Verificar si es propietario
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1e3a5f", color: "white" }}>
      <Toolbar>
        {/* LOGO / TÍTULO */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Condominio App
        </Typography>

        {/* INICIO - Visible para todos */}
        <Button
          component={Link}
          to="/"
          color="inherit"
          startIcon={<HomeIcon />}
          sx={{
            mx: 1,
            borderBottom: location.pathname === "/" ? "2px solid #ffffff" : "none",
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          Inicio
        </Button>

        {/* COMUNICADOS - Visible para todos */}
        <Button
          component={Link}
          to="/comunicacion"
          color="inherit"
          startIcon={<ComunicadoIcon />}
          sx={{
            mx: 1,
            borderBottom: location.pathname === "/comunicacion" ? "2px solid #ffffff" : "none",
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          Comunicados
        </Button>

        {/* OPCIONES DE USUARIO REGULAR (solo si es user) */}
        {!isAdmin && !isPropietario && user && (
          <>
            {/* MI PERFIL */}
            <Button
              component={Link}
              to="/perfil"
              color="inherit"
              startIcon={<PersonIcon />}
              sx={{
                mx: 1,
                borderBottom: location.pathname === "/perfil" ? "2px solid #ffffff" : "none",
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Mi Perfil
            </Button>

            {/* MIS PAGOS */}
            <Button
              component={Link}
              to="/mis-pagos"
              color="inherit"
              startIcon={<ReceiptIcon />}
              sx={{
                mx: 1,
                borderBottom: location.pathname === "/mis-pagos" ? "2px solid #ffffff" : "none",
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Mis Pagos
            </Button>
          </>
        )}

        {/* OPCIONES DE PROPIETARIO (solo si es propietario) */}
        {isPropietario && user && (
          <>
            {/* MIS PROPIEDADES */}
            <Button
              component={Link}
              to="/mis-propiedades"
              color="inherit"
              startIcon={<BusinessIcon />}
              sx={{
                mx: 1,
                borderBottom: location.pathname === "/mis-propiedades" ? "2px solid #ffffff" : "none",
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Mis Propiedades
            </Button>
          </>
        )}

        {/* OPCIONES DE ADMINISTRADOR (solo si es admin) */}
        {isAdmin && (
          <>
            {/* ADMINISTRACIÓN */}
            <Button
              color="inherit"
              startIcon={<PeopleIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={(e) => setAnchorAdmin(e.currentTarget)}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Administración
            </Button>

            <Menu
              anchorEl={anchorAdmin}
              open={Boolean(anchorAdmin)}
              onClose={() => setAnchorAdmin(null)}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  borderRadius: 2,
                  mt: 1,
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/residents"
                onClick={() => setAnchorAdmin(null)}
              >
                <PeopleIcon sx={{ mr: 1 }} /> Residentes
              </MenuItem>

              <MenuItem
                component={Link}
                to="/employees"
                onClick={() => setAnchorAdmin(null)}
              >
                <EmployeeIcon sx={{ mr: 1 }} /> Empleados
              </MenuItem>
            </Menu>

            {/* GESTIÓN */}
            <Button
              color="inherit"
              startIcon={<BuildingIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={(e) => setAnchorGestion(e.currentTarget)}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Gestión
            </Button>

            <Menu
              anchorEl={anchorGestion}
              open={Boolean(anchorGestion)}
              onClose={() => setAnchorGestion(null)}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  borderRadius: 2,
                  mt: 1,
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/units"
                onClick={() => setAnchorGestion(null)}
              >
                <BuildingIcon sx={{ mr: 1 }} /> Unidades
              </MenuItem>

              <MenuItem
                component={Link}
                to="/facturas"
                onClick={() => setAnchorGestion(null)}
              >
                <FacturaIcon sx={{ mr: 1 }} /> Facturas
              </MenuItem>

              <MenuItem
                component={Link}
                to="/payments"
                onClick={() => setAnchorGestion(null)}
              >
                <PaymentIcon sx={{ mr: 1 }} /> Pagos
              </MenuItem>
            </Menu>
          </>
        )}

        {/* PERFIL DE USUARIO Y CERRAR SESIÓN (visible para todos) */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              onClick={(e) => setAnchorUser(e.currentTarget)}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 35, 
                  height: 35, 
                  bgcolor: '#4a6a9a',
                  fontSize: '0.9rem'
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorUser}
              open={Boolean(anchorUser)}
              onClose={() => setAnchorUser(null)}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 200,
                },
              }}
            >
              
              {/* Opciones según el rol */}
              {!isAdmin && !isPropietario && (
                <MenuItem 
                  component={Link}
                  to="/mis-pagos"
                  onClick={() => setAnchorUser(null)}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  <ReceiptIcon sx={{ mr: 2, fontSize: 20 }} /> Mis Pagos
                </MenuItem>
              )}

              {isPropietario && (
                <MenuItem 
                  component={Link}
                  to="/mis-propiedades"
                  onClick={() => setAnchorUser(null)}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  <BusinessIcon sx={{ mr: 2, fontSize: 20 }} /> Mis Propiedades
                </MenuItem>
              )}
              
              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: '#ff6b6b',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,107,107,0.1)',
                  } 
                }}
              >
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;