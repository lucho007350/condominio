import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Zoom,
  Fade,
  Tooltip,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Pets as PetsIcon,
  DirectionsCar as DirectionsCarIcon,
  PhoneInTalk as PhoneInTalkIcon,
  Security as SecurityIcon,
  Key as KeyIcon,
  QrCode as QrCodeIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

import { authAPI, residentesAPI } from '../services/api.jsx';

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

// Animaciones personalizadas
const fadeIn = {
  animation: 'fadeIn 0.5s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

// Componentes estilizados
const GlassCard = styled(Card)(({ theme }) => ({
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

const InfoChip = styled(Chip)(({ chipcolor }) => ({
  backgroundColor: alpha(chipcolor || colors.primary, 0.1),
  color: chipcolor || colors.primary,
  fontWeight: 600,
  border: `1px solid ${alpha(chipcolor || colors.primary, 0.2)}`,
  '& .MuiChip-icon': {
    color: chipcolor || colors.primary,
  },
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const emptyProfile = {
    nombre: '',
    apellido: '',
    tipoResidente: '',
    documento: '',
    telefono: '',
    correo: '',
    estado: '',
  };

  const [userData, setUserData] = useState(emptyProfile);
  const [editForm, setEditForm] = useState(emptyProfile);

  const fullName = [userData.nombre, userData.apellido].filter(Boolean).join(' ') || user?.name || user?.username || 'Perfil';

  const setStoredUser = (nextUser) => {
    try {
      const local = localStorage.getItem('user');
      const session = sessionStorage.getItem('user');
      if (local) localStorage.setItem('user', JSON.stringify(nextUser));
      else if (session) sessionStorage.setItem('user', JSON.stringify(nextUser));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let alive = true;
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setUser(storedUser);

    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        // Prefer /auth/me (fuente de verdad segun el token)
        let r = null;
        let refreshedUser = null;
        try {
          const me = await authAPI.me();
          refreshedUser = me?.data?.user || null;
          r = me?.data?.residente || null;
        } catch {
          // ignore and fallback
        }

        const residentId = refreshedUser?.idResidente || storedUser?.idResidente;
        if (!r && residentId) {
          const res = await residentesAPI.getById(residentId);
          r = res?.data || null;
        }

        if (!r) {
          setLoadError('No se pudo resolver el residente de la sesion. Vuelve a iniciar sesion.');
          return;
        }

        const resolvedResidentId = r?.idResidente || residentId;
        if (resolvedResidentId) {
          try {
            const ures = await residentesAPI.getUnidades(resolvedResidentId);
            const list = Array.isArray(ures?.data) ? ures.data : [];
            if (alive) setUnidades(list);
          } catch {
            if (alive) setUnidades([]);
          }
        }

        const next = {
          nombre: r?.nombre || '',
          apellido: r?.apellido || '',
          tipoResidente: r?.tipoResidente || '',
          documento: r?.documento || '',
          telefono: r?.telefono || '',
          correo: r?.correo || '',
          estado: r?.estado || '',
        };

        if (!alive) return;
        setUserData(next);
        setEditForm(next);

        // actualizar datos basicos en storage (avatar/nombre)
        const merged = {
          ...storedUser,
          ...(refreshedUser ? refreshedUser : null),
          name: [next.nombre, next.apellido].filter(Boolean).join(' ') || storedUser?.name,
          email: next.correo || storedUser?.email,
          correo: next.correo || storedUser?.correo,
        };
        setStoredUser(merged);
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || err?.message || 'No se pudo cargar el perfil desde la API';
        setLoadError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  const handleEditToggle = () => {
    if (editing) {
      setEditForm({ ...userData });
    }
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const required = ['nombre', 'apellido', 'tipoResidente', 'documento', 'telefono', 'correo', 'estado'];
    for (const k of required) {
      if (!String(editForm?.[k] || '').trim()) {
        setSnackbar({ open: true, message: 'Complete todos los campos obligatorios', severity: 'error' });
        return;
      }
    }

    if (!user?.idResidente) {
      setSnackbar({ open: true, message: 'No se encontro idResidente en sesion', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: String(editForm.nombre).trim(),
        apellido: String(editForm.apellido).trim(),
        tipoResidente: editForm.tipoResidente,
        documento: String(editForm.documento).trim(),
        telefono: String(editForm.telefono).trim(),
        correo: String(editForm.correo).trim(),
        estado: editForm.estado,
      };

      const res = await residentesAPI.update(user.idResidente, payload);
      const updated = res?.data || payload;

      setUserData(updated);
      setEditForm(updated);
      setEditing(false);
      setSnackbar({ open: true, message: 'Perfil actualizado correctamente', severity: 'success' });

      const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      const merged = {
        ...storedUser,
        name: [updated.nombre, updated.apellido].filter(Boolean).join(' ') || storedUser?.name,
        email: updated.correo || storedUser?.email,
        correo: updated.correo || storedUser?.correo,
      };
      setStoredUser(merged);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'No se pudo actualizar el perfil';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 60, color: colors.primary, mb: 2, animation: 'pulse 2s infinite' }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            Cargando tu perfil
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
            Por favor espera un momento
          </Typography>
        </Box>
        <LinearProgress 
          sx={{ 
            width: 200,
            mt: 3,
            height: 4,
            borderRadius: 2,
            backgroundColor: alpha(colors.primary, 0.1),
            '& .MuiLinearProgress-bar': { 
              backgroundColor: colors.primary,
            } 
          }} 
        />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl"> {/* Cambiado de lg a xl para más ancho */}
        {loadError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {loadError}
          </Alert>
        )}
        {/* Header con bienvenida personalizada */}
        <Box sx={{ ...fadeIn, mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
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
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                  Bienvenido de vuelta
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {fullName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Perfil Verificado"
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<EmailIcon />}
                    label={userData.correo || user?.email || user?.username || '—'}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Grid con proporciones ajustadas - 4 y 8 para mejor distribución */}
        <Grid container spacing={3}>
          {/* Columna izquierda - Información principal (4 columnas) */}
          <Grid item xs={12} md={4}>
            <Zoom in timeout={300}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 140,
                        height: 140,
                        bgcolor: alpha(colors.primary, 0.1),
                        color: colors.primary,
                        fontSize: '4rem',
                        border: `4px solid ${colors.primary}`,
                        boxShadow: `0 10px 30px ${alpha(colors.primary, 0.3)}`,
                        mb: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      {(userData.nombre || fullName || 'U').charAt(0)}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
                      {fullName}
                    </Typography>
                    <InfoChip
                      icon={<CheckCircleIcon />}
                      label={userData.tipoResidente || 'Residente'}
                      chipcolor={colors.success}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List sx={{ width: '100%' }}>
                    {[
                      { icon: <EmailIcon />, primary: 'Correo', secondary: userData.correo || '—' },
                      { icon: <PhoneIcon />, primary: 'Teléfono', secondary: userData.telefono || '—' },
                      { icon: <BadgeIcon />, primary: 'Documento', secondary: userData.documento || '—' },
                      { icon: <CheckCircleIcon />, primary: 'Estado', secondary: userData.estado || '—' },
                    ].map((item, index) => (
                      <ListItem 
                        key={index}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: alpha(colors.primary, 0.02),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.primary}
                          secondary={item.secondary}
                          primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                          secondaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.text.primary, mb: 1 }}>
                    Mis unidades
                  </Typography>
                  {unidades.length === 0 ? (
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      No tienes unidades asignadas.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {unidades.map((u) => (
                        <Chip
                          key={u.idUnidad}
                          icon={<HomeIcon />}
                          label={u.numero ? `Unidad ${u.numero}` : `Unidad ${u.idUnidad}`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(colors.primary, 0.06),
                            border: `1px solid ${alpha(colors.primary, 0.18)}`,
                            color: colors.primary,
                            fontWeight: 700,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </GlassCard>
            </Zoom>
          </Grid>

          {/* Columna derecha - Formulario de edición (8 columnas - más ancho) */}
          <Grid item xs={12} md={8}>
            <Zoom in timeout={500}>
              <GlassCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 700 }}>
                        Información de Contacto
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        Actualiza tus datos personales
                      </Typography>
                    </Box>
                    {!editing ? (
                      <GradientButton
                        startIcon={<EditIcon />}
                        onClick={handleEditToggle}
                        disabled={Boolean(loadError) || saving}
                        bgcolor={colors.primary}
                      >
                        Editar Perfil
                      </GradientButton>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Guardar cambios">
                          <IconButton 
                            onClick={handleSave}
                            disabled={saving}
                            sx={{ 
                              color: colors.success,
                              bgcolor: alpha(colors.success, 0.1),
                              '&:hover': { bgcolor: alpha(colors.success, 0.2) },
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                          <IconButton 
                            onClick={handleEditToggle}
                            disabled={saving}
                            sx={{ 
                              color: colors.error,
                              bgcolor: alpha(colors.error, 0.1),
                              '&:hover': { bgcolor: alpha(colors.error, 0.2) },
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={editing ? editForm.nombre : userData.nombre}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: { 
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                            '&:hover': {
                              bgcolor: alpha(colors.primary, 0.04),
                            },
                          },
                          startAdornment: <PersonIcon sx={{ mr: 1, color: colors.text.disabled, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        name="apellido"
                        value={editing ? editForm.apellido : userData.apellido}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: { 
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                          },
                          startAdornment: <PersonIcon sx={{ mr: 1, color: colors.text.disabled, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Correo"
                        name="correo"
                        value={editing ? editForm.correo : userData.correo}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: { 
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                          },
                          startAdornment: <EmailIcon sx={{ mr: 1, color: colors.text.disabled, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={editing ? editForm.telefono : userData.telefono}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: { 
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                          },
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: colors.text.disabled, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Documento"
                        name="documento"
                        value={editing ? editForm.documento : userData.documento}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: {
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                          },
                          startAdornment: <BadgeIcon sx={{ mr: 1, color: colors.text.disabled, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={!editing}>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                          name="tipoResidente"
                          value={editing ? editForm.tipoResidente : userData.tipoResidente}
                          label="Tipo"
                          onChange={handleInputChange}
                          sx={{ borderRadius: 3, bgcolor: alpha(colors.primary, 0.02) }}
                        >
                          <MenuItem value="Propietario">Propietario</MenuItem>
                          <MenuItem value="Arrendatario">Arrendatario</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={!editing}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                          name="estado"
                          value={editing ? editForm.estado : userData.estado}
                          label="Estado"
                          onChange={handleInputChange}
                          sx={{ borderRadius: 3, bgcolor: alpha(colors.primary, 0.02) }}
                        >
                          <MenuItem value="Activo">Activo</MenuItem>
                          <MenuItem value="Inactivo">Inactivo</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  {/* Acciones rápidas mejoradas */}
                  <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 700, mb: 3 }}>
                    Acciones Rápidas
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ReceiptIcon />}
                        component={Link}
                        to="/mis-pagos"
                        sx={{
                          py: 2,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: `0 4px 10px ${alpha(colors.primary, 0.3)}`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 20px ${alpha(colors.primary, 0.4)}`,
                          },
                        }}
                      >
                        Ver mis pagos
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        component={Link}
                        to="/solicitudes"
                        sx={{
                          py: 2,
                          borderRadius: 3,
                          borderColor: colors.primary,
                          color: colors.primary,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: colors.secondary,
                            backgroundColor: alpha(colors.primary, 0.02),
                          },
                        }}
                      >
                        Mis solicitudes
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        component={Link}
                        to="/comunicacion"
                        sx={{
                          py: 2,
                          borderRadius: 3,
                          borderColor: colors.primary,
                          color: colors.primary,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: colors.secondary,
                            backgroundColor: alpha(colors.primary, 0.02),
                          },
                        }}
                      >
                        Comunicados
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </GlassCard>
            </Zoom>
          </Grid>
        </Grid>

        {/* Snackbar mejorado */}
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
              width: '100%',
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

export default Profile;
