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

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const normalizePropietario = (u) => {
  const id = u?.idPropietario ?? u?.id ?? u?._id ?? u?.uuid;
  const name = u?.name ?? u?.nombre ?? u?.fullName ?? [u?.nombres, u?.apellidos].filter(Boolean).join(' ');
  const username = u?.username ?? u?.usuario;
  const email = u?.email ?? u?.correo;
  return {
    id: id ?? username ?? email ?? name,
    name: name || username || email || 'Propietario',
    username,
    email,
    raw: u,
  };
};

const normalizeRequest = (r) => ({
  id: r?.id ?? r?.idRequest ?? r?._id ?? r?.uuid,
  tipo: r?.tipo ?? r?.type ?? 'peticion',
  asunto: r?.asunto ?? r?.subject ?? r?.titulo ?? '',
  descripcion: r?.descripcion ?? r?.description ?? r?.detalle ?? '',
  prioridad: r?.prioridad ?? r?.priority ?? 'media',
  estado: r?.estado ?? r?.status ?? 'pendiente',
  fecha: r?.fecha ?? r?.createdAt ?? r?.created_at,
  respuesta: r?.respuesta ?? '',
  propietarioId: r?.propietarioId ?? r?.destinatarioId ?? r?.to,
  propietarioNombre: r?.propietarioNombre ?? r?.destinatarioNombre ?? r?.toName ?? '',
  remitenteUsuario: r?.remitenteUsuario ?? r?.createdBy ?? r?.username ?? '',
  remitenteNombre: r?.remitenteNombre ?? r?.createdByName ?? '',
});

