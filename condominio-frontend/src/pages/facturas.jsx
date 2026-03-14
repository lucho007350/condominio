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
  CircularProgress,
  Alert,
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
  MenuItem
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
  Receipt as ReceiptIcon
} from '@mui/icons-material';

import { facturasAPI, unidadesAPI } from '../services/api';

const ESTADOS_FACTURA = ['Pendiente', 'Pagada', 'Vencida'];

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [facturaEdit, setFacturaEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fechaEmision: '',
    monto: '',
    fechaVencimiento: '',
    estadoFactura: 'Pendiente',
    idUnidad: ''
  });

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await facturasAPI.getAll();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar las facturas');
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  useEffect(() => {
    const cargarUnidades = async () => {
      try {
        const { data } = await unidadesAPI.getAll();
        setUnidades(Array.isArray(data) ? data : []);
      } catch {
        setUnidades([]);
      }
    };
    cargarUnidades();
  }, []);

  const handleOpenDialog = (factura = null) => {
    if (factura) {
      setFacturaEdit(factura);
      setFormData({
        fechaEmision: (factura.fechaEmision || '').toString().slice(0, 10),
        monto: factura.monto ?? '',
        fechaVencimiento: (factura.fechaVencimiento || '').toString().slice(0, 10),
        estadoFactura: factura.estadoFactura ?? factura.estado ?? 'Pendiente',
        idUnidad: factura.idUnidad ?? ''
      });
    } else {
      setFacturaEdit(null);
      setFormData({
        fechaEmision: '',
        monto: '',
        fechaVencimiento: '',
        estadoFactura: 'Pendiente',
        idUnidad: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFacturaEdit(null);
    setFormData({
      fechaEmision: '',
      monto: '',
      fechaVencimiento: '',
      estadoFactura: 'Pendiente',
      idUnidad: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        fechaEmision: formData.fechaEmision,
        monto: Number(formData.monto),
        fechaVencimiento: formData.fechaVencimiento,
        estadoFactura: formData.estadoFactura,
        idUnidad: Number(formData.idUnidad)
      };
      if (facturaEdit) {
        await facturasAPI.update(facturaEdit.idFactura ?? facturaEdit.id, payload);
      } else {
        await facturasAPI.create(payload);
      }
      handleCloseDialog();
      await cargarFacturas();
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (factura) => {
    if (!window.confirm('¿Está seguro de eliminar esta factura?')) return;
    try {
      await facturasAPI.delete(factura.idFactura ?? factura.id);
      await cargarFacturas();
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar');
    }
  };

  const estadoChip = (estado) => {
    if (estado === 'Pagada')
      return <Chip icon={<PagadaIcon />} label="Pagada" color="success" />;
    if (estado === 'Pendiente')
      return <Chip icon={<PendienteIcon />} label="Pendiente" color="warning" />;
    return <Chip icon={<VencidaIcon />} label="Vencida" color="error" />;
  };

  const getProgreso = (f) => {
    if (f.progreso != null) return f.progreso;
    const estado = f.estadoFactura ?? f.estado;
    if (estado === 'Pagada') return 100;
    if (estado === 'Vencida') return 100;
    return 50;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
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
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#1e3a5f', color: 'white' }}
        >
          Crear factura
        </Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Facturas', value: facturas.length, icon: <ReceiptIcon />, color: '#2196F3' },
          { label: 'Pagadas', value: facturas.filter(f => (f.estadoFactura ?? f.estado) === 'Pagada').length, icon: <PagadaIcon />, color: '#4CAF50' },
          { label: 'Pendientes', value: facturas.filter(f => (f.estadoFactura ?? f.estado) === 'Pendiente').length, icon: <PendienteIcon />, color: '#FF9800' },
          { label: 'Vencidas', value: facturas.filter(f => (f.estadoFactura ?? f.estado) === 'Vencida').length, icon: <VencidaIcon />, color: '#f44336' }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: `${item.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {React.cloneElement(item.icon, { sx: { fontSize: 32, color: item.color } })}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">{item.value}</Typography>
                <Typography color="text.secondary" variant="body2">{item.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID Factura</b></TableCell>
              <TableCell><b>Unidad</b></TableCell>
              <TableCell><b>Fecha Emisión</b></TableCell>
              <TableCell><b>Fecha Vencimiento</b></TableCell>
              <TableCell><b>Monto</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Vencimiento</b></TableCell>
              <TableCell align="center"><b>Acciones</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {facturas.map((f) => (
              <TableRow key={f.idFactura ?? f.id ?? Math.random()} hover>
                <TableCell>{f.idFactura ?? f.id}</TableCell>

                <TableCell>
                  <UnidadIcon fontSize="small" sx={{ mr: 1 }} />
                  {f.numeroUnidad ?? f.idUnidad ?? f.unidad ?? '-'}
                </TableCell>

                <TableCell>
                  <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                  {f.fechaEmision ?? f.fecha_emision ?? '-'}
                </TableCell>

                <TableCell>{f.fechaVencimiento ?? f.fecha_vencimiento ?? '-'}</TableCell>

                <TableCell>
                  ${Number(f.monto ?? 0).toLocaleString()}
                </TableCell>

                <TableCell>{estadoChip(f.estadoFactura ?? f.estado ?? 'Pendiente')}</TableCell>

                <TableCell sx={{ width: 180 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getProgreso(f)}
                    color={
                      (f.estadoFactura ?? f.estado) === 'Pagada'
                        ? 'success'
                        : (f.estadoFactura ?? f.estado) === 'Pendiente'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => handleOpenDialog(f)} title="Editar">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(f)} title="Eliminar">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Crear / Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{facturaEdit ? 'Editar factura' : 'Nueva factura'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha emisión"
                type="date"
                name="fechaEmision"
                value={formData.fechaEmision}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha vencimiento"
                type="date"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 1000 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estadoFactura"
                  value={formData.estadoFactura}
                  label="Estado"
                  onChange={handleInputChange}
                >
                  {ESTADOS_FACTURA.map((est) => (
                    <MenuItem key={est} value={est}>{est}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Unidad</InputLabel>
                <Select
                  name="idUnidad"
                  value={formData.idUnidad}
                  label="Unidad"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="">Seleccione unidad</MenuItem>
                  {unidades.map((u) => (
                    <MenuItem key={u.idUnidad ?? u.id} value={u.idUnidad ?? u.id}>
                      {u.numero ?? u.numeroUnidad ?? `Unidad ${u.idUnidad ?? u.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ backgroundColor: '#1e3a5f' }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Facturas;
