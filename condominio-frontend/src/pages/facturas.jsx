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
  MenuItem,
  Avatar,
  Container,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  CheckCircle as PagadaIcon,
  Warning as PendienteIcon,
  Error as VencidaIcon,
  Apartment as UnidadIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  ReceiptLong as FacturaIcon,
} from '@mui/icons-material';

import { facturasAPI, unidadesAPI } from '../services/api';

const colors = {
  primary: '#0f2a3a',
  secondary: '#1d3e52',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    disabled: '#94a3b8',
  },
  border: '#e2e8f0',
};

const GradientButton = styled(Button)(({ bgcolor = colors.primary }) => ({
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.8)} 100%)`,
  color: 'white',
  borderRadius: 12,
  padding: '8px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: `0 4px 10px ${alpha(bgcolor, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(bgcolor, 0.4)}`,
  },
}));

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
    const handler = () => cargarFacturas();
    window.addEventListener('dashboard:refresh', handler);
    return () => window.removeEventListener('dashboard:refresh', handler);
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
        <CircularProgress sx={{ color: colors.primary }} />
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
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container 
        maxWidth="ml"
      >
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: 'rgba(255,255,255,0.2)',
                }}
              >
                <FacturaIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Facturación del Condominio
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Control de facturas por unidad habitacional
                </Typography>
              </Box>
            </Box>
            <GradientButton
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: colors.success }}
            >
              Crear factura
            </GradientButton>
          </Box>
        </Paper>

        {/* KPIs */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Facturas', value: facturas.length, icon: <ReceiptIcon />, color: '#2196F3' },
            { label: 'Pagadas', value: facturas.filter(f => (f.estadoFactura ?? f.estado) === 'Pagada').length, icon: <PagadaIcon />, color: '#4CAF50' },
            { label: 'Pendientes', value: facturas.filter(f => (f.estadoFactura ?? f.estado) === 'Pendiente').length, icon: <PendienteIcon />, color: '#FF9800' },
            { label: 'Vencidas', value: facturas.filter(f => (f.estadoFactura ?? f.estado) === 'Vencida').length, icon: <VencidaIcon />, color: '#f44336' }
          ].map((item, i) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
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
                  <Typography variant="h5" fontWeight="bold" sx={{ color: colors.text.primary }}>{item.value}</Typography>
                  <Typography color="text.secondary" variant="body2">{item.label}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabla */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.02) }}>
                <TableCell sx={{ fontWeight: 700 }}><b>ID Factura</b></TableCell>
                <TableCell sx={{ fontWeight: 700 }}><b>Unidad</b></TableCell>
                <TableCell sx={{ fontWeight: 700 }}><b>Fecha Emisión</b></TableCell>
                <TableCell sx={{ fontWeight: 700 }}><b>Fecha Vencimiento</b></TableCell>
                <TableCell sx={{ fontWeight: 700 }}><b>Monto</b></TableCell>
                <TableCell sx={{ fontWeight: 700 }}><b>Estado</b></TableCell>
                <TableCell sx={{ fontWeight: 700 }}><b>Vencimiento</b></TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {facturas.map((f) => (
                <TableRow key={f.idFactura ?? f.id ?? Math.random()} hover>
                  <TableCell>{f.idFactura ?? f.id}</TableCell>

                  <TableCell>
                    <UnidadIcon fontSize="small" sx={{ mr: 1, color: colors.text.secondary }} />
                    {f.numeroUnidad ?? f.idUnidad ?? f.unidad ?? '-'}
                  </TableCell>

                  <TableCell>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: colors.text.secondary }} />
                    {f.fechaEmision ?? f.fecha_emision ?? '-'}
                  </TableCell>

                  <TableCell>{f.fechaVencimiento ?? f.fecha_vencimiento ?? '-'}</TableCell>

                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: colors.primary }}>
                      ${Number(f.monto ?? 0).toLocaleString()}
                    </Typography>
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
                      sx={{ borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small" 
                      onClick={() => handleOpenDialog(f)} 
                      title="Editar"
                      sx={{ color: colors.primary, '&:hover': { backgroundColor: alpha(colors.primary, 0.1) } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small" 
                      onClick={() => handleDelete(f)} 
                      title="Eliminar"
                      sx={{ '&:hover': { backgroundColor: alpha(colors.error, 0.1) } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog Crear / Editar */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ 
            backgroundColor: colors.primary, 
            color: 'white', 
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              <Typography variant="h6">
                {facturaEdit ? 'Editar factura' : 'Nueva factura'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha emisión"
                  type="date"
                  name="fechaEmision"
                  value={formData.fechaEmision}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha vencimiento"
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Monto"
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 1000 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estadoFactura"
                    value={formData.estadoFactura}
                    label="Estado"
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  >
                    {ESTADOS_FACTURA.map((est) => (
                      <MenuItem key={est} value={est}>{est}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={12}>
                <FormControl fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    name="idUnidad"
                    value={formData.idUnidad}
                    label="Unidad"
                    onChange={handleInputChange}
                    required
                    sx={{ borderRadius: 2 }}
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
          <DialogActions sx={{ p: 2.5, bgcolor: alpha(colors.background, 0.5) }}>
            <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancelar
            </Button>
            <GradientButton onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </GradientButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Facturas;