const PQRS = () => {
  const user = useMemo(() => safeParseUser(), []);
  const role = String(user?.role || '').toLowerCase();
  const isUser = role === 'user' || role === 'residente' || role === 'resident';

  const [tab, setTab] = useState(0);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loadingMine, setLoadingMine] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [propietarios, setPropietarios] = useState([]);
  const [mine, setMine] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [form, setForm] = useState({
    propietarioId: '',
    propietarioNombre: '',
    tipo: 'peticion',
    asunto: '',
    descripcion: '',
    prioridad: 'media',
  });

  const propietarioOptions = useMemo(() => {
    const seen = new Set();
    return propietarios.filter((p) => {
      const k = String(p?.id ?? '');
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [propietarios]);

  const loadPropietarios = async () => {
    setLoadingOwners(true);
    setError('');
    try {
      const res = await residentAPI.getAll();
      const users = toArray(res?.data);
      const owners = users
        .filter((u) => {
          const role = String(u?.role || u?.tipo || '').toLowerCase();
          return role === 'propietario' || role === 'owner';
        })
        .map(normalizePropietario);
      setPropietarios(owners);
    } catch {
      setPropietarios([]);
      setInfo('No se pudieron cargar propietarios desde la API; puedes escribir el nombre manualmente.');
    } finally {
      setLoadingOwners(false);
    }
  };

  const loadMine = async () => {
    setLoadingMine(true);
    setError('');
    setInfo('');
    try {
      const res = await requestAPI.getAll();
      const all = toArray(res?.data);
      const mineFromApi = all
        .map(normalizeRequest)
        .filter((r) => (user?.username ? r.remitenteUsuario === user.username : true));
      
      mineFromApi.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMine(mineFromApi);
    } catch {
      setMine([]);
    } finally {
      setLoadingMine(false);
    }
  };

  useEffect(() => {
    if (!isUser) return;
    loadPropietarios();
    loadMine();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e?.target?.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSelectPropietario = (e) => {
    const value = e?.target?.value;
    const found = propietarioOptions.find((p) => String(p.id) === String(value));
    setForm((prev) => ({
      ...prev,
      propietarioId: value,
      propietarioNombre: found?.name || prev.propietarioNombre,
    }));
  };

  const validate = () => {
    if (!form.asunto.trim()) return 'El asunto es obligatorio.';
    if (!form.descripcion.trim()) return 'La descripcion es obligatoria.';
    if (!form.propietarioId && !form.propietarioNombre.trim()) return 'Selecciona un propietario o escribe su nombre.';
    return '';
  };

  const resetForm = () => {
    setForm({
      propietarioId: '',
      propietarioNombre: '',
      tipo: 'peticion',
      asunto: '',
      descripcion: '',
      prioridad: 'media',
    });
  };

  const handleSubmit = async () => {
    setError('');
    setInfo('');
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSending(true);
    const payload = {
      tipo: form.tipo,
      asunto: form.asunto.trim(),
      descripcion: form.descripcion.trim(),
      prioridad: form.prioridad,
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      propietarioId: form.propietarioId ? Number(form.propietarioId) : null,
      propietarioNombre: form.propietarioNombre.trim() || null,
      remitenteUsuario: user?.username || null,
      remitenteNombre: user?.name || null,
    };

    try {
      const res = await requestAPI.create(payload);
      const created = normalizeRequest(res?.data);
      setMine((prev) => [created, ...prev]);
      resetForm();
      setTab(1);
      setInfo('PQRS enviada correctamente.');
    } catch {
      setError('No se pudo enviar la PQRS. Intente nuevamente.');
    } finally {
      setSending(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedRequest(null);
  };

  if (!isUser) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <Alert severity="info">
          Este apartado de PQRS esta disponible solo para residentes.
        </Alert>
      </Paper>
    );
  }

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
                        PQRS
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                        Envía peticiones, quejas, reclamos o sugerencias al propietario que elijas.
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    icon={<PersonIcon />}
                    label={user?.name || user?.username || 'Residente'}
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
            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Nueva PQRS" />
            <Tab icon={<PqrsIcon />} iconPosition="start" label="Mis PQRS" />
          </Tabs>
        </Paper>

        {(error || info) && (
          <Box sx={{ mb: 3 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            {!error && info && <Alert severity="info" sx={{ borderRadius: 2 }}>{info}</Alert>}
          </Box>
        )}

        {/* Tab: Nueva PQRS */}
        {tab === 0 && (
          <StyledCard>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {(loadingOwners || sending) && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Seleccionar propietario</InputLabel>
                    <Select
                      value={form.propietarioId}
                      onChange={onSelectPropietario}
                      label="Seleccionar propietario"
                      disabled={loadingOwners}
                    >
                      <MenuItem value="">-- Escribir manualmente --</MenuItem>
                      {propietarioOptions.map((p) => (
                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del propietario"
                    value={form.propietarioNombre}
                    onChange={handleChange('propietarioNombre')}
                    disabled={Boolean(form.propietarioId)}
                    placeholder="Escribe el nombre del propietario"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Asunto"
                    value={form.asunto}
                    onChange={handleChange('asunto')}
                    placeholder="Breve resumen de tu solicitud"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
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

                <Grid item xs={12} md={6}>
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

                <Grid item xs={12}>
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

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
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
                    {sending ? 'Enviando...' : 'Enviar PQRS'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        )}

        {/* Tab: Mis PQRS */}
        {tab === 1 && (
          <StyledCard>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {loadingMine && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                  Historial de PQRS
                </Typography>
                <Button
                  variant="outlined"
                  onClick={loadMine}
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

              {mine.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Aún no has enviado PQRS.
                </Alert>
              ) : (
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(colors.primary, 0.04) }}>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Propietario</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Asunto</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Prioridad</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mine.map((r) => (
                        <TableRow key={String(r.id)} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {r.fecha ? new Date(r.fecha).toLocaleDateString('es-ES') : '-'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.disabled }}>
                              {r.fecha ? new Date(r.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {r.propietarioNombre || r.propietarioId || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
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
                                {String(r.descripcion).slice(0, 60)}...
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{getPriorityChip(r.prioridad)}</TableCell>
                          <TableCell>{getStatusChip(r.estado)}</TableCell>
                          <TableCell align="center">
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

        {/* Diálogo Ver Detalles con Respuesta */}
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
            {selectedRequest && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Tipo</Typography>
                  <Chip
                    size="small"
                    label={String(selectedRequest.tipo || '').charAt(0).toUpperCase() + String(selectedRequest.tipo || '').slice(1)}
                    sx={{ bgcolor: alpha(colors.accent, 0.1), color: colors.accent }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Prioridad</Typography>
                  <Box>{getPriorityChip(selectedRequest.prioridad)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Estado</Typography>
                  <Box>{getStatusChip(selectedRequest.estado)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Fecha</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedRequest.fecha ? new Date(selectedRequest.fecha).toLocaleString() : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Propietario</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedRequest.propietarioNombre || selectedRequest.propietarioId || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>Asunto</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    {selectedRequest.asunto || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 1 }}>Descripción</Typography>
                  <Paper variant="outlined" sx={{ p: 2.5, bgcolor: alpha(colors.background, 0.5), borderRadius: 3 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedRequest.descripcion || '-'}
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Respuesta del administrador */}
                {selectedRequest.respuesta && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ReplyIcon sx={{ color: colors.success, fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: colors.success, fontWeight: 600 }}>
                        RESPUESTA DEL ADMINISTRADOR
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
                        {selectedRequest.respuesta}
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

export default PQRS;