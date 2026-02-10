import React from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "@mui/icons-material";

const Navbar = () => {
  const location = useLocation();

  const [anchorAdmin, setAnchorAdmin] = React.useState(null);
  const [anchorGestion, setAnchorGestion] = React.useState(null);

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

        {/* INICIO */}
        <Button
          component={Link}
          to="/"
          color="inherit"
          startIcon={<HomeIcon />}
          sx={{
            mx: 1,
            borderBottom:
              location.pathname === "/" ? "2px solid #ffffff" : "none",
          }}
        >
          Inicio
        </Button>

        {/* COMUNICADOS */}
        <Button
          component={Link}
          to="/comunicacion"
          color="inherit"
          startIcon={<ComunicadoIcon />}
          sx={{
            mx: 1,
            borderBottom:
              location.pathname === "/comunicacion"
                ? "2px solid #ffffff"
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
          sx={{ mx: 1 }}
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
          sx={{ mx: 1 }}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
