import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const Ingresos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);

  const [ingresos, setIngresos] = useState([
    {
      idIngreso: 1,
      fecha: "2026-02-20",
      concepto: "Pago mantenimiento",
      monto: 150,
      estado: "Pagado",
    },
  ]);

  const [nuevoIngreso, setNuevoIngreso] = useState({
    fecha: "",
    concepto: "",
    monto: "",
    estado: "Pendiente",
  });

  const handleGuardar = () => {
    const nuevo = {
      ...nuevoIngreso,
      idIngreso: ingresos.length + 1,
    };

    setIngresos([...ingresos, nuevo]);
    setOpen(false);
    setNuevoIngreso({
      fecha: "",
      concepto: "",
      monto: "",
      estado: "Pendiente",
    });
  };

  const handleEliminar = (id) => {
    setIngresos(ingresos.filter((i) => i.idIngreso !== id));
  };

  const ingresosFiltrados = ingresos.filter((i) =>
    i.concepto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box p={4}>
      {/* TÍTULO */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Gestión de Ingresos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra los ingresos del condominio
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "#1e3a5f" }}
          onClick={() => setOpen(true)}
        >
          Nuevo Ingreso
        </Button>
      </Box>

      {/* BUSCADOR */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por concepto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Concepto</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ingresosFiltrados.map((ingreso) => (
              <TableRow key={ingreso.idIngreso}>
                <TableCell>{ingreso.fecha}</TableCell>
                <TableCell>{ingreso.concepto}</TableCell>
                <TableCell>${ingreso.monto}</TableCell>
                <TableCell>
                  <Chip
                    label={ingreso.estado}
                    color={
                      ingreso.estado === "Pagado"
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleEliminar(ingreso.idIngreso)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo Ingreso</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={nuevoIngreso.fecha}
            onChange={(e) =>
              setNuevoIngreso({ ...nuevoIngreso, fecha: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Concepto"
            value={nuevoIngreso.concepto}
            onChange={(e) =>
              setNuevoIngreso({ ...nuevoIngreso, concepto: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Monto"
            type="number"
            value={nuevoIngreso.monto}
            onChange={(e) =>
              setNuevoIngreso({ ...nuevoIngreso, monto: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ingresos;