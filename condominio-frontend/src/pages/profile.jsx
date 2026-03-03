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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const [userData, setUserData] = useState({
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+56 9 1234 5678',
    unidad: 'Condominio Los Pinos - Unidad 502',
    rut: '12.345.678-9',
    fechaIngreso: '15/03/2023',
    estado: 'Activo',
    tipoUsuario: 'Residente',
    emergenciaContacto: 'María Rodríguez',
    telefonoEmergencia: '+56 9 8765 4321',
    mascotas: 1,
    vehiculos: 1,
    numHabitantes: 3,
    codigoAcceso: 'CONDO-502-ADMIN',
  });

  const [editForm, setEditForm] = useState({ ...userData });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    setTimeout(() => {
      setUser(storedUser);
      setLoading(false);
    }, 800);
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

  const handleSave = () => {
    setUserData(editForm);
    setEditing(false);
    setSnackbar({
      open: true,
      message: 'Perfil actualizado correctamente',
      severity: 'success'
    });
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
                  {userData.nombre}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Perfil Verificado"
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<HomeIcon />}
                    label={userData.unidad}
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
                      {userData.nombre.charAt(0)}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
                      {userData.nombre}
                    </Typography>
                    <InfoChip
                      icon={<CheckCircleIcon />}
                      label={userData.tipoUsuario}
                      chipcolor={colors.success}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    {/* Código QR simulado */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha(colors.primary, 0.02),
                        borderRadius: 3,
                        border: `1px dashed ${alpha(colors.primary, 0.3)}`,
                        width: '100%',
                        textAlign: 'center',
                        mb: 2,
                      }}
                    >
                      <QrCodeIcon sx={{ fontSize: 60, color: colors.primary, mb: 1 }} />
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Código de acceso
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
                        {userData.codigoAcceso}
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List sx={{ width: '100%' }}>
                    {[
                      { icon: <HomeIcon />, primary: 'Unidad', secondary: userData.unidad },
                      { icon: <BadgeIcon />, primary: 'RUT', secondary: userData.rut },
                      { icon: <CalendarIcon />, primary: 'Fecha de ingreso', secondary: userData.fechaIngreso },
                      { icon: <KeyIcon />, primary: 'Parqueadero', secondary: userData.espacioParqueadero },
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
                </CardContent>
              </GlassCard>
            </Zoom>

            {/* Tarjeta de información adicional mejorada */}
            <Zoom in timeout={400}>
              <GlassCard sx={{ mt: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: colors.primary, fontWeight: 700, mb: 2 }}>
                    Información del Hogar
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { icon: <PersonIcon />, label: 'Habitantes', value: userData.numHabitantes, color: colors.info },
                      { icon: <PetsIcon />, label: 'Mascotas', value: userData.mascotas, color: colors.success },
                      { icon: <DirectionsCarIcon />, label: 'Vehículos', value: userData.vehiculos, color: colors.warning },
                      { icon: <SecurityIcon />, label: 'Seguridad', value: '24/7', color: colors.primary },
                    ].map((item, index) => (
                      <Grid item xs={6} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(item.color, 0.05),
                            borderRadius: 3,
                            border: `1px solid ${alpha(item.color, 0.2)}`,
                            textAlign: 'center',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            },
                          }}
                          onMouseEnter={() => setHoveredCard(index)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha(item.color, 0.1),
                              color: item.color,
                              width: 40,
                              height: 40,
                              margin: '0 auto 8px',
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Typography variant="h6" sx={{ color: item.color, fontWeight: 700 }}>
                            {item.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {item.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
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
                        bgcolor={colors.primary}
                      >
                        Editar Perfil
                      </GradientButton>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Guardar cambios">
                          <IconButton 
                            onClick={handleSave}
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
                        label="Nombre completo"
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
                        label="Email"
                        name="email"
                        value={editing ? editForm.email : userData.email}
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
                        label="Teléfono de emergencia"
                        name="telefonoEmergencia"
                        value={editing ? editForm.telefonoEmergencia : userData.telefonoEmergencia}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: { 
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                          },
                          startAdornment: <PhoneInTalkIcon sx={{ mr: 1, color: colors.text.disabled, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contacto de emergencia"
                        name="emergenciaContacto"
                        value={editing ? editForm.emergenciaContacto : userData.emergenciaContacto}
                        onChange={handleInputChange}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          sx: { 
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.02),
                          },
                        }}
                      />
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