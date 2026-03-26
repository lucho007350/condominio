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
  InputAdornment,
  Stack,
  ListItemText,
  ListItemIcon,
  Menu,
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
  Close as CloseIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  NotificationsActive as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon,
  MarkEmailRead as ReadIcon,
  Business as BusinessIcon,
  
} from '@mui/icons-material';
import { communicationAPI } from '../services/api.jsx';

const colors = {
  primary: '#0a1c2c',
  secondary: '#0f2a3a',
  accent: '#2c5f6e',
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

const StyledCard = styled(Card)(({ isRead }) => ({
  borderRadius: 20,
  border: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  backgroundColor: isRead ? colors.surface : alpha(colors.secondary, 0.02),
  borderLeft: isRead ? 'none' : `3px solid ${colors.accent}`,
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    backgroundColor: alpha(colors.surface, 0.98),
  },
}));

const NotificationRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 16,
  width: '100%',
});

const NotificationIcon = styled(Box)(({ type }) => {
  const colorsMap = {
    info: { bg: alpha(colors.info, 0.1), color: colors.info },
    warning: { bg: alpha(colors.warning, 0.1), color: colors.warning },
    success: { bg: alpha(colors.success, 0.1), color: colors.success },
    event: { bg: alpha(colors.info, 0.1), color: colors.info },
    default: { bg: alpha(colors.accent, 0.1), color: colors.accent },
  };
  const config = colorsMap[type] || colorsMap.default;
  return {
    width: 48,
    height: 48,
    borderRadius: '16px',
    backgroundColor: config.bg,
    color: config.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
});

const getNotificationType = (comunicado) => {
  if (comunicado.tipo === 'Urgente') return 'warning';
  if (comunicado.tipo === 'Evento') return 'event';
  return 'default';
};

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
  destinatarios: c?.destinatarios ?? 'todos',
  destinatarioEspecifico: c?.destinatarioEspecifico ?? null,
  autor: c?.autor ?? 'Administración',
  leido: false,
});

