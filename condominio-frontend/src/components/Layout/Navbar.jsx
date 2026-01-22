import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Apartment as BuildingIcon,
  Payment as PaymentIcon,
  Badge as EmployeeIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();

  const [anchorPeople, setAnchorPeople] = React.useState(null);
  const [anchorManagement, setAnchorManagement] = React.useState(null);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        {/* Logo */}
        <BuildingIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Condominio App
        </Typography>

        {/* Dashboard */}
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

        {/* Personas (menú flotante) */}
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
          PaperProps={{
            elevation: 4,
            sx: { borderRadius: 2, minWidth: 200 },
          }}
        >
          <MenuItem component={Link} to="/residents" onClick={() => setAnchorPeople(null)}>
            <PeopleIcon sx={{ mr: 1 }} /> Residentes
          </MenuItem>

          <MenuItem component={Link} to="/employees" onClick={() => setAnchorPeople(null)}>
            <EmployeeIcon sx={{ mr: 1 }} /> Empleados
          </MenuItem>
        </Menu>

        {/* Gestión (menú flotante) */}
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
          PaperProps={{
            elevation: 4,
            sx: { borderRadius: 2, minWidth: 220 },
          }}
        >
          <MenuItem component={Link} to="/units" onClick={() => setAnchorManagement(null)}>
            <BuildingIcon sx={{ mr: 1 }} /> Unidades Habitacionales
          </MenuItem>

          <MenuItem component={Link} to="/payments" onClick={() => setAnchorManagement(null)}>
            <PaymentIcon sx={{ mr: 1 }} /> Pagos
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
