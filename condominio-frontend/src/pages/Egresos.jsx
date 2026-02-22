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
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const Egresos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);

  const [egresos, setEgresos] = useState([
    {
      idEgreso: 1,
      fecha: "2026-02-20",
      concepto: "Pago salario conserje",
      monto: 500,
      empleado: "Juan Pérez",
      estado: "Pagado",
    },
  ]);

  const [nuevoEgreso, setNuevoEgreso] = useState({
    fecha: "",
    concepto: "",
    monto: "",
    empleado: "",
    estado: "Pendiente",
  });

  const handleGuardar = () => {
    const nuevo = {
      ...nuevoEgreso,
      idEgreso: egresos.length + 1,
    };

    setEgresos([...egresos, nuevo]);
    setOpen(false);

    setNuevoEgreso({
      fecha: "",
      concepto: "",
      monto: "",
      empleado: "",
      estado: "Pendiente",
    });
  };

  const handleEliminar = (id) => {
    setEgresos(egresos.filter((e) => e.idEgreso !== id));
  };

  const egresosFiltrados = egresos.filter((e) =>
    e.concepto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box p={4}>
      {/* TÍTULO */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Gestión de Egresos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra los gastos del condominio
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "#1e3a5f" }}
          onClick={() => setOpen(true)}
        >
          Nuevo Egreso
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
              <TableCell><strong>Empleado</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {egresosFiltrados.map((egreso) => (
              <TableRow key={egreso.idEgreso}>
                <TableCell>{egreso.fecha}</TableCell>
                <TableCell>{egreso.concepto}</TableCell>
                <TableCell>{egreso.empleado}</TableCell>
                <TableCell>${egreso.monto}</TableCell>
                <TableCell>
                  <Chip
                    label={egreso.estado}
                    color={
                      egreso.estado === "Pagado"
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleEliminar(egreso.idEgreso)}
                  >
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
        <DialogTitle>Nuevo Egreso</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={nuevoEgreso.fecha}
            onChange={(e) =>
              setNuevoEgreso({ ...nuevoEgreso, fecha: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Concepto"
            value={nuevoEgreso.concepto}
            onChange={(e) =>
              setNuevoEgreso({ ...nuevoEgreso, concepto: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Empleado"
            value={nuevoEgreso.empleado}
            onChange={(e) =>
              setNuevoEgreso({ ...nuevoEgreso, empleado: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Monto"
            type="number"
            value={nuevoEgreso.monto}
            onChange={(e) =>
              setNuevoEgreso({ ...nuevoEgreso, monto: e.target.value })
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

export default Egresos;