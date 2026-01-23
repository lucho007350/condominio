import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  Home as HomeIcon,
  People as PeopleIcon,
  Apartment as BuildingIcon,
  Payment as PaymentIcon,
  Badge as EmployeeIcon,
  ExpandMore as ExpandMoreIcon,
  ReceiptLong as FacturaIcon,
  Campaign as ComunicadoIcon
} from '@mui/icons-material';

const Navbar = () => {
  const location = useLocation();

  const [anchorPeople, setAnchorPeople] = React.useState(null);
  const [anchorManagement, setAnchorManagement] = React.useState(null);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={4} sx={{ backdropFilter: 'blur(8px)' }}>
      <Toolbar>
        {/* Logo */}
        <BuildingIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Condominio App
        </Typography>

        {/* Inicio */}
        <Button
          component={Link}
          to="/"
          color="inherit"
          startIcon={<HomeIcon />}
          sx={{
            mx: 1,
            borderRadius: 2,
            backgroundColor: isActive('/') ? 'rgba(255,255,255,0.15)' : 'transparent',
          }}
        >
          Inicio
        </Button>

        {/* 🔔 Comunicados (NUEVO) */}
        <Button
          component={Link}
          to="/comunicacion"
          color="inherit"
          startIcon={<ComunicadoIcon />}
          sx={{
            mx: 1,
            borderRadius: 2,
            backgroundColor: isActive('/comunicacion')
              ? 'rgba(255,255,255,0.15)'
              : 'transparent',
          }}
        >
          Comunicados
        </Button>

        {/* Administración */}
        <Button
          color="inherit"
          startIcon={<PeopleIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={(e) => setAnchorPeople(e.currentTarget)}
          sx={{ mx: 1, borderRadius: 2 }}
        >
          Administración
        </Button>

        <Menu
          anchorEl={anchorPeople}
          open={Boolean(anchorPeople)}
          onClose={() => setAnchorPeople(null)}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 200 } }}
        >
          <MenuItem component={Link} to="/residents" onClick={() => setAnchorPeople(null)}>
            <PeopleIcon sx={{ mr: 1 }} /> Residentes
          </MenuItem>

          <MenuItem component={Link} to="/employees" onClick={() => setAnchorPeople(null)}>
            <EmployeeIcon sx={{ mr: 1 }} /> Empleados
          </MenuItem>
        </Menu>

        {/* Gestión */}
        <Button
          color="inherit"
          startIcon={<BuildingIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={(e) => setAnchorManagement(e.currentTarget)}
          sx={{ mx: 1, borderRadius: 2 }}
        >
          Gestión
        </Button>

        <Menu
          anchorEl={anchorManagement}
          open={Boolean(anchorManagement)}
          onClose={() => setAnchorManagement(null)}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 220 } }}
        >
          <MenuItem component={Link} to="/units" onClick={() => setAnchorManagement(null)}>
            <BuildingIcon sx={{ mr: 1 }} /> Unidades Habitacionales
          </MenuItem>

          <MenuItem component={Link} to="/payments" onClick={() => setAnchorManagement(null)}>
            <PaymentIcon sx={{ mr: 1 }} /> Pagos
          </MenuItem>

          <MenuItem component={Link} to="/facturas" onClick={() => setAnchorManagement(null)}>
            <FacturaIcon sx={{ mr: 1 }} /> Facturas
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
