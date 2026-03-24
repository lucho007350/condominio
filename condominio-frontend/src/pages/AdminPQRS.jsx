import React, { useEffect, useState } from 'react';
import {
  Box,
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
} from '@mui/icons-material';
import { requestAPI } from '../services/api.jsx';

const colors = {
  primary: '#1e3a5f',
  secondary: '#2a4a7a',
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

const statusConfig = {
  pendiente: { label: 'Pendiente', color: colors.warning, icon: <WarningIcon /> },
  en_proceso: { label: 'En proceso', color: colors.info, icon: <InfoIcon /> },
  resuelto: { label: 'Resuelto', color: colors.success, icon: <CheckCircleIcon /> },
  rechazado: { label: 'Rechazado', color: colors.error, icon: <ErrorIcon /> },
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
        backgroundColor: alpha(cfg.color, 0.12),
        color: cfg.color,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
        fontWeight: 700,
        '& .MuiChip-icon': { color: cfg.color },
      }}
    />
  );
};

const priorityConfig = {
  baja: { label: 'Baja', color: colors.success },
  media: { label: 'Media', color: colors.warning },
  alta: { label: 'Alta', color: colors.error },
};

const getPriorityChip = (priority) => {
  const key = String(priority || 'media').toLowerCase();
  const cfg = priorityConfig[key] || priorityConfig.media;
  return (
    <Chip
      size="small"
      label={cfg.label}
      sx={{
        backgroundColor: alpha(cfg.color, 0.12),
        color: cfg.color,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
        fontWeight: 600,
      }}
    />
  );
};

