import React, { useEffect, useState } from "react";
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
  LinearProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { egresosAPI } from "../services/api";

const Egresos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingEgreso, setEditingEgreso] = useState(null);
  const [formValues, setFormValues] = useState({
    fecha: "",
    concepto: "",
    monto: "",
    idEmpleado: "",
  });

  const loadEgresos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await egresosAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.egresos || [];

      const normalizados = data.map((e) => ({
        ...e,
        idEgreso: e.idEgreso || e.id || e.id_egreso,
        // No hay columna "estado" en BD, mostramos todos como "Pagado"
        estado: "Pagado",
        empleado: e.idEmpleado, // por ahora mostramos idEmpleado como "empleado"
      }));

      setEgresos(normalizados);
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al cargar los egresos.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEgresos();
  }, []);

  const handleOpen = (egreso = null) => {
    if (egreso) {
      setEditingEgreso(egreso);
      setFormValues({
        fecha: egreso.fecha || "",
        concepto: egreso.concepto || "",
        monto: egreso.monto ?? "",
        idEmpleado: egreso.idEmpleado ?? "",
      });
    } else {
      setEditingEgreso(null);
      setFormValues({
        fecha: "",
        concepto: "",
        monto: "",
        idEmpleado: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEgreso(null);
  };

  const handleChangeForm = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleGuardar = async () => {
    const payload = {
      fecha: formValues.fecha || new Date().toISOString().split("T")[0],
      concepto: formValues.concepto,
      monto: Number(formValues.monto),
      idEmpleado: Number(formValues.idEmpleado),
    };

    try {
      setLoading(true);
      setError(null);

      if (editingEgreso) {
        const id =
          editingEgreso.idEgreso ||
          editingEgreso.id ||
          editingEgreso.id_egreso;
        await egresosAPI.update(id, payload);
      } else {
        await egresosAPI.create(payload);
      }

      await loadEgresos();
      handleClose();
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al guardar el egreso.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (idEgreso) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este egreso?"
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      setError(null);
      const id = idEgreso;
      await egresosAPI.delete(id);
      setEgresos((prev) =>
        prev.filter(
          (e) => (e.idEgreso || e.id || e.id_egreso) !== id
        )
      );
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al eliminar el egreso.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const egresosFiltrados = egresos.filter((e) =>
    (e.concepto || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box p={4}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
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
          onClick={() => handleOpen()}
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
                    color="primary"
                    onClick={() => handleOpen(egreso)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingEgreso ? "Editar Egreso" : "Nuevo Egreso"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formValues.fecha}
            onChange={(e) =>
              handleChangeForm("fecha")(e)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Concepto"
            value={formValues.concepto}
            onChange={(e) =>
              handleChangeForm("concepto")(e)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="ID Empleado"
            type="number"
            value={formValues.idEmpleado}
            onChange={(e) =>
              handleChangeForm("idEmpleado")(e)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Monto"
            type="number"
            value={formValues.monto}
            onChange={(e) =>
              handleChangeForm("monto")(e)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            {editingEgreso ? "Guardar cambios" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Egresos;