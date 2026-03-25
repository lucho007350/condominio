import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Avatar,
  Fade,
  Zoom,
  Stack,
} from '@mui/material';
import {
  MarkEmailUnread as PqrsIcon,
  Add as AddIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Reply as ReplyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { requestAPI } from '../services/api.jsx';

const navbarColors = {
  primary: '#0a1c2c',
  secondary: '#0f2a3a',
  accent: '#2c5f6e',
};

const colors = {
  primary: navbarColors.primary,
  secondary: navbarColors.secondary,
  accent: navbarColors.accent,
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
  border: '#e2e8f0',
};

// Animaciones
const fadeInUp = {
  animation: 'fadeInUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const StyledCard = styled(Card)({
  borderRadius: 28,
  border: 'none',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
});

const StatCard = styled(Paper)(({ color }) => ({
  borderRadius: 20,
  padding: '20px 16px',
  background: `linear-gradient(135deg, ${alpha(color, 0.03)} 0%, ${alpha(color, 0.08)} 100%)`,
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${alpha(color, 0.15)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.12)} 100%)`,
    boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
  },
}));

const statusConfig = {
  pendiente: { label: 'Pendiente', color: colors.warning, icon: <WarningIcon />, bg: alpha(colors.warning, 0.1) },
  en_proceso: { label: 'En proceso', color: colors.info, icon: <InfoIcon />, bg: alpha(colors.info, 0.1) },
  resuelto: { label: 'Resuelto', color: colors.success, icon: <CheckCircleIcon />, bg: alpha(colors.success, 0.1) },
  rechazado: { label: 'Rechazado', color: colors.error, icon: <ErrorIcon />, bg: alpha(colors.error, 0.1) },
};

const getStatusChip = (status) => {
  const key = String(status || 'pendiente').toLowerCase();
  const cfg = statusConfig[key] || statusConfig.pendiente;
  return (
    <Chip
      size="small"
      icon={cfg.icon}
      label={cfg.label}
      sx={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
        fontWeight: 600,
        borderRadius: 2,
        '& .MuiChip-icon': { color: cfg.color, fontSize: 16 },
      }}
    />
  );
};

const priorityConfig = {
  baja: { label: 'Baja', color: colors.success, bg: alpha(colors.success, 0.1) },
  media: { label: 'Media', color: colors.warning, bg: alpha(colors.warning, 0.1) },
  alta: { label: 'Alta', color: colors.error, bg: alpha(colors.error, 0.1) },
};

const getPriorityChip = (priority) => {
  const key = String(priority || 'media').toLowerCase();
  const cfg = priorityConfig[key] || priorityConfig.media;
  return (
    <Chip
      size="small"
      label={cfg.label}
      sx={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
        fontWeight: 600,
        borderRadius: 2,
      }}
    />
  );
};

const normalizeRequest = (r) => ({
  id: r?.id ?? r?.idRequest ?? r?._id ?? r?.id,
  tipo: r?.tipo ?? 'peticion',
  asunto: r?.asunto ?? '',
  descripcion: r?.descripcion ?? '',
  prioridad: r?.prioridad ?? 'media',
  estado: r?.estado ?? 'pendiente',
  fecha: r?.fecha ?? new Date().toISOString(),
  respuesta: r?.respuesta ?? '',
  fechaRespuesta: r?.fechaRespuesta ?? null,
  propietarioId: r?.propietarioId ?? null,
  propietarioNombre: r?.propietarioNombre ?? '',
  remitenteUsuario: r?.remitenteUsuario ?? '',
  remitenteNombre: r?.remitenteNombre ?? '',
});

const AdminPQRS = () => {
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [selectedPqrs, setSelectedPqrs] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [pqrsToDelete, setPqrsToDelete] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openRespondDialog, setOpenRespondDialog] = useState(false);
  const [respuestaForm, setRespuestaForm] = useState({ respuesta: '', nuevoEstado: 'resuelto' });

  const [createForm, setCreateForm] = useState({
    tipo: 'peticion',
    asunto: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'pendiente',
  });

  const [editForm, setEditForm] = useState({
    tipo: '',
    asunto: '',
    descripcion: '',
    prioridad: '',
    estado: '',
  });

  const [saving, setSaving] = useState(false);

  const loadPQRS = async () => {
    setLoading(true);
    try {
      const response = await requestAPI.getAll();
      const rows = Array.isArray(response.data) ? response.data : [];
      const normalized = rows.map(normalizeRequest);
      normalized.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setPqrs(normalized);
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al obtener PQRS';
      setPqrs([]);
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPQRS();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewPqrs = (pqrsItem) => {
    setSelectedPqrs(pqrsItem);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedPqrs(null);
  };

  const handleOpenRespond = (pqrsItem) => {
    setSelectedPqrs(pqrsItem);
    setRespuestaForm({
      respuesta: pqrsItem.respuesta || '',
      nuevoEstado: pqrsItem.estado === 'resuelto' ? 'resuelto' : 'resuelto',
    });
    setOpenRespondDialog(true);
  };

  const handleCloseRespondDialog = () => {
    setOpenRespondDialog(false);
    setRespuestaForm({ respuesta: '', nuevoEstado: 'resuelto' });
  };

  const handleSendResponse = async () => {
    if (!selectedPqrs?.id || !respuestaForm.respuesta.trim()) {
      setSnackbar({ open: true, message: 'Por favor ingrese una respuesta', severity: 'error' });
      return;
  }

  setSaving(true);
  try {
    // Enviar solo respuesta y estado, SIN fechaRespuesta
    const payload = {
      respuesta: respuestaForm.respuesta,
      estado: respuestaForm.nuevoEstado,
    };

    console.log('Enviando payload:', payload);

    await requestAPI.update(selectedPqrs.id, payload);
    
    setPqrs((prev) =>
      prev.map((p) =>
        p.id === selectedPqrs.id
          ? { 
              ...p, 
              respuesta: respuestaForm.respuesta,
              estado: respuestaForm.nuevoEstado,
              fechaRespuesta: new Date().toISOString() // Solo para mostrar en frontend
            }
          : p
      )
    );
    
    handleCloseRespondDialog();
    setSnackbar({ open: true, message: 'Respuesta enviada correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error:', error);
      const msg = error?.response?.data?.message || error?.message || 'Error al enviar la respuesta';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (pqrsItem) => {
    setSelectedPqrs(pqrsItem);
    setEditForm({
      tipo: pqrsItem.tipo || 'peticion',
      asunto: pqrsItem.asunto || '',
      descripcion: pqrsItem.descripcion || '',
      prioridad: pqrsItem.prioridad || 'media',
      estado: pqrsItem.estado || 'pendiente',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedPqrs(null);
    setEditForm({ tipo: '', asunto: '', descripcion: '', prioridad: '', estado: '' });
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setCreateForm({ tipo: 'peticion', asunto: '', descripcion: '', prioridad: 'media', estado: 'pendiente' });
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCreate = async () => {
    if (!createForm.asunto || !createForm.descripcion) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tipo: createForm.tipo,
        asunto: createForm.asunto,
        descripcion: createForm.descripcion,
        prioridad: createForm.prioridad,
        estado: createForm.estado,
        fecha: new Date().toISOString(),
        remitenteUsuario: 'admin',
        remitenteNombre: 'Administración',
      };

      const response = await requestAPI.create(payload);
      const created = normalizeRequest(response.data);
      setPqrs((prev) => [created, ...prev]);
      handleCloseCreateDialog();
      setSnackbar({ open: true, message: 'PQRS creada correctamente', severity: 'success' });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error al crear la PQRS';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedPqrs?.id || !editForm.asunto || !editForm.descripcion) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tipo: editForm.tipo,
        asunto: editForm.asunto,
        descripcion: editForm.descripcion,
        prioridad: editForm.prioridad,
        estado: editForm.estado,
      };

      await requestAPI.update(selectedPqrs.id, payload);
      setPqrs((prev) => prev.map((p) => (p.id === selectedPqrs.id ? { ...p, ...payload } : p)));
      handleCloseEditDialog();
      setSnackbar({ open: true, message: 'PQRS actualizada correctamente', severity: 'success' });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error al actualizar la PQRS';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteConfirm = (pqrsItem) => {
    setPqrsToDelete(pqrsItem);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setPqrsToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pqrsToDelete?.id) return;
    setSaving(true);
    try {
      await requestAPI.delete(pqrsToDelete.id);
      setPqrs((prev) => prev.filter((p) => p.id !== pqrsToDelete.id));
      handleCloseDeleteConfirm();
      setSnackbar({ open: true, message: 'PQRS eliminada correctamente', severity: 'success' });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error al eliminar la PQRS';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const pqrsFiltrados = tabValue === 0
    ? pqrs
    : tabValue === 1
      ? pqrs.filter(p => p.estado === 'pendiente')
      : tabValue === 2
        ? pqrs.filter(p => p.estado === 'en_proceso')
        : pqrs.filter(p => p.estado === 'resuelto' || p.estado === 'rechazado');

  const pendientesCount = pqrs.filter(p => p.estado === 'pendiente').length;
  const enProcesoCount = pqrs.filter(p => p.estado === 'en_proceso').length;
  const resueltosCount = pqrs.filter(p => p.estado === 'resuelto' || p.estado === 'rechazado').length;

  const statsCards = [
    { label: 'Total', value: pqrs.length, color: colors.accent, icon: <PqrsIcon /> },
    { label: 'Pendientes', value: pendientesCount, color: colors.warning, icon: <WarningIcon /> },
    { label: 'En proceso', value: enProcesoCount, color: colors.info, icon: <InfoIcon /> },
    { label: 'Resueltos', value: resueltosCount, color: colors.success, icon: <CheckCircleIcon /> },
  ];

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', pt: 0 }}>
      <Container 
        maxWidth={false}
        sx={{
          py: 2,
          px: { md: 7 },
          ml: { md: '40px' },
        }}
      >
        {/* Header */}
        <Box sx={{ ...fadeInUp, mb: 3 }}>
          <StyledCard>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                p: { xs: 3, sm: 4 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: alpha('#fff', 0.2), color: 'white' }}>
                      <PqrsIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                        Gestión de PQRS
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                        Administra las peticiones, quejas, reclamos y sugerencias
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenCreateDialog}
                      sx={{
                        bgcolor: colors.success,
                        color: 'white',
                        '&:hover': { bgcolor: '#0d9668' },
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Nueva PQRS
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={loadPQRS}
                      sx={{
                        borderColor: alpha('#fff', 0.5),
                        color: 'white',
                        '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.1) },
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Actualizar
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </StyledCard>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ ...fadeInUp, mb: 4 }}>
          <Grid container spacing={2.5}>
            {statsCards.map((stat, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Zoom in timeout={300} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <StatCard color={stat.color}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(stat.color, 0.1), color: stat.color, mb: 1.5 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '2rem', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500, textTransform: 'uppercase' }}>
                      {stat.label}
                    </Typography>
                  </StatCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs */}
        <Paper elevation={0} sx={{ p: 1, mb: 3, borderRadius: 3, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 44, borderRadius: 2 },
              '& .Mui-selected': { color: `${colors.accent} !important`, backgroundColor: alpha(colors.accent, 0.08) },
              '& .MuiTabs-indicator': { backgroundColor: colors.accent, height: 3, borderRadius: 3 },
            }}
          >
            <Tab label={`Todos (${pqrs.length})`} />
            <Tab label={`Pendientes (${pendientesCount})`} />
            <Tab label={`En proceso (${enProcesoCount})`} />
            <Tab label={`Resueltos (${resueltosCount})`} />
          </Tabs>
        </Paper>

        {/* Tabla */}
        {loading ? (
          <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
            <Typography>Cargando PQRS...</Typography>
          </Paper>
        ) : pqrsFiltrados.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
            <InfoIcon sx={{ fontSize: 64, color: colors.text.disabled, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No hay PQRS</Typography>
          </Paper>
        ) : (
          <StyledCard>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(colors.primary, 0.04) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Remitente</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Asunto</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Prioridad</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pqrsFiltrados.map((pqrsItem) => (
                    <TableRow key={pqrsItem.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {pqrsItem.fecha ? new Date(pqrsItem.fecha).toLocaleDateString('es-ES') : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(colors.accent, 0.1) }}>
                            <PersonIcon sx={{ fontSize: 14, color: colors.accent }} />
                          </Avatar>
                          <Typography variant="body2">{pqrsItem.remitenteNombre || pqrsItem.remitenteUsuario || '-'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={pqrsItem.tipo} sx={{ bgcolor: alpha(colors.accent, 0.1), color: colors.accent }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{pqrsItem.asunto || '-'}</Typography>
                      </TableCell>
                      <TableCell>{getPriorityChip(pqrsItem.prioridad)}</TableCell>
                      <TableCell>{getStatusChip(pqrsItem.estado)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Ver detalles">
                            <IconButton size="small" onClick={() => handleViewPqrs(pqrsItem)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Responder">
                            <IconButton size="small" sx={{ color: colors.success }} onClick={() => handleOpenRespond(pqrsItem)}>
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" sx={{ color: colors.accent }} onClick={() => handleOpenEdit(pqrsItem)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" sx={{ color: colors.error }} onClick={() => handleOpenDeleteConfirm(pqrsItem)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </StyledCard>
        )}

        {/* Diálogo Ver Detalles con Respuesta */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon />
              <Typography variant="h6">Detalles de PQRS</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedPqrs && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Tipo</Typography>
                  <Typography variant="body1">{selectedPqrs.tipo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Prioridad</Typography>
                  <Box>{getPriorityChip(selectedPqrs.prioridad)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Estado</Typography>
                  <Box>{getStatusChip(selectedPqrs.estado)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Fecha</Typography>
                  <Typography variant="body1">{new Date(selectedPqrs.fecha).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Remitente</Typography>
                  <Typography variant="body1">{selectedPqrs.remitenteNombre || selectedPqrs.remitenteUsuario || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Asunto</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedPqrs.asunto}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Descripción</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: alpha(colors.background, 0.5), borderRadius: 2 }}>
                    <Typography variant="body2">{selectedPqrs.descripcion}</Typography>
                  </Paper>
                </Grid>
                {selectedPqrs.respuesta && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" sx={{ color: colors.success }}>Respuesta del administrador</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: alpha(colors.success, 0.05), borderRadius: 2, borderColor: alpha(colors.success, 0.3) }}>
                      <Typography variant="body2">{selectedPqrs.respuesta}</Typography>
                      {selectedPqrs.fechaRespuesta && (
                        <Typography variant="caption" sx={{ color: colors.text.disabled, mt: 1, display: 'block' }}>
                          Respondido el: {new Date(selectedPqrs.fechaRespuesta).toLocaleString()}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseViewDialog} variant="outlined">Cerrar</Button>
            {selectedPqrs?.estado !== 'resuelto' && (
              <Button onClick={() => { handleCloseViewDialog(); handleOpenRespond(selectedPqrs); }} variant="contained" startIcon={<ReplyIcon />} sx={{ bgcolor: colors.accent }}>
                Responder
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Diálogo Responder */}
        <Dialog open={openRespondDialog} onClose={handleCloseRespondDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReplyIcon />
              <Typography variant="h6">Responder PQRS</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: colors.text.secondary }}>
              Asunto: <strong>{selectedPqrs?.asunto}</strong>
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2, color: colors.text.secondary }}>
              Remitente: <strong>{selectedPqrs?.remitenteNombre || selectedPqrs?.remitenteUsuario}</strong>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Respuesta"
              value={respuestaForm.respuesta}
              onChange={(e) => setRespuestaForm({ ...respuestaForm, respuesta: e.target.value })}
              placeholder="Escriba aquí su respuesta..."
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth>
              <InputLabel>Cambiar estado</InputLabel>
              <Select
                value={respuestaForm.nuevoEstado}
                onChange={(e) => setRespuestaForm({ ...respuestaForm, nuevoEstado: e.target.value })}
                label="Cambiar estado"
              >
                <MenuItem value="resuelto">Resuelto</MenuItem>
                <MenuItem value="en_proceso">En proceso</MenuItem>
                <MenuItem value="rechazado">Rechazado</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseRespondDialog} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSendResponse} variant="contained" disabled={saving} startIcon={<SendIcon />} sx={{ bgcolor: colors.accent }}>
              {saving ? 'Enviando...' : 'Enviar Respuesta'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo Editar */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon />
              <Typography variant="h6">Editar PQRS</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select name="tipo" value={editForm.tipo} label="Tipo" onChange={handleInputChange}>
                    <MenuItem value="peticion">Petición</MenuItem>
                    <MenuItem value="queja">Queja</MenuItem>
                    <MenuItem value="reclamo">Reclamo</MenuItem>
                    <MenuItem value="sugerencia">Sugerencia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Prioridad</InputLabel>
                  <Select name="prioridad" value={editForm.prioridad} label="Prioridad" onChange={handleInputChange}>
                    <MenuItem value="baja">Baja</MenuItem>
                    <MenuItem value="media">Media</MenuItem>
                    <MenuItem value="alta">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select name="estado" value={editForm.estado} label="Estado" onChange={handleInputChange}>
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="en_proceso">En proceso</MenuItem>
                    <MenuItem value="resuelto">Resuelto</MenuItem>
                    <MenuItem value="rechazado">Rechazado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Asunto" name="asunto" value={editForm.asunto} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Descripción" name="descripcion" value={editForm.descripcion} onChange={handleInputChange} multiline rows={4} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseEditDialog} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSaveEdit} variant="contained" disabled={saving} startIcon={<EditIcon />} sx={{ bgcolor: colors.accent }}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo Crear */}
        <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon />
              <Typography variant="h6">Nueva PQRS</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select name="tipo" value={createForm.tipo} label="Tipo" onChange={handleCreateInputChange}>
                    <MenuItem value="peticion">Petición</MenuItem>
                    <MenuItem value="queja">Queja</MenuItem>
                    <MenuItem value="reclamo">Reclamo</MenuItem>
                    <MenuItem value="sugerencia">Sugerencia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Prioridad</InputLabel>
                  <Select name="prioridad" value={createForm.prioridad} label="Prioridad" onChange={handleCreateInputChange}>
                    <MenuItem value="baja">Baja</MenuItem>
                    <MenuItem value="media">Media</MenuItem>
                    <MenuItem value="alta">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select name="estado" value={createForm.estado} label="Estado" onChange={handleCreateInputChange}>
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="en_proceso">En proceso</MenuItem>
                    <MenuItem value="resuelto">Resuelto</MenuItem>
                    <MenuItem value="rechazado">Rechazado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Asunto" name="asunto" value={createForm.asunto} onChange={handleCreateInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Descripción" name="descripcion" value={createForm.descripcion} onChange={handleCreateInputChange} multiline rows={4} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseCreateDialog} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSaveCreate} variant="contained" disabled={saving} startIcon={<AddIcon />} sx={{ bgcolor: colors.accent }}>
              {saving ? 'Creando...' : 'Crear PQRS'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo Confirmar Eliminación */}
        <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle>¿Eliminar PQRS?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Se eliminará la PQRS "{pqrsToDelete?.asunto}". Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm} disabled={saving}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={saving}>
              {saving ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminPQRS;