import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Fade,
  Zoom,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  MoreHoriz as MoreHorizIcon,
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

const slideIn = {
  animation: 'slideIn 0.4s ease-out',
  '@keyframes slideIn': {
    from: { transform: 'translateX(-10px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
};

const pulse = {
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.7 },
    '100%': { opacity: 1 },
  },
};

// Componentes estilizados
const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(colors.surface, 0.95)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(colors.border, 0.5)}`,
  borderRadius: 16,
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

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  backgroundColor: alpha(statuscolor, 0.1),
  color: statuscolor,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  border: `1px solid ${alpha(statuscolor, 0.2)}`,
  '& .MuiChip-icon': {
    color: statuscolor,
  },
}));

const StatCard = ({ icon, title, value, subtitle, color, delay = 0 }) => (
  <Zoom in timeout={300} style={{ transitionDelay: `${delay}ms` }}>
    <GlassCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 48,
              height: 48,
              borderRadius: 3,
            }}
          >
            {icon}
          </Avatar>
          <MoreHorizIcon sx={{ color: colors.text.disabled, fontSize: 20 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: color, mt: 1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </GlassCard>
  </Zoom>
);

const MyPays = () => {
  const [loading, setLoading] = useState(true);
  const [openPagoDialog, setOpenPagoDialog] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const [pagos, setPagos] = useState([
    {
      id: 1,
      periodo: 'Marzo 2026',
      fechaVencimiento: '2026-03-10',
      monto: 85000,
      estado: 'pagado',
      fechaPago: '2026-03-05',
      metodoPago: 'Transferencia',
      comprobante: 'COMP-001-2026',
      concepto: 'Gastos comunes + Fondo de reserva',
    },
    {
      id: 2,
      periodo: 'Febrero 2026',
      fechaVencimiento: '2026-02-10',
      monto: 85000,
      estado: 'pagado',
      fechaPago: '2026-02-08',
      metodoPago: 'Webpay',
      comprobante: 'COMP-002-2026',
      concepto: 'Gastos comunes',
    },
    {
      id: 3,
      periodo: 'Enero 2026',
      fechaVencimiento: '2026-01-10',
      monto: 85000,
      estado: 'pagado',
      fechaPago: '2026-01-07',
      metodoPago: 'Efectivo',
      comprobante: 'COMP-003-2026',
      concepto: 'Gastos comunes',
    },
    {
      id: 4,
      periodo: 'Abril 2026',
      fechaVencimiento: '2026-04-10',
      monto: 87000,
      estado: 'pendiente',
      fechaPago: null,
      metodoPago: null,
      comprobante: null,
      concepto: 'Gastos comunes',
    },
    {
      id: 5,
      periodo: 'Diciembre 2025',
      fechaVencimiento: '2025-12-10',
      monto: 82000,
      estado: 'atrasado',
      fechaPago: '2025-12-20',
      metodoPago: 'Transferencia',
      comprobante: 'COMP-004-2025',
      concepto: 'Gastos comunes + Intereses',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const calcularEstadisticas = () => {
    const pagados = pagos.filter(p => p.estado === 'pagado');
    const pendientes = pagos.filter(p => p.estado === 'pendiente');
    const atrasados = pagos.filter(p => p.estado === 'atrasado');
    
    const totalPagado = pagados.reduce((sum, p) => sum + p.monto, 0);
    const totalPendiente = [...pendientes, ...atrasados].reduce((sum, p) => sum + p.monto, 0);
    
    return {
      pagados: pagados.length,
      pendientes: pendientes.length,
      atrasados: atrasados.length,
      totalPagado,
      totalPendiente,
      pagoPromedio: pagados.length ? Math.round(totalPagado / pagados.length) : 0,
    };
  };

  const stats = calcularEstadisticas();

  const getEstadoConfig = (estado) => {
    const config = {
      pagado: { 
        label: 'Pagado', 
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        color: colors.success,
      },
      pendiente: { 
        label: 'Pendiente', 
        icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
        color: colors.warning,
      },
      atrasado: { 
        label: 'Atrasado', 
        icon: <ErrorOutlineIcon sx={{ fontSize: 16 }} />,
        color: colors.error,
      }
    };
    return config[estado] || config.pendiente;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDiasRestantes = (fechaVencimiento) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pagosFiltrados = filterEstado === 'todos' 
    ? pagos 
    : pagos.filter(p => p.estado === filterEstado);

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
        <Box sx={{ ...pulse, textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 60, color: colors.primary, mb: 2 }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            Cargando tus pagos
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
      <Container maxWidth="xl">
        {/* Header con bienvenida */}
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
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                Panel de Pagos
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Mis Pagos
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 600 }}>
                Gestiona y visualiza todos tus pagos de gastos comunes en un solo lugar.
                Mantén tu historial al día y evita intereses por mora.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Filtros rápidos */}
        <Box sx={{ ...slideIn, mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: colors.surface,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant={filterEstado === 'todos' ? 'contained' : 'text'}
              onClick={() => setFilterEstado('todos')}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                backgroundColor: filterEstado === 'todos' ? colors.primary : 'transparent',
                color: filterEstado === 'todos' ? 'white' : colors.text.secondary,
                '&:hover': {
                  backgroundColor: filterEstado === 'todos' ? colors.secondary : alpha(colors.primary, 0.05),
                },
              }}
            >
              Todos los pagos
            </Button>
            <Button
              variant={filterEstado === 'pagado' ? 'contained' : 'text'}
              onClick={() => setFilterEstado('pagado')}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                backgroundColor: filterEstado === 'pagado' ? colors.success : 'transparent',
                color: filterEstado === 'pagado' ? 'white' : colors.text.secondary,
                '&:hover': {
                  backgroundColor: filterEstado === 'pagado' ? colors.success : alpha(colors.success, 0.05),
                },
              }}
            >
              Pagados
            </Button>
            <Button
              variant={filterEstado === 'pendiente' ? 'contained' : 'text'}
              onClick={() => setFilterEstado('pendiente')}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                backgroundColor: filterEstado === 'pendiente' ? colors.warning : 'transparent',
                color: filterEstado === 'pendiente' ? 'white' : colors.text.secondary,
                '&:hover': {
                  backgroundColor: filterEstado === 'pendiente' ? colors.warning : alpha(colors.warning, 0.05),
                },
              }}
            >
              Pendientes
            </Button>
            <Button
              variant={filterEstado === 'atrasado' ? 'contained' : 'text'}
              onClick={() => setFilterEstado('atrasado')}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                backgroundColor: filterEstado === 'atrasado' ? colors.error : 'transparent',
                color: filterEstado === 'atrasado' ? 'white' : colors.text.secondary,
                '&:hover': {
                  backgroundColor: filterEstado === 'atrasado' ? colors.error : alpha(colors.error, 0.05),
                },
              }}
            >
              Atrasados
            </Button>
          </Paper>
        </Box>

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AccountBalanceIcon />}
              title="Total Pagado"
              value={`$${stats.totalPagado.toLocaleString()}`}
              subtitle={`${stats.pagados} pagos completados`}
              color={colors.success}
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ScheduleIcon />}
              title="Por Pagar"
              value={`$${stats.totalPendiente.toLocaleString()}`}
              subtitle={`${stats.pendientes + stats.atrasados} pendientes`}
              color={colors.warning}
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrendingUpIcon />}
              title="Pago Promedio"
              value={`$${stats.pagoPromedio.toLocaleString()}`}
              subtitle="Últimos 3 meses"
              color={colors.info}
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircleOutlineIcon />}
              title="Pagos Puntuales"
              value={stats.pagados - stats.atrasados}
              subtitle={`${stats.atrasados} atrasados`}
              color={colors.primary}
              delay={300}
            />
          </Grid>
        </Grid>

        {/* Tabla de pagos */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: colors.surface,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
            ...fadeIn,
          }}
        >
          <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border}` }}>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 700 }}>
              Historial de Pagos
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
              {pagosFiltrados.length} registros encontrados
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.02) }}>
                  <TableCell><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Período</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Vencimiento</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Monto</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Estado</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Fecha Pago</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Método</Typography></TableCell>
                  <TableCell align="center"><Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600 }}>Acciones</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagosFiltrados.map((pago, index) => {
                  const estado = getEstadoConfig(pago.estado);
                  const diasRestantes = pago.estado === 'pendiente' ? getDiasRestantes(pago.fechaVencimiento) : null;
                  
                  return (
                    <TableRow
                      key={pago.id}
                      hover
                      onMouseEnter={() => setHoveredRow(pago.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      sx={{
                        transition: 'all 0.2s ease',
                        backgroundColor: hoveredRow === pago.id ? alpha(colors.primary, 0.02) : 'transparent',
                        ...slideIn,
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {pago.periodo}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {pago.concepto}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                          <Typography variant="body2">
                            {formatDate(pago.fechaVencimiento)}
                          </Typography>
                        </Box>
                        {diasRestantes && (
                          <Typography variant="caption" sx={{ color: colors.warning }}>
                            {diasRestantes} días restantes
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 700, color: colors.text.primary }}>
                          ${pago.monto.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          icon={estado.icon}
                          label={estado.label}
                          statuscolor={estado.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {pago.fechaPago ? (
                          <Typography variant="body2">
                            {formatDate(pago.fechaPago)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                            Pendiente
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {pago.metodoPago ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {pago.metodoPago === 'Webpay' ? <CreditCardIcon sx={{ fontSize: 16, color: colors.text.secondary }} /> : null}
                            <Typography variant="body2">{pago.metodoPago}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalle" arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedPago(pago);
                              setOpenPagoDialog(true);
                            }}
                            sx={{
                              color: colors.primary,
                              transition: 'all 0.2s ease',
                              transform: hoveredRow === pago.id ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {pago.estado === 'pagado' && (
                          <Tooltip title="Descargar comprobante" arrow>
                            <IconButton
                              size="small"
                              sx={{
                                color: colors.success,
                                transition: 'all 0.2s ease',
                                transform: hoveredRow === pago.id ? 'scale(1.1)' : 'scale(1)',
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {pago.estado !== 'pagado' && (
                          <Tooltip title="Pagar ahora" arrow>
                            <GradientButton
                              size="small"
                              startIcon={<PaymentIcon />}
                              onClick={() => {
                                setSelectedPago(pago);
                                setOpenPagoDialog(true);
                              }}
                              sx={{ ml: 1, py: 0.5, px: 2 }}
                            >
                              Pagar
                            </GradientButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {pagosFiltrados.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ReceiptIcon sx={{ fontSize: 60, color: colors.text.disabled, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                No hay pagos para mostrar
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.disabled, mt: 1 }}>
                Prueba con otros filtros
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Dialog de detalle */}
        <Dialog
          open={openPagoDialog}
          onClose={() => setOpenPagoDialog(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
            },
          }}
        >
          {selectedPago && (
            <>
              <DialogTitle sx={{ 
                bgcolor: colors.primary,
                color: 'white',
                py: 3,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Detalle de Pago</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {selectedPago.periodo}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha(colors.primary, 0.02),
                        borderRadius: 2,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {selectedPago.estado === 'pagado' ? (
                          <CheckCircleIcon sx={{ color: colors.success, fontSize: 40 }} />
                        ) : selectedPago.estado === 'pendiente' ? (
                          <ScheduleIcon sx={{ color: colors.warning, fontSize: 40 }} />
                        ) : (
                          <ErrorOutlineIcon sx={{ color: colors.error, fontSize: 40 }} />
                        )}
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {selectedPago.estado === 'pagado' && '¡Pago realizado con éxito!'}
                            {selectedPago.estado === 'pendiente' && 'Pago pendiente'}
                            {selectedPago.estado === 'atrasado' && 'Pago atrasado'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {selectedPago.concepto}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
                      Información General
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          Período
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedPago.periodo}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          Vencimiento
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDate(selectedPago.fechaVencimiento)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          Monto
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 700 }}>
                          ${selectedPago.monto.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          Estado
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <StatusChip
                            icon={getEstadoConfig(selectedPago.estado).icon}
                            label={getEstadoConfig(selectedPago.estado).label}
                            statuscolor={getEstadoConfig(selectedPago.estado).color}
                            size="small"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {selectedPago.estado === 'pagado' && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
                        Detalles del Pago
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(colors.success, 0.02),
                          borderRadius: 2,
                          border: `1px solid ${alpha(colors.success, 0.2)}`,
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              Fecha de pago
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {formatDate(selectedPago.fechaPago)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              Método de pago
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {selectedPago.metodoPago}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              Comprobante
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {selectedPago.comprobante}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {selectedPago.estado !== 'pagado' && (
                    <Grid item xs={12}>
                      <Alert
                        severity={selectedPago.estado === 'pendiente' ? 'warning' : 'error'}
                        sx={{
                          borderRadius: 2,
                          '& .MuiAlert-icon': {
                            color: selectedPago.estado === 'pendiente' ? colors.warning : colors.error,
                          },
                        }}
                      >
                        {selectedPago.estado === 'pendiente' 
                          ? 'Realiza tu pago antes de la fecha de vencimiento para evitar intereses.'
                          : 'Tu pago está atrasado. Realiza el pago lo antes posible para regularizar tu situación.'}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3, bgcolor: alpha(colors.primary, 0.02) }}>
                <Button
                  onClick={() => setOpenPagoDialog(false)}
                  variant="outlined"
                  sx={{
                    borderColor: colors.border,
                    color: colors.text.primary,
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Cerrar
                </Button>
                {selectedPago.estado !== 'pagado' && (
                  <GradientButton
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => setOpenPagoDialog(false)}
                    sx={{ px: 4 }}
                  >
                    Pagar ahora
                  </GradientButton>
                )}
                {selectedPago.estado === 'pagado' && (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{
                      bgcolor: colors.success,
                      '&:hover': { bgcolor: alpha(colors.success, 0.9) },
                      borderRadius: 2,
                      px: 4,
                    }}
                  >
                    Descargar
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyPays;