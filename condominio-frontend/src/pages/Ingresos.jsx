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

import { ingresosAPI } from "../services/api";

const Ingresos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingIngreso, setEditingIngreso] = useState(null);
  const [formValues, setFormValues] = useState({
    fecha: "",
    concepto: "",
    monto: "",
    idPago: "",
  });

  const loadIngresos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ingresosAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.ingresos || [];

      const normalizados = data.map((i) => ({
        ...i,
        idIngreso: i.idIngreso || i.id || i.id_ingreso,
        // La tabla de ingresos en BD no tiene columna "estado",
        // así que mostramos todos como "Pagado" por ser ingresos ya recibidos.
        estado: "Pagado",
      }));

      setIngresos(normalizados);
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al cargar los ingresos.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngresos();
  }, []);

  const handleOpen = (ingreso = null) => {
    if (ingreso) {
      setEditingIngreso(ingreso);
      setFormValues({
        fecha: ingreso.fecha || "",
        concepto: ingreso.concepto || "",
        monto: ingreso.monto ?? "",
        idPago: ingreso.idPago ?? "",
      });
    } else {
      setEditingIngreso(null);
      setFormValues({
        fecha: "",
        concepto: "",
        monto: "",
        idPago: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIngreso(null);
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
      idPago: Number(formValues.idPago),
    };

    try {
      setLoading(true);
      setError(null);

      if (editingIngreso) {
        const id =
          editingIngreso.idIngreso ||
          editingIngreso.id ||
          editingIngreso.id_ingreso;
        await ingresosAPI.update(id, payload);
      } else {
        await ingresosAPI.create(payload);
      }

      await loadIngresos();
      handleClose();
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al guardar el ingreso.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (idIngreso) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este ingreso?"
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      setError(null);
      const id = idIngreso;
      await ingresosAPI.delete(id);
      setIngresos((prev) =>
        prev.filter(
          (i) => (i.idIngreso || i.id || i.id_ingreso) !== id
        )
      );
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al eliminar el ingreso.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const ingresosFiltrados = ingresos.filter((i) =>
    (i.concepto || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
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
          onClick={() => handleOpen()}
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
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(ingreso)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleEliminar(ingreso.idIngreso)}
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
          {editingIngreso ? "Editar Ingreso" : "Nuevo Ingreso"}
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
            label="Monto"
            type="number"
            value={formValues.monto}
            onChange={(e) =>
              handleChangeForm("monto")(e)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="ID Pago"
            type="number"
            value={formValues.idPago}
            onChange={(e) =>
              handleChangeForm("idPago")(e)
            }
            helperText="ID del pago asociado (obligatorio)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            {editingIngreso ? "Guardar cambios" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ingresos;