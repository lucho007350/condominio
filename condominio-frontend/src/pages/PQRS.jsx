import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
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
} from '@mui/material';
import {
  MarkEmailUnread as PqrsIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

import { requestAPI, residentAPI } from '../services/api.jsx';

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
  },
  border: '#e2e8f0',
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

const statusConfig = {
  pendiente: { label: 'Pendiente', color: colors.warning },
  en_proceso: { label: 'En proceso', color: colors.info },
  resuelto: { label: 'Resuelto', color: colors.success },
  rechazado: { label: 'Rechazado', color: colors.error },
};

const getStatusChip = (status) => {
  const key = String(status || 'pendiente').toLowerCase();
  const cfg = statusConfig[key] || statusConfig.pendiente;
  return (
    <Chip
      size="small"
      label={cfg.label}
      sx={{
        backgroundColor: alpha(cfg.color, 0.12),
        color: cfg.color,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
        fontWeight: 700,
      }}
    />
  );
};

const pqrsLocalKey = (username) => `pqrs:mine:${username || 'anon'}`;

const PQRS = () => {
  const user = useMemo(() => safeParseUser(), []);
  const isUser = user?.role === 'user';

  const [tab, setTab] = useState(0);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loadingMine, setLoadingMine] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [propietarios, setPropietarios] = useState([]);
  const [mine, setMine] = useState([]);

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

    const localFallback = () => {
      try {
        const raw = localStorage.getItem(pqrsLocalKey(user?.username));
        const parsed = raw ? JSON.parse(raw) : [];
        setMine(Array.isArray(parsed) ? parsed : []);
      } catch {
        setMine([]);
      }
    };

    try {
      const res = await requestAPI.getAll();
      const all = toArray(res?.data);
      const mineFromApi = all
        .map((r) => ({
          id: r?.id ?? r?.idRequest ?? r?._id ?? r?.uuid,
          fecha: r?.fecha ?? r?.createdAt ?? r?.created_at,
          tipo: r?.tipo ?? r?.type,
          asunto: r?.asunto ?? r?.subject ?? r?.titulo,
          descripcion: r?.descripcion ?? r?.description ?? r?.detalle,
          prioridad: r?.prioridad ?? r?.priority,
          estado: r?.estado ?? r?.status,
          propietarioNombre: r?.propietarioNombre ?? r?.destinatarioNombre ?? r?.toName,
          propietarioId: r?.propietarioId ?? r?.destinatarioId ?? r?.to,
          remitenteUsuario: r?.remitenteUsuario ?? r?.createdBy ?? r?.username,
          source: 'api',
          raw: r,
        }))
        .filter((r) => (user?.username ? r.remitenteUsuario === user.username : true));

      if (mineFromApi.length === 0) {
        localFallback();
      } else {
        setMine(mineFromApi);
      }
    } catch {
      localFallback();
    } finally {
      setLoadingMine(false);
    }
  };

  useEffect(() => {
    if (!isUser) return;
    loadPropietarios();
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistLocalMine = (items) => {
    try {
      localStorage.setItem(pqrsLocalKey(user?.username), JSON.stringify(items));
    } catch {
      // ignore
    }
  };

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
      propietarioId: form.propietarioId || null,
      propietarioNombre: form.propietarioNombre.trim() || null,
      remitenteUsuario: user?.username || null,
      remitenteNombre: user?.name || null,
    };

    const localItem = {
      id: `local-${Date.now()}`,
      ...payload,
      source: 'local',
    };

    try {
      const res = await requestAPI.create(payload);
      const created = res?.data;
      const createdItem = {
        id: created?.id ?? created?.idRequest ?? created?._id ?? created?.uuid ?? localItem.id,
        fecha: created?.fecha ?? created?.createdAt ?? payload.fecha,
        tipo: created?.tipo ?? payload.tipo,
        asunto: created?.asunto ?? payload.asunto,
        descripcion: created?.descripcion ?? payload.descripcion,
        prioridad: created?.prioridad ?? payload.prioridad,
        estado: created?.estado ?? created?.status ?? payload.estado,
        propietarioNombre: created?.propietarioNombre ?? payload.propietarioNombre,
        propietarioId: created?.propietarioId ?? payload.propietarioId,
        remitenteUsuario: created?.remitenteUsuario ?? payload.remitenteUsuario,
        source: 'api',
        raw: created,
      };

      const next = [createdItem, ...mine];
      setMine(next);
      persistLocalMine(next);
      resetForm();
      setTab(1);
      setInfo('PQRS enviada.');
    } catch {
      const next = [localItem, ...mine];
      setMine(next);
      persistLocalMine(next);
      resetForm();
      setTab(1);
      setInfo('No se pudo enviar a la API; se guardo localmente (sincronizacion pendiente).');
    } finally {
      setSending(false);
    }
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
    <Box sx={{ minHeight: '60vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(colors.border, 0.8)}`,
          background: `linear-gradient(135deg, ${alpha(colors.surface, 0.95)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PqrsIcon sx={{ color: colors.primary }} /> PQRS
            </Typography>
            <Typography sx={{ color: colors.text.secondary, mt: 0.5 }}>
              Envia peticiones, quejas, reclamos o sugerencias al propietario que elijas.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={<PersonIcon />}
              label={user?.name || user?.username || 'Residente'}
              sx={{
                backgroundColor: alpha(colors.primary, 0.08),
                border: `1px solid ${alpha(colors.primary, 0.18)}`,
                color: colors.primary,
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: colors.primary, height: 3, borderRadius: 3 } }}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 800 },
              '& .Mui-selected': { color: colors.primary },
            }}
          >
            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Nueva" />
            <Tab icon={<PqrsIcon />} iconPosition="start" label="Mis PQRS" />
          </Tabs>
        </Box>
      </Paper>

      {(error || info) && (
        <Box sx={{ mb: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {!error && info && <Alert severity="info">{info}</Alert>}
        </Box>
      )}

      {tab === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
          {(loadingOwners || sending) && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="pqrs-propietario">Propietario</InputLabel>
                <Select
                  labelId="pqrs-propietario"
                  label="Propietario"
                  value={form.propietarioId}
                  onChange={onSelectPropietario}
                  disabled={loadingOwners}
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  {propietarioOptions.map((p) => (
                    <MenuItem key={String(p.id)} value={String(p.id)}>
                      {p.name}{p.email ? ` (${p.email})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del propietario (si no aparece)"
                value={form.propietarioNombre}
                onChange={handleChange('propietarioNombre')}
                disabled={Boolean(form.propietarioId)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="pqrs-tipo">Tipo</InputLabel>
                <Select labelId="pqrs-tipo" label="Tipo" value={form.tipo} onChange={handleChange('tipo')}>
                  <MenuItem value="peticion">Peticion</MenuItem>
                  <MenuItem value="queja">Queja</MenuItem>
                  <MenuItem value="reclamo">Reclamo</MenuItem>
                  <MenuItem value="sugerencia">Sugerencia</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="pqrs-prioridad">Prioridad</InputLabel>
                <Select labelId="pqrs-prioridad" label="Prioridad" value={form.prioridad} onChange={handleChange('prioridad')}>
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<SendIcon />}
                  disabled={sending}
                  sx={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.2,
                    fontWeight: 800,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: colors.secondary },
                  }}
                >
                  Enviar PQRS
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asunto"
                value={form.asunto}
                onChange={handleChange('asunto')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripcion"
                value={form.descripcion}
                onChange={handleChange('descripcion')}
                multiline
                minRows={5}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
          {loadingMine && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Historial
            </Typography>
            <Button
              variant="outlined"
              onClick={loadMine}
              sx={{
                borderColor: alpha(colors.primary, 0.4),
                color: colors.primary,
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { borderColor: colors.primary, backgroundColor: alpha(colors.primary, 0.06) },
              }}
            >
              Actualizar
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {mine.length === 0 ? (
            <Alert severity="info">Aun no has enviado PQRS.</Alert>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Propietario</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Asunto</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mine.map((r) => (
                    <TableRow key={String(r.id)} hover>
                      <TableCell>
                        {r.fecha ? new Date(r.fecha).toLocaleString() : '-'}
                        {r.source === 'local' ? (
                          <Box component="span" sx={{ ml: 1, color: colors.text.secondary, fontSize: 12 }}>
                            (local)
                          </Box>
                        ) : null}
                      </TableCell>
                      <TableCell>{r.propietarioNombre || r.propietarioId || '-'}</TableCell>
                      <TableCell>{String(r.tipo || '-')}</TableCell>
                      <TableCell sx={{ maxWidth: 420 }}>
                        <Typography sx={{ fontWeight: 700, color: colors.text.primary }}>
                          {r.asunto || '-'}
                        </Typography>
                        {r.descripcion ? (
                          <Typography sx={{ color: colors.text.secondary }}>
                            {String(r.descripcion).slice(0, 120)}{String(r.descripcion).length > 120 ? '...' : ''}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>{getStatusChip(r.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PQRS;
