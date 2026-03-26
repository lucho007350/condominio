import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Card,
  CardContent,
  Avatar,
  Zoom,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import {
  MarkEmailUnread as PqrsIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Reply as ReplyIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { requestAPI, residentAPI } from '../services/api.jsx';

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

// Configuración de estados
const statusConfig = {
  pendiente: { label: 'Pendiente', color: colors.warning, icon: <WarningIcon />, bg: alpha(colors.warning, 0.1) },
  'en proceso': { label: 'En proceso', color: colors.info, icon: <InfoIcon />, bg: alpha(colors.info, 0.1) },
  en_proceso: { label: 'En proceso', color: colors.info, icon: <InfoIcon />, bg: alpha(colors.info, 0.1) },
  terminado: { label: 'Terminado', color: colors.success, icon: <CheckCircleIcon />, bg: alpha(colors.success, 0.1) },
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

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const normalizeRequest = (r) => ({
  id: r?.id ?? r?.idRequest ?? r?._id ?? r?.uuid,
  tipo: r?.tipo ?? r?.type ?? 'peticion',
  asunto: r?.asunto ?? r?.subject ?? r?.titulo ?? '',
  descripcion: r?.descripcion ?? r?.description ?? r?.detalle ?? '',
  prioridad: r?.prioridad ?? r?.priority ?? 'media',
  estado: String(r?.estado ?? r?.status ?? 'pendiente').toLowerCase(),
  fecha: r?.fecha ?? r?.createdAt ?? r?.created_at,
  respuesta: r?.respuesta ?? '',
  propietarioId: r?.propietarioId,
  propietarioNombre: r?.propietarioNombre ?? '',
  remitenteUsuario: r?.remitenteUsuario ?? '',
  remitenteNombre: r?.remitenteNombre ?? '',
});

const PropietarioPQRS = () => {
  const user = useMemo(() => safeParseUser(), []);
  const role = String(user?.role || '').toLowerCase();
  const isPropietario = role === 'propietario' || role === 'owner';

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Estado para el diálogo de respuesta
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('pendiente');
  const [replying, setReplying] = useState(false);
  
  // Estado para ver detalles
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);

  // Estado para enviar PQRS al admin
  const [form, setForm] = useState({
    tipo: 'peticion',
    asunto: '',
    descripcion: '',
    prioridad: 'media',
  });

  const [recibidas, setRecibidas] = useState([]);
  const [enviadas, setEnviadas] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await requestAPI.getAll();
      const all = toArray(res?.data);
      
      const propietarioIdActual = user?.idResidente || user?.id;
      const propietarioNombreActual = user?.nombre || user?.name || '';
      
      const recibidasData = all
        .map(normalizeRequest)
        .filter((r) => {
          // Solo PQRS donde el destinatario es un propietario
          const esParaPropietario = r.propietarioId !== null && r.propietarioId !== undefined;
          const esParaMi = String(r.propietarioId) === String(propietarioIdActual);
          const esPorNombre = r.propietarioNombre && 
                              propietarioNombreActual && 
                              r.propietarioNombre.toLowerCase().includes(propietarioNombreActual.toLowerCase());
          
          return esParaPropietario && (esParaMi || esPorNombre);
        });
      
      const enviadasData = all
        .map(normalizeRequest)
        .filter((r) => {
          const remitente = r.remitenteUsuario || '';
          const userIdentifier = user?.username || user?.email || user?.id || user?.idResidente;
          return remitente === userIdentifier && 
                 (r.propietarioId === null || r.propietarioNombre === 'Administrador del Condominio');
        });
      
      recibidasData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      enviadasData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      setRecibidas(recibidasData);
      setEnviadas(enviadasData);
    } catch (err) {
      console.error('Error al cargar PQRS:', err);
      setError('No se pudieron cargar las PQRS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPropietario) {
      loadData();
    }
  }, []);

  const handleChange = (field) => (e) => {
    const value = e?.target?.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.asunto.trim()) return 'El asunto es obligatorio.';
    if (!form.descripcion.trim()) return 'La descripción es obligatoria.';
    return '';
  };

  const resetForm = () => {
    setForm({
      tipo: 'peticion',
      asunto: '',
      descripcion: '',
      prioridad: 'media',
    });
  };

  const handleSubmitToAdmin = async () => {
    setError('');
    setInfo('');
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSending(true);
    
    const ahora = new Date();
    const fechaFormateada = ahora.getFullYear() + '-' + 
                           String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(ahora.getDate()).padStart(2, '0') + ' ' +
                           String(ahora.getHours()).padStart(2, '0') + ':' +
                           String(ahora.getMinutes()).padStart(2, '0') + ':' +
                           String(ahora.getSeconds()).padStart(2, '0');
    
    const payload = {
      tipo: form.tipo,
      asunto: form.asunto.trim(),
      descripcion: form.descripcion.trim(),
      prioridad: form.prioridad,
      estado: 'pendiente',
      fecha: fechaFormateada,
      propietarioId: null,
      propietarioNombre: 'Administrador del Condominio',
      remitenteUsuario: user?.username || user?.email || user?.id || user?.idResidente,
      remitenteNombre: user?.name || user?.nombre || 'Propietario',
    };

    try {
      const res = await requestAPI.create(payload);
      const created = normalizeRequest(res?.data);
      setEnviadas((prev) => [created, ...prev]);
      resetForm();
      setTab(1);
      setInfo('PQRS enviada al Administrador correctamente.');
    } catch (err) {
      console.error('Error al enviar PQRS:', err);
      setError('No se pudo enviar la PQRS. Intente nuevamente.');
    } finally {
      setSending(false);
    }
  };

  const handleOpenReply = (request) => {
    setSelectedRequest(request);
    setReplyText(request.respuesta || '');
    setSelectedEstado(request.estado || 'pendiente');
    setOpenReplyDialog(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      setError('La respuesta no puede estar vacía');
      return;
    }

    setReplying(true);
    setError('');
    
    try {
      const requestId = selectedRequest?.id;
      if (!requestId) {
        throw new Error('No se encontró el ID de la PQRS');
      }

      // Construir el objeto de actualización SOLO con los campos que existen en la BD
      const updateData = {
        tipo: selectedRequest.tipo,
        asunto: selectedRequest.asunto,
        descripcion: selectedRequest.descripcion,
        prioridad: selectedRequest.prioridad,
        estado: selectedEstado,
        respuesta: replyText.trim(),
        fecha: selectedRequest.fecha,
        propietarioId: selectedRequest.propietarioId,
        propietarioNombre: selectedRequest.propietarioNombre,
        remitenteUsuario: selectedRequest.remitenteUsuario,
        remitenteNombre: selectedRequest.remitenteNombre,
      };

      console.log('Enviando actualización para ID:', requestId);
      console.log('Datos de actualización:', updateData);

      await requestAPI.update(requestId, updateData);
      
      // Actualizar la lista local
      setRecibidas((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? { ...r, respuesta: replyText.trim(), estado: selectedEstado }
            : r
        )
      );
      
      setInfo('Respuesta enviada correctamente al residente.');
      setOpenReplyDialog(false);
      setReplyText('');
      setSelectedEstado('pendiente');
      
      // Recargar datos para actualizar la lista
      setTimeout(() => {
        loadData();
      }, 500);
      
    } catch (err) {
      console.error('Error detallado al enviar respuesta:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      
      // Mostrar mensaje de error más específico
      if (err.response?.data?.error) {
        const errorMsg = Array.isArray(err.response.data.error) 
          ? err.response.data.error.join(', ')
          : err.response.data.error;
        setError(`Error: ${errorMsg}`);
      } else if (err.response?.data?.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError(`No se pudo enviar la respuesta. ${err.message || 'Intente nuevamente.'}`);
      }
    } finally {
      setReplying(false);
    }
  };

  const handleViewRequest = (request) => {
    setViewingRequest(request);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewingRequest(null);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('es-ES');
    } catch {
      return '-';
    }
  };

  const formatHora = (fecha) => {
    if (!fecha) return '';
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (!isPropietario) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <Alert severity="info">
          Este apartado está disponible solo para propietarios.
        </Alert>
      </Paper>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', pt: 0 }}>
      <Container 
         maxWidth="xl"
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
                        PQRS - Propietario
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                        Gestiona las PQRS de tus residentes y comunícate con el administrador.
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    icon={<PersonIcon />}
                    label={user?.name || user?.nombre || user?.username || 'Propietario'}
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </StyledCard>
        </Box>

        {/* Tabs */}
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
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 44, borderRadius: 2 },
              '& .Mui-selected': { color: `${colors.accent} !important`, backgroundColor: alpha(colors.accent, 0.08) },
              '& .MuiTabs-indicator': { backgroundColor: colors.accent, height: 3, borderRadius: 3 },
            }}
          >
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="Recibidas" />
            <Tab icon={<SendIcon />} iconPosition="start" label="Enviar al Admin" />
            <Tab icon={<PqrsIcon />} iconPosition="start" label="Mis Envíos" />
          </Tabs>
        </Paper>

        {(error || info) && (
          <Box sx={{ mb: 3 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {!error && info && <Alert severity="info" sx={{ borderRadius: 2 }} onClose={() => setInfo('')}>{info}</Alert>}
          </Box>
        )}

        {/* Tab: PQRS Recibidas de Residentes */}
        {tab === 0 && (
          <StyledCard>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                  PQRS Recibidas de Residentes
                </Typography>
                <Button
                  variant="outlined"
                  onClick={loadData}
                  sx={{
                    borderColor: alpha(colors.accent, 0.5),
                    color: colors.accent,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { borderColor: colors.accent, backgroundColor: alpha(colors.accent, 0.05) },
                  }}
                >
                  Actualizar
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {recibidas.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No tienes PQRS recibidas de residentes.
                </Alert>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(colors.primary, 0.04) }}>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Remitente</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Asunto</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Prioridad</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recibidas.map((r) => (
                        <TableRow key={String(r.id)} hover>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2">
                              {formatFecha(r.fecha)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.disabled }}>
                              {formatHora(r.fecha)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 16, color: colors.accent }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {r.remitenteNombre || r.remitenteUsuario || '-'}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block' }}>
                              Residente
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Chip
                              size="small"
                              label={String(r.tipo || '-').charAt(0).toUpperCase() + String(r.tipo || '').slice(1)}
                              sx={{ bgcolor: alpha(colors.accent, 0.1), color: colors.accent, fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 600 }}>{r.asunto || '-'}</Typography>
                            {r.descripcion && (
                              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                                {String(r.descripcion).slice(0, 80)}...
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{getPriorityChip(r.prioridad)}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{getStatusChip(r.estado)}</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Ver detalles">
                                <IconButton size="small" onClick={() => handleViewRequest(r)}>
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {r.estado !== 'resuelto' && r.estado !== 'terminado' && r.estado !== 'rechazado' && (
                                <Tooltip title="Responder">
                                  <IconButton size="small" onClick={() => handleOpenReply(r)} sx={{ color: colors.success }}>
                                    <ReplyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </StyledCard>
        )}

        {/* Tab: Enviar PQRS al Administrador */}
        {tab === 1 && (
          <StyledCard>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {sending && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
                Enviar PQRS al Administrador
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info" sx={{ borderRadius: 2, bgcolor: alpha(colors.info, 0.05), mb: 2 }}>
                    Tu PQRS será enviada al Administrador del Condominio para su revisión y respuesta.
                  </Alert>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Asunto"
                    value={form.asunto}
                    onChange={handleChange('asunto')}
                    placeholder="Breve resumen de tu solicitud"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={form.tipo}
                      onChange={handleChange('tipo')}
                      label="Tipo"
                    >
                      <MenuItem value="peticion">Petición</MenuItem>
                      <MenuItem value="queja">Queja</MenuItem>
                      <MenuItem value="reclamo">Reclamo</MenuItem>
                      <MenuItem value="sugerencia">Sugerencia</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      value={form.prioridad}
                      onChange={handleChange('prioridad')}
                      label="Prioridad"
                    >
                      <MenuItem value="baja">Baja</MenuItem>
                      <MenuItem value="media">Media</MenuItem>
                      <MenuItem value="alta">Alta</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={form.descripcion}
                    onChange={handleChange('descripcion')}
                    multiline
                    rows={5}
                    placeholder="Describe detalladamente tu petición, queja, reclamo o sugerencia..."
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmitToAdmin}
                    startIcon={<SendIcon />}
                    disabled={sending}
                    sx={{
                      bgcolor: colors.accent,
                      '&:hover': { bgcolor: colors.primary },
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    {sending ? 'Enviando...' : 'Enviar PQRS al Administrador'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        )}

        {/* Tab: Mis Envíos al Administrador */}
        {tab === 2 && (
          <StyledCard>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                  Mis PQRS Enviadas al Administrador
                </Typography>
                <Button
                  variant="outlined"
                  onClick={loadData}
                  sx={{
                    borderColor: alpha(colors.accent, 0.5),
                    color: colors.accent,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { borderColor: colors.accent, backgroundColor: alpha(colors.accent, 0.05) },
                  }}
                >
                  Actualizar
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {enviadas.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No has enviado PQRS al administrador.
                </Alert>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(colors.primary, 0.04) }}>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Asunto</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Prioridad</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enviadas.map((r) => (
                        <TableRow key={String(r.id)} hover>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2">
                              {formatFecha(r.fecha)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.disabled }}>
                              {formatHora(r.fecha)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Chip
                              size="small"
                              label={String(r.tipo || '-').charAt(0).toUpperCase() + String(r.tipo || '').slice(1)}
                              sx={{ bgcolor: alpha(colors.accent, 0.1), color: colors.accent, fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 600 }}>{r.asunto || '-'}</Typography>
                            {r.descripcion && (
                              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                                {String(r.descripcion).slice(0, 80)}...
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{getPriorityChip(r.prioridad)}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{getStatusChip(r.estado)}</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" onClick={() => handleViewRequest(r)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </StyledCard>
        )}

        {/* Diálogo de Respuesta con selector de estado */}
        <Dialog open={openReplyDialog} onClose={() => setOpenReplyDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ReplyIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Responder PQRS</Typography>
            </Box>
            <IconButton onClick={() => setOpenReplyDialog(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedRequest && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(colors.primary, 0.02), borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Remitente</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      {selectedRequest.remitenteNombre || selectedRequest.remitenteUsuario}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Asunto</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      {selectedRequest.asunto}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Descripción</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedRequest.descripcion}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Estado de la PQRS</InputLabel>
                    <Select
                      value={selectedEstado}
                      onChange={(e) => setSelectedEstado(e.target.value)}
                      label="Estado de la PQRS"
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="en_proceso">En proceso</MenuItem>
                      <MenuItem value="resuelto">Resuelto</MenuItem>
                      <MenuItem value="rechazado">Rechazado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Tu respuesta"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    multiline
                    rows={5}
                    placeholder="Escribe tu respuesta al residente..."
                    autoFocus
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenReplyDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSendReply}
              variant="contained"
              disabled={replying || !replyText.trim()}
              sx={{ bgcolor: colors.success, '&:hover': { bgcolor: colors.success, opacity: 0.9 }, borderRadius: 2 }}
            >
              {replying ? 'Enviando...' : 'Enviar Respuesta'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo Ver Detalles */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <VisibilityIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Detalles de PQRS</Typography>
            </Box>
            <IconButton onClick={handleCloseViewDialog} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {viewingRequest && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Fecha</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {viewingRequest.fecha ? new Date(viewingRequest.fecha).toLocaleString() : '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Tipo</Typography>
                  <Chip
                    size="small"
                    label={String(viewingRequest.tipo || '').charAt(0).toUpperCase() + String(viewingRequest.tipo || '').slice(1)}
                    sx={{ bgcolor: alpha(colors.accent, 0.1), color: colors.accent }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Prioridad</Typography>
                  <Box>{getPriorityChip(viewingRequest.prioridad)}</Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Estado</Typography>
                  <Box>{getStatusChip(viewingRequest.estado)}</Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Remitente</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {viewingRequest.remitenteNombre || viewingRequest.remitenteUsuario || '-'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.disabled }}>
                    Residente
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Asunto</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    {viewingRequest.asunto || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 1 }}>Descripción</Typography>
                  <Paper variant="outlined" sx={{ p: 2.5, bgcolor: alpha(colors.background, 0.5), borderRadius: 3 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {viewingRequest.descripcion || '-'}
                    </Typography>
                  </Paper>
                </Grid>
                
                {viewingRequest.respuesta && (
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ReplyIcon sx={{ color: colors.success, fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: colors.success, fontWeight: 600 }}>
                        RESPUESTA DEL PROPIETARIO
                      </Typography>
                    </Box>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(colors.success, 0.05),
                        borderRadius: 3,
                        borderColor: alpha(colors.success, 0.3),
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {viewingRequest.respuesta}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseViewDialog} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PropietarioPQRS;