const normalizeRequest = (r) => ({
  id: r?.id ?? r?.idRequest ?? r?._id ?? r?.uuid,
  tipo: r?.tipo ?? r?.type ?? 'peticion',
  asunto: r?.asunto ?? r?.subject ?? r?.titulo ?? '',
  descripcion: r?.descripcion ?? r?.description ?? r?.detalle ?? '',
  prioridad: r?.prioridad ?? r?.priority ?? 'media',
  estado: r?.estado ?? r?.status ?? 'pendiente',
  fecha: r?.fecha ?? r?.createdAt ?? r?.created_at,
  propietarioId: r?.propietarioId ?? r?.destinatarioId ?? r?.to,
  propietarioNombre: r?.propietarioNombre ?? r?.destinatarioNombre ?? r?.toName ?? '',
  remitenteUsuario: r?.remitenteUsuario ?? r?.createdBy ?? r?.username ?? '',
  remitenteNombre: r?.remitenteNombre ?? r?.createdByName ?? '',
  raw: r,
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
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Error al obtener PQRS';
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
    setEditForm({
      tipo: '',
      asunto: '',
      descripcion: '',
      prioridad: '',
      estado: '',
    });
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setCreateForm({
      tipo: 'peticion',
      asunto: '',
      descripcion: '',
      prioridad: 'media',
      estado: 'pendiente',
    });
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
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al crear la PQRS';
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
      
      setPqrs((prev) =>
        prev.map((p) =>
          p.id === selectedPqrs.id
            ? { ...p, ...payload }
            : p
        )
      );
      
      handleCloseEditDialog();
      setSnackbar({ open: true, message: 'PQRS actualizada correctamente', severity: 'success' });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al actualizar la PQRS';
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
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al eliminar la PQRS';
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

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PqrsIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Gestión de PQRS
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Administra las peticiones, quejas, reclamos y sugerencias de los residentes
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
                fontWeight: 600,
              }}
            >
              Nueva PQRS
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={loadPQRS}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: 2,
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          bgcolor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 48,
            },
            '& .Mui-selected': {
              color: `${colors.primary} !important`,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary,
            },
          }}
        >
          <Tab label={`Todos (${pqrs.length})`} />
          <Tab label={`Pendientes (${pendientesCount})`} />
          <Tab label={`En proceso (${enProcesoCount})`} />
          <Tab label={`Resueltos (${resueltosCount})`} />
        </Tabs>
      </Paper>

      {loading ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
          <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
            Cargando PQRS…
          </Typography>
        </Paper>
      ) : pqrsFiltrados.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
          <InfoIcon sx={{ fontSize: 60, color: colors.text.disabled, mb: 2 }} />
          <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
            No hay PQRS
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.disabled }}>
            No hay PQRS registradas en este momento
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${colors.border}` }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(colors.primary, 0.05) }}>
                <TableCell sx={{ fontWeight: 900 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Remitente</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Asunto</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Prioridad</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 900 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pqrsFiltrados.map((pqrsItem) => (
                <TableRow key={String(pqrsItem.id)} hover>
                  <TableCell>
                    {pqrsItem.fecha ? new Date(pqrsItem.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : '-'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {pqrsItem.remitenteNombre || pqrsItem.remitenteUsuario || '-'}
                        </Typography>
                        {pqrsItem.propietarioNombre && (
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            Para: {pqrsItem.propietarioNombre}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={String(pqrsItem.tipo || '-').charAt(0).toUpperCase() + String(pqrsItem.tipo || '').slice(1)}
                      sx={{
                        bgcolor: alpha(colors.primary, 0.1),
                        color: colors.primary,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography sx={{ fontWeight: 700, color: colors.text.primary }}>
                      {pqrsItem.asunto || '-'}
                    </Typography>
                    {pqrsItem.descripcion ? (
                      <Typography sx={{ color: colors.text.secondary, fontSize: '0.85rem' }}>
                        {String(pqrsItem.descripcion).slice(0, 80)}...
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>{getPriorityChip(pqrsItem.prioridad)}</TableCell>
                  <TableCell>{getStatusChip(pqrsItem.estado)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          sx={{ color: colors.info }}
                          onClick={() => handleViewPqrs(pqrsItem)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          sx={{ color: colors.primary }}
                          onClick={() => handleOpenEdit(pqrsItem)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          sx={{ color: colors.error }}
                          onClick={() => handleOpenDeleteConfirm(pqrsItem)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon />
            <Typography variant="h6">Detalles de PQRS</Typography>
          </Box>
          <IconButton onClick={handleCloseViewDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {selectedPqrs && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Tipo</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {String(selectedPqrs.tipo || '').charAt(0).toUpperCase() + String(selectedPqrs.tipo || '').slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Prioridad</Typography>
                <Box sx={{ mt: 0.5 }}>{getPriorityChip(selectedPqrs.prioridad)}</Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Estado</Typography>
                <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedPqrs.estado)}</Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Fecha</Typography>
                <Typography variant="body1">
                  {selectedPqrs.fecha ? new Date(selectedPqrs.fecha).toLocaleString() : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Remitente</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedPqrs.remitenteNombre || selectedPqrs.remitenteUsuario || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Propietario</Typography>
                <Typography variant="body1">
                  {selectedPqrs.propietarioNombre || selectedPqrs.propietarioId || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Asunto</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedPqrs.asunto || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>Descripción</Typography>
                <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {selectedPqrs.descripcion || '-'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseViewDialog} variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={() => {
              handleCloseViewDialog();
              handleOpenEdit(selectedPqrs);
            }}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon />
            <Typography variant="h6">Editar PQRS</Typography>
          </Box>
          <IconButton onClick={handleCloseEditDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={editForm.tipo}
                  label="Tipo"
                  onChange={handleInputChange}
                >
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
                <Select
                  name="prioridad"
                  value={editForm.prioridad}
                  label="Prioridad"
                  onChange={handleInputChange}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={editForm.estado}
                  label="Estado"
                  onChange={handleInputChange}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_proceso">En proceso</MenuItem>
                  <MenuItem value="resuelto">Resuelto</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asunto"
                name="asunto"
                value={editForm.asunto}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={editForm.descripcion}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEditDialog} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={saving}
            startIcon={<EditIcon />}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            <Typography variant="h6">Nueva PQRS</Typography>
          </Box>
          <IconButton onClick={handleCloseCreateDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={createForm.tipo}
                  label="Tipo"
                  onChange={handleCreateInputChange}
                >
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
                <Select
                  name="prioridad"
                  value={createForm.prioridad}
                  label="Prioridad"
                  onChange={handleCreateInputChange}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={createForm.estado}
                  label="Estado"
                  onChange={handleCreateInputChange}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_proceso">En proceso</MenuItem>
                  <MenuItem value="resuelto">Resuelto</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asunto"
                name="asunto"
                value={createForm.asunto}
                onChange={handleCreateInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={createForm.descripcion}
                onChange={handleCreateInputChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseCreateDialog} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveCreate}
            variant="contained"
            disabled={saving}
            startIcon={<AddIcon />}
          >
            {saving ? 'Creando…' : 'Crear PQRS'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          ¿Eliminar PQRS?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Se eliminará la PQRS "{pqrsToDelete?.asunto}". Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={saving}
          >
            {saving ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ borderRadius: 3, boxShadow: `0 4px 20px ${alpha(colors.primary, 0.2)}` }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPQRS;