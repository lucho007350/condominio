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
  Alert,
  Snackbar,
  CircularProgress,
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
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Group as GroupIcon,
  MonetizationOn as MoneyIcon,
} from '@mui/icons-material';
import { empleadosAPI } from '../services/api.jsx';

const emptyForm = {
  nombre: '',
  apellido: '',
  cargo: '',
  documento: '',
  telefono: '',
  fechaContratacion: '',
  salario: '',
};

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
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    cargos: [],
  });

  const normalizeEmpleado = (emp) => ({
    ...emp,
    estado: emp.estado ?? 'Activo',
  });

  const buildStats = (list) => {
    const cargosCount = list.reduce((acc, emp) => {
      const cargo = emp.cargo ?? 'Sin cargo';
      acc[cargo] = (acc[cargo] || 0) + 1;
      return acc;
    }, {});

    return {
      total: list.length,
      cargos: Object.entries(cargosCount).map(([cargo, count]) => ({ cargo, count })),
    };
  };

  const toDateInputValue = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    let cancelled = false;

    const loadEmpleados = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await empleadosAPI.getAll();
        const data = response?.data;
        const list = Array.isArray(data) ? data : [];
        const normalized = list.map(normalizeEmpleado);

        if (!cancelled) {
          setEmpleados(normalized);
          setStats(buildStats(normalized));
        }
      } catch (err) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Error al cargar empleados';
        if (!cancelled) {
          setError(msg);
          setEmpleados([]);
          setStats({ total: 0, cargos: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEmpleados();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMenuOpen = (event, empleado) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmpleado(empleado);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (empleado = null) => {
    setSelectedEmpleado(empleado);
    setForm(
      empleado
        ? {
            nombre: empleado.nombre ?? '',
            apellido: empleado.apellido ?? '',
            cargo: empleado.cargo ?? '',
            documento: empleado.documento ?? '',
            telefono: empleado.telefono ?? '',
            fechaContratacion: toDateInputValue(empleado.fechaContratacion),
            salario: empleado.salario ?? '',
          }
        : emptyForm
    );
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmpleado(null);
    setForm(emptyForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEmpleado = async () => {
    if (!form.nombre.trim() || !form.apellido.trim() || !form.cargo.trim() || !form.documento.trim() || !form.telefono.trim() || !form.fechaContratacion || form.salario === '') {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Completa todos los campos obligatorios',
      });
      return;
    }

    const salarioNum = Number(form.salario);
    if (Number.isNaN(salarioNum) || salarioNum < 0) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'El salario debe ser un numero valido',
      });
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      cargo: form.cargo.trim(),
      documento: form.documento.trim(),
      telefono: form.telefono.trim(),
      fechaContratacion: form.fechaContratacion,
      salario: salarioNum,
    };

    setSaving(true);
    setError(null);

    try {
      if (selectedEmpleado?.idEmpleado) {
        const response = await empleadosAPI.update(selectedEmpleado.idEmpleado, payload);
        const updated = normalizeEmpleado(response?.data ?? response ?? payload);

        setEmpleados((prev) => {
          const next = prev.map((emp) =>
            emp.idEmpleado === selectedEmpleado.idEmpleado ? updated : emp
          );
          setStats(buildStats(next));
          return next;
        });

        setSnackbar({ open: true, message: 'Empleado actualizado correctamente', severity: 'success' });
      } else {
        const response = await empleadosAPI.create(payload);
        const created = normalizeEmpleado(response?.data ?? response ?? payload);

        setEmpleados((prev) => {
          const next = [created, ...prev];
          setStats(buildStats(next));
          return next;
        });

        setSnackbar({ open: true, message: 'Empleado creado correctamente', severity: 'success' });
      }

      handleCloseDialog();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al guardar empleado';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteConfirm = (empleado) => {
    setEmpleadoToDelete(empleado);
    setOpenDeleteConfirm(true);
    handleMenuClose();
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setEmpleadoToDelete(null);
  };

  const handleDeleteEmpleado = async () => {
    if (!empleadoToDelete?.idEmpleado) return;

    setSaving(true);
    setError(null);

    try {
      await empleadosAPI.delete(empleadoToDelete.idEmpleado);

      setEmpleados((prev) => {
        const next = prev.filter((emp) => emp.idEmpleado !== empleadoToDelete.idEmpleado);
        setStats(buildStats(next));
        return next;
      });

      setSnackbar({ open: true, message: 'Empleado eliminado correctamente', severity: 'success' });
      handleCloseDeleteConfirm();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al eliminar empleado';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No registrada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) return 'No registrada';
    return parsedDate.toLocaleDateString('es-ES', options);
  };

  const formatCurrency = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return 'No registrado';
    return amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    });
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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

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
              <Grid item xs={12} sm={6} md={4} key={emp.idEmpleado ?? index}>
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
                             {(emp.nombre?.[0] ?? '?')}{(emp.apellido?.[0] ?? '')}
                           </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                              {emp.nombre ?? 'Sin nombre'} {emp.apellido ?? ''}
                            </Typography>
                            <Chip
                              icon={<WorkIcon sx={{ fontSize: 14 }} />}
                               label={emp.cargo ?? 'Sin cargo'}
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
                          <CalendarIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Contratación:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                            {formatDate(emp.fechaContratacion)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MoneyIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Salario:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                            {formatCurrency(emp.salario)}
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
          <MenuItem onClick={() => handleOpenDeleteConfirm(selectedEmpleado)} sx={{ py: 1.5 }}>
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
                  name="nombre"
                  label="Nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
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
                  name="apellido"
                  label="Apellido"
                  value={form.apellido}
                  onChange={handleInputChange}
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
                  name="cargo"
                  label="Cargo"
                  value={form.cargo}
                  onChange={handleInputChange}
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
                  name="documento"
                  label="Documento"
                  value={form.documento}
                  onChange={handleInputChange}
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
                  name="telefono"
                  label="Teléfono"
                  value={form.telefono}
                  onChange={handleInputChange}
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
                  name="fechaContratacion"
                  label="Fecha de contratación"
                  type="date"
                  value={form.fechaContratacion}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon sx={{ color: colors.text.secondary }} />
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
                  name="salario"
                  label="Salario"
                  type="number"
                  value={form.salario}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon sx={{ color: colors.text.secondary }} />
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
              onClick={handleSaveEmpleado}
              startIcon={selectedEmpleado ? <SaveIcon /> : <AddIcon />}
              bgcolor={colors.primary}
              disabled={saving}
            >
              {saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : (selectedEmpleado ? 'Actualizar' : 'Guardar')}
            </GradientButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteConfirm}
          onClose={handleCloseDeleteConfirm}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Eliminar empleado</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              {`¿Seguro que deseas eliminar a ${empleadoToDelete?.nombre ?? ''} ${empleadoToDelete?.apellido ?? ''}?`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDeleteConfirm} disabled={saving}>Cancelar</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteEmpleado}
              disabled={saving}
              startIcon={<DeleteIcon />}
            >
              {saving ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Empleados;
