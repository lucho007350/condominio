 import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Container,
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
  Tab,
  Tabs,
  Badge,
  Tooltip,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Campaign as GeneralIcon,
  Warning as UrgenteIcon,
  Event as EventoIcon,
  CalendarMonth as FechaIcon,
  Add as AddIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  NotificationsActive as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { communicationAPI } from '../services/api.jsx';

// Colores personalizados
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

// Componentes estilizados
const GlassCard = styled(Card)(() => ({
  background: `linear-gradient(135deg, ${alpha(colors.surface, 0.95)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(colors.border, 0.5)}`,
  borderRadius: 20,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 20px 30px -10px ${alpha(colors.primary, 0.2)}`,
    borderColor: alpha(colors.primary, 0.3),
  },
}));

const GradientButton = styled(Button)(({ bgcolor = colors.primary }) => ({
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.8)} 100%)`,
  color: 'white',
  borderRadius: 12,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: `0 4px 10px ${alpha(bgcolor, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(bgcolor, 0.4)}`,
  },
}));

const mapBackendTipoToUi = (tipo) => {
  switch (tipo) {
    case 'Emergencia':
      return 'Urgente';
    case 'Evento':
      return 'Evento';
    case 'Aviso':
    case 'Reglamento':
    case 'Otro':
    default:
      return 'General';
  }
};

const mapUiTipoToBackend = (tipo) => {
  switch (tipo) {
    case 'Urgente':
      return 'Emergencia';
    case 'Evento':
      return 'Evento';
    case 'General':
    default:
      return 'Aviso';
  }
};

const normalizeComunicado = (c) => ({
  idComunicado: c?.idComunicado ?? c?.id ?? c?.IdComunicado,
  titulo: c?.titulo ?? '',
  contenido: c?.contenido ?? '',
  fechaPublicacion: c?.fechaPublicacion ?? new Date().toISOString(),
  tipo: mapBackendTipoToUi(c?.tipo),
  destinatarios: 'todos',
  autor: 'Administración',
  leido: false,
});

