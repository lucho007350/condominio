import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Fade,
  LinearProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DocumentScanner as DocumentIcon,
  CalendarToday as CalendarIcon,
  Apartment as ApartmentIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Lock as LockIcon,
  LocationCity as LocationCityIcon,
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

// Animaciones
const fadeIn = {
  animation: 'fadeIn 0.5s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const slideIn = {
  animation: 'slideIn 0.4s ease-out',
  '@keyframes slideIn': {
    from: { transform: 'translateX(-10px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
};

// Componentes estilizados
const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(colors.surface, 0.95)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(colors.border, 0.5)}`,
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const GradientButton = styled(Button)(({ bgcolor = colors.primary }) => ({
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.8)} 100%)`,
  color: 'white',
  borderRadius: 12,
  padding: '8px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: `0 4px 10px ${alpha(bgcolor, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(bgcolor, 0.4)}`,
  },
  '&:disabled': {
    background: alpha(colors.text.disabled, 0.5),
    transform: 'none',
  },
}));

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  backgroundColor: alpha(statuscolor, 0.1),
  color: statuscolor,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  border: `1px solid ${alpha(statuscolor, 0.2)}`,
}));

const steps = ['Datos Personales', 'Información del Condominio', 'Confirmación'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    documento: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    // Información del condominio
    condominio: '',
    zona: 'A',
    rol: 'residente',
    // Credenciales
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateStep0 = () => {
    if (!formData.nombre) return 'Nombre es requerido';
    if (!formData.apellido) return 'Apellido es requerido';
    if (!formData.documento) return 'Documento es requerido';
    if (!formData.email) return 'Email es requerido';
    if (!formData.email.includes('@')) return 'Email inválido';
    if (!formData.telefono) return 'Teléfono es requerido';
    if (!formData.fechaNacimiento) return 'Fecha de nacimiento es requerida';
    return null;
  };

  const validateStep1 = () => {
    if (!formData.condominio) return 'Nombre del condominio es requerido';
    if (!formData.zona) return 'Zona es requerida';
    if (!formData.password) return 'Contraseña es requerida';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  };

  const handleNext = () => {
    const errorMsg = activeStep === 0 ? validateStep0() : validateStep1();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Simular envío al backend
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          nombre: '',
          apellido: '',
          tipoDocumento: 'CC',
          documento: '',
          email: '',
          telefono: '',
          fechaNacimiento: '',
          condominio: '',
          zona: 'A',
          rol: 'residente',
          password: '',
          confirmPassword: '',
        });
        setActiveStep(0);
        setSuccess(false);
      }, 3000);
    }, 2000);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo Documento</InputLabel>
                  <Select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    label="Tipo Documento"
                  >
                    <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                    <MenuItem value="NIT">NIT</MenuItem>
                    <MenuItem value="PAS">Pasaporte</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Número de Documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DocumentIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Condominio"
                  name="condominio"
                  value={formData.condominio}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Zona</InputLabel>
                  <Select
                    name="zona"
                    value={formData.zona}
                    onChange={handleChange}
                    label="Zona"
                  >
                    <MenuItem value="A">Zona A</MenuItem>
                    <MenuItem value="B">Zona B</MenuItem>
                    <MenuItem value="C">Zona C</MenuItem>
                    <MenuItem value="D">Zona D</MenuItem>
                    <MenuItem value="Norte">Zona Norte</MenuItem>
                    <MenuItem value="Sur">Zona Sur</MenuItem>
                    <MenuItem value="Este">Zona Este</MenuItem>
                    <MenuItem value="Oeste">Zona Oeste</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    label="Rol"
                  >
                    <MenuItem value="residente">Residente</MenuItem>
                    <MenuItem value="propietario">Propietario</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Credenciales de Acceso" icon={<LockIcon />} />
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LinearProgress sx={{ mb: 2, height: 4, borderRadius: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Registrando usuario...
                </Typography>
              </Box>
            ) : success ? (
              <Fade in timeout={500}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 80, color: colors.success, mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                    ¡Registro Exitoso!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Se han enviado las credenciales al correo del usuario
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: alpha(colors.success, 0.1), borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.success }}>
                      Las credenciales han sido enviadas a: {formData.email}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
                  Resumen del Registro
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: alpha(colors.primary, 0.02), borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Datos Personales</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <StatusChip label={`${formData.nombre} ${formData.apellido}`} icon={<BadgeIcon />} statuscolor={colors.primary} />
                        <StatusChip label={formData.documento} icon={<DocumentIcon />} statuscolor={colors.primary} />
                        <StatusChip label={formData.email} icon={<EmailIcon />} statuscolor={colors.primary} />
                        <StatusChip label={formData.telefono} icon={<PhoneIcon />} statuscolor={colors.primary} />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: alpha(colors.info, 0.02), borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Información del Condominio</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <StatusChip label={formData.condominio} icon={<ApartmentIcon />} statuscolor={colors.info} />
                        <StatusChip label={`Zona ${formData.zona}`} icon={<LocationCityIcon />} statuscolor={colors.info} />
                        <StatusChip label={formData.rol === 'residente' ? 'Residente' : formData.rol === 'guardia' ? 'Guardia' : 'Administrador'} icon={<PeopleIcon />} statuscolor={colors.info} />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
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
            <Box sx={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                Administración
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Registrar Usuario
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 600 }}>
                Registra nuevos usuarios en el sistema. Se enviarán automáticamente las credenciales de acceso al correo proporcionado.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Stepper */}
        <Box sx={{ ...slideIn, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Formulario */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: colors.surface,
            border: `1px solid ${colors.border}`,
            p: 3,
            ...fadeIn,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          {getStepContent()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading || (activeStep === 2 && success)}
              sx={{
                borderColor: colors.border,
                color: colors.text.primary,
                borderRadius: 2,
                px: 4,
              }}
            >
              <ArrowBackIcon sx={{ mr: 1 }} /> Atrás
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <GradientButton
                onClick={handleSubmit}
                disabled={loading || success}
                startIcon={!loading && !success && <SendIcon />}
              >
                {loading ? 'Registrando...' : success ? 'Completado' : 'Registrar'}
              </GradientButton>
            ) : (
              <GradientButton onClick={handleNext}>
                Continuar
              </GradientButton>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;