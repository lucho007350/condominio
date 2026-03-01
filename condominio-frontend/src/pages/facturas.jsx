import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import {
  CheckCircle as PagadaIcon,
  Warning as PendienteIcon,
  Error as VencidaIcon,
  Apartment as UnidadIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { facturasAPI } from '../services/api';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFactura, setEditingFactura] = useState(null);
  const [formValues, setFormValues] = useState({
    fechaEmision: '',
    fechaVencimiento: '',
    monto: '',
    estadoFactura: 'Pendiente',
    idUnidad: '',
  });

  const loadFacturas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await facturasAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.facturas || [];

      const normalizadas = data.map((f) => {
        const estado = f.estadoFactura || f.estado || 'Pendiente';
        return {
          ...f,
          idFactura: f.idFactura || f.id || f.id_factura,
          estadoFactura: estado,
          idUnidad: f.idUnidad || f.unidad || f.unidadId,
          progreso:
            typeof f.progreso === 'number'
              ? f.progreso
              : estado === 'Pagada'
              ? 100
              : 0,
        };
      });

      setFacturas(normalizadas);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('Error al cargar las facturas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const estadoChip = (estado) => {
    if (estado === 'Pagada') {
      return <Chip icon={<PagadaIcon />} label="Pagada" color="success" />;
    }
    if (estado === 'Pendiente') {
      return (
        <Chip icon={<PendienteIcon />} label="Pendiente" color="warning" />
      );
    }
    return <Chip icon={<VencidaIcon />} label="Vencida" color="error" />;
  };

  const handleOpenDialog = (factura = null) => {
    if (factura) {
      setEditingFactura(factura);
      setFormValues({
        fechaEmision: factura.fechaEmision || '',
        fechaVencimiento: factura.fechaVencimiento || '',
        monto: factura.monto ?? '',
        estadoFactura: factura.estadoFactura || 'Pendiente',
        idUnidad: factura.idUnidad || '',
      });
    } else {
      setEditingFactura(null);
      setFormValues({
        fechaEmision: '',
        fechaVencimiento: '',
        monto: '',
        estadoFactura: 'Pendiente',
        idUnidad: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFactura(null);
  };

  const handleFormChange = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      fechaEmision: formValues.fechaEmision,
      fechaVencimiento: formValues.fechaVencimiento,
      monto: Number(formValues.monto),
      estadoFactura: formValues.estadoFactura,
      idUnidad: formValues.idUnidad,
    };

    try {
      setLoading(true);
      setError(null);
      if (editingFactura) {
        const id =
          editingFactura.idFactura ||
          editingFactura.id ||
          editingFactura.id_factura;
        await facturasAPI.update(id, payload);
      } else {
        await facturasAPI.create(payload);
      }
      await loadFacturas();
      handleCloseDialog();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('Error al guardar la factura.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (factura) => {
    // Confirmación simple en el navegador
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      '¿Estás seguro de eliminar esta factura?',
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError(null);
      const id = factura.idFactura || factura.id || factura.id_factura;
      await facturasAPI.delete(id);
      setFacturas((prev) =>
        prev.filter(
          (f) => (f.idFactura || f.id || f.id_factura) !== id,
        ),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('Error al eliminar la factura.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            🧾 Facturación del Condominio
          </Typography>
          <Typography color="text.secondary">
            Control de facturas por unidad habitacional
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: '#1e3a5f' }}
          onClick={() => handleOpenDialog()}
        >
          Nueva factura
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Facturas', value: facturas.length },
          {
            label: 'Pagadas',
            value: facturas.filter(
              (f) => f.estadoFactura === 'Pagada',
            ).length,
          },
          {
            label: 'Pendientes',
            value: facturas.filter(
              (f) => f.estadoFactura === 'Pendiente',
            ).length,
          },
          {
            label: 'Vencidas',
            value: facturas.filter(
              (f) => f.estadoFactura === 'Vencida',
            ).length,
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6">{item.value}</Typography>
              <Typography color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID Factura</b>
              </TableCell>
              <TableCell>
                <b>Unidad</b>
              </TableCell>
              <TableCell>
                <b>Fecha Emisión</b>
              </TableCell>
              <TableCell>
                <b>Fecha Vencimiento</b>
              </TableCell>
              <TableCell>
                <b>Monto</b>
              </TableCell>
              <TableCell>
                <b>Estado</b>
              </TableCell>
              <TableCell>
                <b>Vencimiento</b>
              </TableCell>
              <TableCell>
                <b>Acciones</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {facturas.map((f) => (
              <TableRow
                key={f.idFactura || f.id || f.id_factura}
                hover
              >
                <TableCell>
                  {f.idFactura || f.id || f.id_factura}
                </TableCell>

                <TableCell>
                  <UnidadIcon fontSize="small" sx={{ mr: 1 }} />
                  {f.idUnidad}
                </TableCell>

                <TableCell>
                  <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                  {f.fechaEmision}
                </TableCell>

                <TableCell>{f.fechaVencimiento}</TableCell>

                <TableCell>
                  ${Number(f.monto || 0).toLocaleString()}
                </TableCell>

                <TableCell>{estadoChip(f.estadoFactura)}</TableCell>

                <TableCell sx={{ width: 180 }}>
                  <LinearProgress
                    variant="determinate"
                    value={f.progreso || 0}
                    color={
                      f.estadoFactura === 'Pagada'
                        ? 'success'
                        : f.estadoFactura === 'Pendiente'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDialog(f)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(f)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo crear / editar */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingFactura ? 'Editar factura' : 'Nueva factura'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Fecha de emisión"
              type="date"
              value={formValues.fechaEmision}
              onChange={handleFormChange('fechaEmision')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Fecha de vencimiento"
              type="date"
              value={formValues.fechaVencimiento}
              onChange={handleFormChange('fechaVencimiento')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Monto"
              type="number"
              value={formValues.monto}
              onChange={handleFormChange('monto')}
              fullWidth
            />
            <TextField
              label="Unidad"
              value={formValues.idUnidad}
              onChange={handleFormChange('idUnidad')}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formValues.estadoFactura}
                label="Estado"
                onChange={handleFormChange('estadoFactura')}
              >
                <MenuItem value="Pagada">Pagada</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Vencida">Vencida</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#1e3a5f' }}
          >
            {editingFactura ? 'Guardar cambios' : 'Crear factura'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Facturas;