const Comunicacion = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estado para nuevo comunicado / edición
  const [nuevoComunicado, setNuevoComunicado] = useState({
    titulo: '',
    contenido: '',
    tipo: 'General',
    destinatarios: 'todos',
  });
  const [editingComunicado, setEditingComunicado] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [comunicadoToDelete, setComunicadoToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Obtener usuario del storage
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setIsAdmin(userData.role === 'admin');

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const response = await communicationAPI.getAll();
        const rows = Array.isArray(response.data) ? response.data : [];
        const normalized = rows.map(normalizeComunicado);
        normalized.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
        if (!cancelled) setComunicados(normalized);
      } catch (error) {
        const msg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          'Error al obtener comunicados';
        if (!cancelled) {
          setComunicados([]);
          setSnackbar({ open: true, message: msg, severity: 'error' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const tipoConfig = (tipo) => {
    switch (tipo) {
      case 'Urgente':
        return { 
          color: colors.error, 
          icon: <UrgenteIcon />, 
          label: 'Urgente',
          bgColor: alpha(colors.error, 0.1),
        };
      case 'Evento':
        return { 
          color: colors.info, 
          icon: <EventoIcon />, 
          label: 'Evento',
          bgColor: alpha(colors.info, 0.1),
        };
      default:
        return { 
          color: colors.primary, 
          icon: <GeneralIcon />, 
          label: 'General',
          bgColor: alpha(colors.primary, 0.1),
        };
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingComunicado(null);
    setNuevoComunicado({
      titulo: '',
      contenido: '',
      tipo: 'General',
      destinatarios: 'todos',
    });
  };

  const handleOpenEdit = (comunicado) => {
    setEditingComunicado(comunicado);
    setNuevoComunicado({
      titulo: comunicado.titulo,
      contenido: comunicado.contenido,
      tipo: comunicado.tipo,
      destinatarios: comunicado.destinatarios || 'todos',
    });
    setOpenDialog(true);
  };

  const handleOpenDeleteConfirm = (comunicado) => {
    setComunicadoToDelete(comunicado);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setComunicadoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!comunicadoToDelete?.idComunicado) return;
    setSaving(true);
    try {
      await communicationAPI.delete(comunicadoToDelete.idComunicado);
      setComunicados((prev) => prev.filter((c) => c.idComunicado !== comunicadoToDelete.idComunicado));
      handleCloseDeleteConfirm();
      setSnackbar({ open: true, message: 'Comunicado eliminado correctamente', severity: 'success' });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al eliminar el comunicado';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarEdicion = async () => {
    if (!editingComunicado?.idComunicado || !nuevoComunicado.titulo || !nuevoComunicado.contenido) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos', severity: 'error' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        titulo: nuevoComunicado.titulo,
        contenido: nuevoComunicado.contenido,
        fechaPublicacion: editingComunicado.fechaPublicacion || new Date().toISOString(),
        tipo: mapUiTipoToBackend(nuevoComunicado.tipo),
      };
      const response = await communicationAPI.update(editingComunicado.idComunicado, payload);
      const updated = normalizeComunicado(response.data);
      setComunicados((prev) =>
        prev.map((c) => (c.idComunicado === updated.idComunicado ? updated : c))
      );
      handleCloseDialog();
      setSnackbar({ open: true, message: 'Comunicado actualizado correctamente', severity: 'success' });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al actualizar el comunicado';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoComunicado(prev => ({ ...prev, [name]: value }));
  };

  const handleEnviarComunicado = async () => {
    if (!nuevoComunicado.titulo || !nuevoComunicado.contenido) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        titulo: nuevoComunicado.titulo,
        contenido: nuevoComunicado.contenido,
        fechaPublicacion: new Date().toISOString(),
        tipo: mapUiTipoToBackend(nuevoComunicado.tipo),
      };

      const response = await communicationAPI.create(payload);
      const data = response?.data?.data ?? response?.data;
      const nuevo = normalizeComunicado(data);

      setComunicados((prev) => [nuevo, ...prev]);

      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Comunicado enviado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Error al enviar comunicado';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleMarcarLeido = (id) => {
    setComunicados(comunicados.map(c => 
      c.idComunicado === id ? { ...c, leido: true } : c
    ));
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const comunicadosFiltrados = tabValue === 0 
    ? comunicados 
    : comunicados.filter(c => c.tipo === (tabValue === 1 ? 'General' : tabValue === 2 ? 'Evento' : 'Urgente'));

  const noLeidos = comunicados.filter(c => !c.leido).length;

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
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
                <GeneralIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Comunicados del Condominio
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {isAdmin 
                    ? 'Gestiona y envía comunicados a los residentes'
                    : 'Mantente informado sobre las novedades de la comunidad'
                  }
                </Typography>
              </Box>
            </Box>
            
            {isAdmin ? (
              <GradientButton
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                bgcolor={colors.success}
                sx={{ height: 48 }}
              >
                Nuevo Comunicado
              </GradientButton>
            ) : (
              <Badge badgeContent={noLeidos} color="error" max={99}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <NotificationsIcon />
                </Avatar>
              </Badge>
            )}
          </Box>
        </Paper>

        {/* Filtros por tipo */}
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
            <Tab label="Todos" />
            <Tab label="Generales" />
            <Tab label="Eventos" />
            <Tab label="Urgentes" />
          </Tabs>
        </Paper>

        {/* Feed de comunicados */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: 4,
                  textAlign: 'center',
                  bgcolor: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
                  Cargando comunicados…
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                  Obteniendo datos desde la base de datos
                </Typography>
              </Paper>
            </Grid>
          ) : (
            comunicadosFiltrados.map((comunicado, index) => {
              const config = tipoConfig(comunicado.tipo);

              return (
                <Grid item xs={12} md={6} key={comunicado.idComunicado}>
                  <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                    <GlassCard>
                      <CardContent sx={{ p: 3 }}>
                      {/* Header del comunicado */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: config.bgColor,
                            color: config.color,
                            width: 50,
                            height: 50,
                          }}
                        >
                          {config.icon}
                        </Avatar>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                              {comunicado.titulo}
                            </Typography>
                            {!isAdmin && !comunicado.leido && (
                              <Chip
                                icon={<CheckCircleIcon />}
                                label="Nuevo"
                                size="small"
                                sx={{
                                  backgroundColor: alpha(colors.info, 0.1),
                                  color: colors.info,
                                  height: 20,
                                  '& .MuiChip-icon': { fontSize: 14, color: colors.info },
                                }}
                              />
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FechaIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {new Date(comunicado.fechaPublicacion).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PersonIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {comunicado.autor}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Chip
                          label={comunicado.tipo}
                          sx={{
                            backgroundColor: config.bgColor,
                            color: config.color,
                            fontWeight: 600,
                            border: `1px solid ${alpha(config.color, 0.2)}`,
                          }}
                          size="small"
                        />
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Contenido */}
                      <Typography variant="body1" sx={{ color: colors.text.primary, lineHeight: 1.6, mb: 2 }}>
                        {comunicado.contenido}
                      </Typography>

                      {/* Acciones */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        {!isAdmin && !comunicado.leido && (
                          <Button
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleMarcarLeido(comunicado.idComunicado)}
                            sx={{
                              color: colors.info,
                              '&:hover': { backgroundColor: alpha(colors.info, 0.05) },
                            }}
                          >
                            Marcar como leído
                          </Button>
                        )}
                        
                        {isAdmin && (
                          <>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                sx={{ color: colors.info }}
                                onClick={() => handleOpenEdit(comunicado)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                sx={{ color: colors.error }}
                                onClick={() => handleOpenDeleteConfirm(comunicado)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>

                      {/* Indicador de destinatario para admin */}
                      {isAdmin && comunicado.destinatarios === 'personal' && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${colors.border}` }}>
                          <Chip
                            icon={<PersonIcon />}
                            label="Comunicado personal"
                            size="small"
                            sx={{
                              backgroundColor: alpha(colors.primary, 0.05),
                              color: colors.primary,
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </GlassCard>
                </Zoom>
              </Grid>
              );
            })
          )}
        </Grid>

        {/* Mensaje cuando no hay comunicados */}
        {!loading && comunicadosFiltrados.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              bgcolor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <InfoIcon sx={{ fontSize: 60, color: colors.text.disabled, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
              No hay comunicados
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              {isAdmin 
                ? 'Comienza creando un nuevo comunicado usando el botón superior'
                : 'No hay comunicados disponibles en este momento'
              }
            </Typography>
          </Paper>
        )}

        {/* Diálogo para crear comunicado (solo admin) */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: colors.primary,
            color: 'white',
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {editingComunicado ? <EditIcon /> : <AddIcon />}
              <Typography variant="h6">
                {editingComunicado ? 'Editar Comunicado' : 'Nuevo Comunicado'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título del comunicado"
                  name="titulo"
                  value={nuevoComunicado.titulo}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="tipo"
                    value={nuevoComunicado.tipo}
                    label="Tipo"
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Evento">Evento</MenuItem>
                    <MenuItem value="Urgente">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Destinatarios</InputLabel>
                  <Select
                    name="destinatarios"
                    value={nuevoComunicado.destinatarios}
                    label="Destinatarios"
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="todos">Todos los residentes</MenuItem>
                    <MenuItem value="personal">Comunicado personal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenido"
                  name="contenido"
                  value={nuevoComunicado.contenido}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, bgcolor: alpha(colors.primary, 0.02) }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              disabled={saving}
              sx={{
                borderColor: colors.border,
                color: colors.text.primary,
                borderRadius: 2,
                px: 3,
              }}
            >
              Cancelar
            </Button>
            <GradientButton
              startIcon={editingComunicado ? <EditIcon /> : <SendIcon />}
              onClick={editingComunicado ? handleGuardarEdicion : handleEnviarComunicado}
              disabled={saving}
              sx={{ px: 4 }}
            >
              {editingComunicado ? 'Guardar cambios' : 'Publicar'}
            </GradientButton>
          </DialogActions>
        </Dialog>

        {/* Diálogo de confirmación para eliminar */}
        <Dialog
          open={openDeleteConfirm}
          onClose={handleCloseDeleteConfirm}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            ¿Eliminar comunicado?
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Se eliminará "{comunicadoToDelete?.titulo}". Esta acción no se puede deshacer.
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

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(colors.primary, 0.2)}`,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Comunicacion;