import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  LinearProgress,
  Container,
  Paper,
  Tooltip,
  Zoom,
  Fade,
  Divider,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  AssignmentInd as IdIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

// Colores personalizados
const colors = {
  primary: '#1e3a5f',
  secondary: '#2a4a7a',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316',
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
const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(colors.surface, 0.95)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(colors.border, 0.5)}`,
  borderRadius: 20,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
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
  padding: '8px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: `0 4px 10px ${alpha(bgcolor, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(bgcolor, 0.4)}`,
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  color: 'white',
  width: 60,
  height: 60,
  boxShadow: `0 8px 16px ${alpha(colors.primary, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(90deg)',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    boxShadow: `0 12px 24px ${alpha(colors.primary, 0.4)}`,
  },
}));

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    cargos: [],
  });

  const mockEmpleados = [
    {
      idEmpleado: 1,
      nombre: 'Carlos',
      apellido: 'Ramírez',
      cargo: 'Administrador',
      documento: '1023456789',
      telefono: '3001234567',
      email: 'carlos.ramirez@condominio.com',
      fechaContratacion: '2023-01-15',
      estado: 'Activo',
      horario: 'Lun-Vie 8:00-17:00',
    },
    {
      idEmpleado: 2,
      nombre: 'Laura',
      apellido: 'Gómez',
      cargo: 'Contadora',
      documento: '1019876543',
      telefono: '3104567890',
      email: 'laura.gomez@condominio.com',
      fechaContratacion: '2022-09-10',
      estado: 'Activo',
      horario: 'Lun-Vie 9:00-18:00',
    },
    {
      idEmpleado: 3,
      nombre: 'Miguel',
      apellido: 'Torres',
      cargo: 'Vigilante',
      documento: '1004567891',
      telefono: '3209876543',
      email: 'miguel.torres@condominio.com',
      fechaContratacion: '2024-03-01',
      estado: 'Activo',
      horario: 'Turnos rotativos',
    },
    {
      idEmpleado: 4,
      nombre: 'Ana',
      apellido: 'Martínez',
      cargo: 'Aseo',
      documento: '1034567890',
      telefono: '3012345678',
      email: 'ana.martinez@condominio.com',
      fechaContratacion: '2023-06-20',
      estado: 'Activo',
      horario: 'Lun-Sab 6:00-14:00',
    },
    {
      idEmpleado: 5,
      nombre: 'Pedro',
      apellido: 'Sánchez',
      cargo: 'Jardinero',
      documento: '1045678901',
      telefono: '3023456789',
      email: 'pedro.sanchez@condominio.com',
      fechaContratacion: '2023-11-05',
      estado: 'Activo',
      horario: 'Lun-Vie 7:00-15:00',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setEmpleados(mockEmpleados);
      
      // Calcular estadísticas
      const cargosCount = mockEmpleados.reduce((acc, emp) => {
        acc[emp.cargo] = (acc[emp.cargo] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        total: mockEmpleados.length,
        cargos: Object.entries(cargosCount).map(([cargo, count]) => ({ cargo, count })),
      });
      
      setLoading(false);
    }, 800);
  }, []);

  const handleMenuOpen = (event, empleado) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmpleado(empleado);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmpleado(null);
  };

  const handleOpenDialog = (empleado = null) => {
    setSelectedEmpleado(empleado);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmpleado(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getCargoColor = (cargo) => {
    switch(cargo) {
      case 'Administrador': return colors.purple;
      case 'Contadora': return colors.info;
      case 'Vigilante': return colors.success;
      case 'Aseo': return colors.warning;
      case 'Jardinero': return colors.orange;
      default: return colors.primary;
    }
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
          <GroupIcon sx={{ fontSize: 60, color: colors.primary, mb: 2, animation: 'pulse 2s infinite' }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            Cargando empleados
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
            Obteniendo información del personal
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
                <BadgeIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Gestión de Empleados
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Administra el personal del condominio
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                icon={<GroupIcon />}
                label={`${stats.total} empleados`}
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Estadísticas rápidas */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.cargos.map((item, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha(getCargoColor(item.cargo), 0.05),
                    border: `1px solid ${alpha(getCargoColor(item.cargo), 0.2)}`,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: getCargoColor(item.cargo), fontWeight: 700 }}>
                    {item.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    {item.cargo}
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Grid de empleados */}
        <Grid container spacing={3}>
          {empleados.map((emp, index) => {
            const cargoColor = getCargoColor(emp.cargo);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={emp.idEmpleado}>
                <Zoom in timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
                  <GlassCard
                    onMouseEnter={() => setHoveredCard(emp.idEmpleado)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header con avatar y menú */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: alpha(cargoColor, 0.1),
                              color: cargoColor,
                              fontSize: '1.8rem',
                              fontWeight: 600,
                              border: `2px solid ${alpha(cargoColor, 0.3)}`,
                              transition: 'transform 0.3s ease',
                              transform: hoveredCard === emp.idEmpleado ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            {emp.nombre[0]}{emp.apellido[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                              {emp.nombre} {emp.apellido}
                            </Typography>
                            <Chip
                              icon={<WorkIcon sx={{ fontSize: 14 }} />}
                              label={emp.cargo}
                              size="small"
                              sx={{
                                backgroundColor: alpha(cargoColor, 0.1),
                                color: cargoColor,
                                border: `1px solid ${alpha(cargoColor, 0.2)}`,
                                fontWeight: 600,
                                mt: 0.5,
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Tooltip title="Opciones">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, emp)}
                            sx={{
                              color: colors.text.secondary,
                              '&:hover': { backgroundColor: alpha(colors.primary, 0.05) },
                            }}
                          >
                            <MoreIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Información del empleado */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IdIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Documento:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                            {emp.documento}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Teléfono:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                            {emp.telefono}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary, flexShrink: 0 }}>
                            Email:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: '0.8rem' }}>
                            {emp.email}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Contratación:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                            {formatDate(emp.fechaContratacion)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Horario:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                            {emp.horario}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Estado */}
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={emp.estado}
                          size="small"
                          sx={{
                            backgroundColor: alpha(colors.success, 0.1),
                            color: colors.success,
                            '& .MuiChip-icon': { color: colors.success },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Zoom>
              </Grid>
            );
          })}
        </Grid>

        {/* FAB para agregar */}
        <Tooltip title="Agregar empleado" placement="left">
          <StyledFab
            onClick={() => handleOpenDialog()}
            sx={{ position: 'fixed', bottom: 30, right: 30 }}
          >
            <AddIcon />
          </StyledFab>
        </Tooltip>

        {/* Menú flotante */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: `0 10px 30px ${alpha(colors.primary, 0.2)}`,
              border: `1px solid ${alpha(colors.border, 0.5)}`,
            },
          }}
        >
          <MenuItem onClick={() => handleOpenDialog(selectedEmpleado)} sx={{ py: 1.5 }}>
            <EditIcon sx={{ mr: 1.5, fontSize: 20, color: colors.info }} /> Editar
          </MenuItem>
          <MenuItem sx={{ py: 1.5 }}>
            <DeleteIcon sx={{ mr: 1.5, fontSize: 20, color: colors.error }} /> Eliminar
          </MenuItem>
        </Menu>

        {/* Diálogo para crear/editar */}
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
              {selectedEmpleado ? <EditIcon /> : <AddIcon />}
              <Typography variant="h6">
                {selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  defaultValue={selectedEmpleado?.nombre || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  defaultValue={selectedEmpleado?.apellido || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  defaultValue={selectedEmpleado?.cargo || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Documento"
                  defaultValue={selectedEmpleado?.documento || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IdIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  defaultValue={selectedEmpleado?.telefono || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={selectedEmpleado?.email || ''}
                  type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Horario"
                  defaultValue={selectedEmpleado?.horario || ''}
                  placeholder="Ej: Lun-Vie 8:00-17:00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: alpha(colors.primary, 0.02) }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              startIcon={<CancelIcon />}
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
              startIcon={selectedEmpleado ? <SaveIcon /> : <AddIcon />}
              bgcolor={colors.primary}
            >
              {selectedEmpleado ? 'Actualizar' : 'Guardar'}
            </GradientButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Empleados;