const Comunicacion = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('residente');
  const [comunicados, setComunicados] = useState([]);
  const [filteredComunicados, setFilteredComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados de filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterRead, setFilterRead] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Obtener usuario del storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setUser(storedUser);
    const role = storedUser?.role === 'admin' || storedUser?.rol === 'administrador' ? 'admin' :
                 storedUser?.role === 'propietario' || storedUser?.rol === 'propietario' ? 'propietario' : 'residente';
    setUserRole(role);
  }, []);

  const loadComunicados = async () => {
    setLoading(true);
    try {
      const response = await communicationAPI.getAll();
      const rows = Array.isArray(response.data) ? response.data : [];
      let normalized = rows.map(normalizeComunicado);
      
      // Filtrar por rol del usuario
      if (userRole === 'admin') {
        // Admin ve todas las notificaciones
      } else if (userRole === 'propietario') {
        normalized = normalized.filter(n => 
          n.destinatarios === 'todos' || 
          n.destinatarios === 'propietarios' ||
          (n.destinatarioEspecifico && String(n.destinatarioEspecifico) === String(user?.idResidente))
        );
      } else {
        normalized = normalized.filter(n => 
          n.destinatarios === 'todos' || 
          n.destinatarios === 'residentes' ||
          (n.destinatarioEspecifico && String(n.destinatarioEspecifico) === String(user?.idResidente))
        );
      }
      
      normalized.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
      setComunicados(normalized);
      setFilteredComunicados(normalized);
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al obtener comunicados';
      setComunicados([]);
      setFilteredComunicados([]);
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComunicados();
  }, [user, userRole]);

  const applyFilters = () => {
    let filtered = [...comunicados];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(n => 
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'todos') {
      filtered = filtered.filter(n => n.tipo === filterType);
    }
    
    if (filterRead !== 'todos') {
      filtered = filtered.filter(n => n.leido === (filterRead === 'leidas'));
    }
    
    if (tabValue !== 0) {
      const tipoFiltro = tabValue === 1 ? 'General' : tabValue === 2 ? 'Evento' : 'Urgente';
      filtered = filtered.filter(n => n.tipo === tipoFiltro);
    }
    
    setFilteredComunicados(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType, filterRead, comunicados, tabValue]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('todos');
    setFilterRead('todos');
    setTabValue(0);
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
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error al eliminar el comunicado';
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
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error al actualizar el comunicado';
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
      setSnackbar({ open: true, message: 'Por favor complete todos los campos', severity: 'error' });
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
      setSnackbar({ open: true, message: 'Comunicado enviado exitosamente', severity: 'success' });
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al enviar comunicado';
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

  const handleMarkAllAsRead = () => {
    setComunicados(prev => prev.map(n => ({ ...n, leido: true })));
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenMenu = (event, comunicado) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(comunicado);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMenuAction = (action) => {
    if (selectedNotification) {
      if (action === 'read') {
        handleMarcarLeido(selectedNotification.idComunicado);
      } else if (action === 'delete') {
        handleOpenDeleteConfirm(selectedNotification);
      } else if (action === 'edit') {
        handleOpenEdit(selectedNotification);
      }
    }
    handleCloseMenu();
  };

  const noLeidos = comunicados.filter(c => !c.leido).length;
  const isAdmin = userRole === 'admin';

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return '-';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const getRoleIcon = () => {
    if (userRole === 'admin') return <AdminIcon sx={{ fontSize: 20 }} />;
    if (userRole === 'propietario') return <BusinessIcon sx={{ fontSize: 20 }} />;
    return <PersonIcon sx={{ fontSize: 20 }} />;
  };

  const getRoleName = () => {
    if (userRole === 'admin') return 'Administrador';
    if (userRole === 'propietario') return 'Propietario';
    return 'Residente';
  };

  return (
    <Box sx={{ backgroundColor: colors.background }}>
     <Container 
      maxWidth="xl"
      sx={{ py: 2 }}
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={getRoleIcon()}
                label={getRoleName()}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              {isAdmin ? (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{
                    bgcolor: colors.secondary,
                    '&:hover': { bgcolor: '#0d2533' },
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Nuevo Comunicado
                </Button>
              ) : (
                <Badge badgeContent={noLeidos} color="error" max={99}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                    <NotificationsIcon />
                  </Avatar>
                </Badge>
              )}
              {!isAdmin && noLeidos > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<ReadIcon />}
                  onClick={handleMarkAllAsRead}
                  sx={{
                    borderColor: alpha('#fff', 0.5),
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.1) },
                    textTransform: 'none',
                  }}
                >
                  Marcar todas
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Barra de búsqueda y filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            bgcolor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Buscar por título o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
              sx={{ flex: 2 }}
            />
            
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                ...(showFilters && { bgcolor: colors.accent, '&:hover': { bgcolor: colors.primary } }),
              }}
            >
              Filtros
              {(filterType !== 'todos' || filterRead !== 'todos') && (
                <Badge
                  badgeContent="•"
                  color="error"
                  sx={{ ml: 1, '& .MuiBadge-badge': { fontSize: 16, top: 0, right: -4 } }}
                />
              )}
            </Button>
            
            {(filterType !== 'todos' || filterRead !== 'todos' || searchTerm || tabValue !== 0) && (
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{ color: colors.text.secondary, textTransform: 'none' }}
              >
                Limpiar filtros
              </Button>
            )}
          </Stack>

          {showFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${colors.border}` }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Tipo"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Evento">Evento</MenuItem>
                    <MenuItem value="Urgente">Urgente</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filterRead}
                    onChange={(e) => setFilterRead(e.target.value)}
                    label="Estado"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="noLeidas">No leídas</MenuItem>
                    <MenuItem value="leidas">Leídas</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Tabs de tipos */}
        <Paper
          elevation={0}
          sx={{
            p: 1,
            mb: 3,
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
                fontSize: '0.9rem',
                minHeight: 44,
                borderRadius: 2,
              },
              '& .Mui-selected': {
                color: `${colors.accent} !important`,
                backgroundColor: alpha(colors.accent, 0.08),
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.accent,
                height: 3,
                borderRadius: 3,
              },
            }}
          >
            <Tab label="Todos" />
            <Tab label="Generales" />
            <Tab label="Eventos" />
            <Tab label="Urgentes" />
          </Tabs>
        </Paper>

        {/* Contador de resultados */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            {filteredComunicados.length} {filteredComunicados.length === 1 ? 'comunicado' : 'comunicados'}
            {filteredComunicados.length !== comunicados.length && ` (${comunicados.length} total)`}
          </Typography>
          {!isAdmin && noLeidos > 0 && (
            <Chip
              icon={<NotificationsIcon />}
              label={`${noLeidos} sin leer`}
              size="small"
              sx={{
                bgcolor: alpha(colors.accent, 0.1),
                color: colors.accent,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Lista de comunicados - Cards horizontales */}
        {loading ? (
          <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text.secondary }}>
              Cargando comunicados...
            </Typography>
          </Paper>
        ) : filteredComunicados.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
            <InfoIcon sx={{ fontSize: 64, color: colors.text.disabled, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
              No hay comunicados
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              {isAdmin 
                ? 'Comienza creando un nuevo comunicado usando el botón superior'
                : 'No hay comunicados disponibles en este momento'
              }
            </Typography>
            {(searchTerm || filterType !== 'todos' || filterRead !== 'todos' || tabValue !== 0) && (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Limpiar filtros
              </Button>
            )}
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Cabecera de columnas */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                px: 3,
                py: 1.5,
                backgroundColor: alpha(colors.primary, 0.04),
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ width: 60, fontWeight: 600, color: colors.text.secondary }}>Icono</Typography>
              <Typography variant="caption" sx={{ flex: 2, fontWeight: 600, color: colors.text.secondary }}>Comunicado</Typography>
              <Typography variant="caption" sx={{ width: 100, fontWeight: 600, color: colors.text.secondary }}>Fecha</Typography>
              <Typography variant="caption" sx={{ width: 100, fontWeight: 600, color: colors.text.secondary }}>Acciones</Typography>
            </Box>

            {filteredComunicados.map((comunicado, index) => {
              const config = getNotificationType(comunicado);
              return (
                <Zoom in timeout={200} style={{ transitionDelay: `${index * 50}ms` }} key={comunicado.idComunicado}>
                  <StyledCard isRead={comunicado.leido}>
                    <CardContent sx={{ p: 2 }}>
                      <NotificationRow>
                        {/* Columna: Icono */}
                        <Box sx={{ width: { xs: 'auto', md: 60 } }}>
                          <NotificationIcon type={config}>
                            {config === 'warning' && <UrgenteIcon sx={{ fontSize: 24 }} />}
                            {config === 'event' && <EventoIcon sx={{ fontSize: 24 }} />}
                            {config !== 'warning' && config !== 'event' && <GeneralIcon sx={{ fontSize: 24 }} />}
                          </NotificationIcon>
                        </Box>

                        {/* Columna: Contenido */}
                        <Box sx={{ flex: 2, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary }}>
                              {comunicado.titulo}
                            </Typography>
                            {!isAdmin && !comunicado.leido && (
                              <Chip
                                label="Nueva"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: alpha(colors.accent, 0.1),
                                  color: colors.accent,
                                }}
                              />
                            )}
                            <Chip
                              label={comunicado.tipo}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: comunicado.tipo === 'Urgente' ? alpha(colors.error, 0.1) : comunicado.tipo === 'Evento' ? alpha(colors.info, 0.1) : alpha(colors.accent, 0.1),
                                color: comunicado.tipo === 'Urgente' ? colors.error : comunicado.tipo === 'Evento' ? colors.info : colors.accent,
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.4 }}>
                            {comunicado.contenido}
                          </Typography>
                        </Box>

                        {/* Columna: Fecha */}
                        <Box sx={{ width: { xs: 'auto', md: 100 }, textAlign: { xs: 'left', md: 'center' } }}>
                          <Typography variant="caption" sx={{ color: colors.text.disabled, whiteSpace: 'nowrap' }}>
                            {formatFecha(comunicado.fechaPublicacion)}
                          </Typography>
                        </Box>

                        {/* Columna: Acciones */}
                        <Box sx={{ width: { xs: 'auto', md: 100 }, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          {!isAdmin && !comunicado.leido && (
                            <Tooltip title="Marcar como leída">
                              <IconButton
                                size="small"
                                onClick={() => handleMarcarLeido(comunicado.idComunicado)}
                                sx={{ color: colors.accent }}
                              >
                                <ReadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {isAdmin && (
                            <>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEdit(comunicado)}
                                  sx={{ color: colors.accent }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDeleteConfirm(comunicado)}
                                  sx={{ color: colors.error }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenMenu(e, comunicado)}
                            sx={{ color: colors.text.secondary }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </NotificationRow>
                    </CardContent>
                  </StyledCard>
                </Zoom>
              );
            })}
          </Box>
        )}

        {/* Menú de opciones */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 180 } }}
        >
          {selectedNotification && !selectedNotification.leido && !isAdmin && (
            <MenuItem onClick={() => handleMenuAction('read')}>
              <ListItemIcon>
                <ReadIcon fontSize="small" sx={{ color: colors.accent }} />
              </ListItemIcon>
              <ListItemText>Marcar como leída</ListItemText>
            </MenuItem>
          )}
          {isAdmin && (
            <MenuItem onClick={() => handleMenuAction('edit')}>
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: colors.accent }} />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
          )}
          {isAdmin && (
            <MenuItem onClick={() => handleMenuAction('delete')}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: colors.error }} />
              </ListItemIcon>
              <ListItemText>Eliminar</ListItemText>
            </MenuItem>
          )}
        </Menu>

        {/* Diálogo para crear/editar comunicado */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{ sx: { borderRadius: 4 } }}
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
                  >
                    <MenuItem value="todos">Todos los residentes</MenuItem>
                    <MenuItem value="propietarios">Solo propietarios</MenuItem>
                    <MenuItem value="residentes">Solo residentes</MenuItem>
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
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={editingComunicado ? <EditIcon /> : <SendIcon />}
              onClick={editingComunicado ? handleGuardarEdicion : handleEnviarComunicado}
              disabled={saving}
              sx={{ bgcolor: colors.accent, '&:hover': { bgcolor: colors.primary } }}
            >
              {editingComunicado ? 'Guardar cambios' : 'Publicar'}
            </Button>
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
          <DialogTitle sx={{ fontWeight: 600 }}>¿Eliminar comunicado?</DialogTitle>
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

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Comunicacion;