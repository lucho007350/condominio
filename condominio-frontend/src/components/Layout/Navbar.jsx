import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
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
  Login as LoginIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { isAuthenticated, logout } from "../../services/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorAdmin, setAnchorAdmin] = React.useState(null);
  const [anchorGestion, setAnchorGestion] = React.useState(null);

  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#4caf50" }}>
      <Toolbar>
        {/* LOGO / TITULO */}
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

        {/* INICIO */}
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          sx={{
            borderBottom:
              location.pathname === "/" ? "2px solid white" : "none",
          }}
        >
          Inicio
        </Button>

        {/* COMUNICADOS */}
        <Button
          color="inherit"
          component={Link}
          to="/comunicacion"
          startIcon={<ComunicadoIcon />}
          sx={{
            borderBottom:
              location.pathname === "/comunicacion"
                ? "2px solid white"
                : "none",
          }}
        >
          Comunicados
        </Button>

        {/* ADMINISTRACIÓN */}
        <Button
          color="inherit"
          startIcon={<PeopleIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={(e) => setAnchorAdmin(e.currentTarget)}
        >
          Administración
        </Button>

        <Menu
          anchorEl={anchorAdmin}
          open={Boolean(anchorAdmin)}
          onClose={() => setAnchorAdmin(null)}
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
        >
          Gestión
        </Button>

        <Menu
          anchorEl={anchorGestion}
          open={Boolean(anchorGestion)}
          onClose={() => setAnchorGestion(null)}
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

        {/* LOGIN / LOGOUT */}
        {!authenticated ? (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        ) : (
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ ml: 2 }}
          >
            Salir
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
