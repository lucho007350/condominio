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
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
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
  Close as CloseIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  PhoneIphone as PhoneIphoneIcon,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Bancos de Colombia para simulación
const bancosColombia = [
  { id: 'bancolombia', name: 'Bancolombia', icon: '🏦', color: '#004481' },
  { id: 'davivienda', name: 'Davivienda', icon: '🏛️', color: '#003366' },
  { id: 'bbva', name: 'BBVA Colombia', icon: '🌐', color: '#004481' },
  { id: 'occidente', name: 'Banco de Occidente', icon: '🏦', color: '#003366' },
  { id: 'popular', name: 'Banco Popular', icon: '⭐', color: '#004481' },
  { id: 'cajaSocial', name: 'Caja Social', icon: '🤝', color: '#006633' },
];

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

const BankCard = styled(Paper)(({ selected, bankcolor }) => ({
  padding: '16px',
  cursor: 'pointer',
  borderRadius: 12,
  border: selected ? `2px solid ${bankcolor}` : `1px solid ${colors.border}`,
  backgroundColor: selected ? alpha(bankcolor, 0.05) : colors.surface,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
}));

// Función para generar PDF
const generarComprobantePDF = (pago) => {
  const doc = new jsPDF();
  
  // Header con gradiente
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, doc.internal.pageSize.width, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPROBANTE DE PAGO', doc.internal.pageSize.width / 2, 28, { align: 'center' });
  
  // Información del comprobante
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° Comprobante: ${pago.comprobante || `COMP-${Date.now()}`}`, 20, 60);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 20, 67);
  doc.text(`Hora: ${new Date().toLocaleTimeString('es-CO')}`, 20, 74);
  
  // Línea separadora
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 85, doc.internal.pageSize.width - 20, 85);
  
  // Tabla de detalles
  autoTable(doc, {
    startY: 95,
    head: [['Concepto', 'Detalle']],
    body: [
      ['Período', pago.periodo],
      ['Fecha de vencimiento', new Date(pago.fechaVencimiento).toLocaleDateString('es-CO')],
      ['Concepto', pago.concepto],
      ['Método de pago', pago.metodoPago || 'Transferencia Bancaria'],
      ['Fecha de pago', new Date().toLocaleDateString('es-CO')],
      ['Estado', 'PAGADO'],
      ['Referencia', `REF-${Date.now()}`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [30, 58, 95],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' },
    },
  });
  
  const finalY = doc.lastAutoTable.finalY + 10;
  
  // Monto total
  doc.setFillColor(248, 250, 252);
  doc.rect(20, finalY, doc.internal.pageSize.width - 40, 30, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 95);
  doc.text('TOTAL PAGADO:', 30, finalY + 18);
  
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text(`$${pago.monto.toLocaleString()} COP`, doc.internal.pageSize.width - 40, finalY + 18, { align: 'right' });
  
  // Mensaje de confirmación
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Este documento certifica que el pago ha sido realizado exitosamente.', 20, finalY + 48);
  doc.text('Gracias por tu pago puntual.', 20, finalY + 55);
  
  // Código de verificación
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(doc.internal.pageSize.width - 55, finalY + 42, 35, 25, 3, 3);
  doc.setFontSize(7);
  doc.text('CÓDIGO', doc.internal.pageSize.width - 48, finalY + 55);
  doc.text('VERIFICACIÓN', doc.internal.pageSize.width - 52, finalY + 62);
  
  doc.save(`comprobante_${pago.periodo.replace(/\s/g, '_')}.pdf`);
};

const MyPays = () => {
  const [loading, setLoading] = useState(true);
  const [openPagoDialog, setOpenPagoDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Estados para la pasarela de pagos
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [selectedBank, setSelectedBank] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [pagos, setPagos] = useState([
    {
      id: 1,
      periodo: 'Marzo 2026',
      fechaVencimiento: '2026-03-10',
      monto: 85000,
      estado: 'pagado',
      fechaPago: '2026-03-05',
      metodoPago: 'Transferencia Bancolombia',
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
      metodoPago: 'Tarjeta de Crédito',
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

  const handleOpenPayment = (pago) => {
    setSelectedPago(pago);
    setActiveStep(0);
    setPaymentMethod('bank');
    setSelectedBank(null);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
    setPaymentSuccess(false);
    setOpenPaymentDialog(true);
  };

  const handleProcessPayment = () => {
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // Actualizar el pago
      const metodoTexto = paymentMethod === 'bank' ? `Transferencia - ${selectedBank?.name}` : 
                          paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'PSE';
      
      const pagoActualizado = {
        ...selectedPago,
        estado: 'pagado',
        fechaPago: new Date().toISOString().split('T')[0],
        metodoPago: metodoTexto,
        comprobante: `COMP-${Date.now()}`,
      };
      
      setPagos(pagos.map(p => p.id === selectedPago.id ? pagoActualizado : p));
      setSelectedPago(pagoActualizado);
      
      // Generar PDF automáticamente
      generarComprobantePDF(pagoActualizado);
      
      // Avanzar al paso de confirmación
      setActiveStep(2);
    }, 2000);
  };

  const handleDownloadPDF = (pago) => {
    generarComprobantePDF(pago);
  };

  const handleClosePaymentDialog = () => {
    if (!processing) {
      setOpenPaymentDialog(false);
      setActiveStep(0);
      setPaymentSuccess(false);
    }
  };

  const steps = ['Método de pago', 'Confirmar', 'Completado'];

  const isNextDisabled = () => {
    if (activeStep === 0) {
      if (paymentMethod === 'bank') return !selectedBank;
      if (paymentMethod === 'card') {
        return !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv;
      }
      return false;
    }
    return false;
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
              Selecciona tu método de pago
            </Typography>
            
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <Paper sx={{ mb: 2, p: 2, borderRadius: 2, border: `1px solid ${colors.border}` }}>
                <FormControlLabel
                  value="bank"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AccountBalanceIcon sx={{ color: colors.primary }} />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Transferencia Bancaria
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Desde cualquier banco de Colombia
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </Paper>
              
              <Paper sx={{ mb: 2, p: 2, borderRadius: 2, border: `1px solid ${colors.border}` }}>
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CreditCardIcon sx={{ color: colors.primary }} />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Tarjeta de Crédito/Débito
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Visa, Mastercard, American Express
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </Paper>
              
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.border}` }}>
                <FormControlLabel
                  value="pse"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIphoneIcon sx={{ color: colors.primary }} />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          PSE
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pago Seguro en Línea
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
            
            {paymentMethod === 'bank' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Selecciona tu banco
                </Typography>
                <Grid container spacing={2}>
                  {bancosColombia.map((banco) => (
                    <Grid item xs={6} sm={4} key={banco.id}>
                      <BankCard
                        selected={selectedBank?.id === banco.id}
                        bankcolor={banco.color}
                        onClick={() => setSelectedBank(banco)}
                        elevation={0}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ fontSize: 32, mb: 1 }}>
                            {banco.icon}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {banco.name}
                          </Typography>
                        </Box>
                      </BankCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {paymentMethod === 'card' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Datos de la tarjeta
                </Typography>
                <TextField
                  fullWidth
                  label="Número de tarjeta"
                  placeholder="**** **** **** ****"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Nombre del titular"
                  placeholder="Como aparece en la tarjeta"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Fecha expiración"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="***"
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            <Alert
              icon={<SecurityIcon fontSize="small" />}
              severity="info"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              <Typography variant="body2">
                Tu pago será procesado de forma segura.
              </Typography>

            </Alert>
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
              Confirma tu pago
            </Typography>
            
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha(colors.primary, 0.02) }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Período</Typography>
                <Typography variant="body2" fontWeight={500}>{selectedPago?.periodo}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Concepto</Typography>
                <Typography variant="body2" fontWeight={500}>{selectedPago?.concepto}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Método</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {paymentMethod === 'bank' ? selectedBank?.name : 
                   paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'PSE'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={600}>Total a pagar</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: colors.primary }}>
                  ${selectedPago?.monto.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
            
            <Alert
              severity="warning"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              Al hacer clic en "Pagar", se generará un comprobante PDF.
            </Alert>
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {processing ? (
              <Box>
                <CircularProgress sx={{ color: colors.primary, mb: 2 }} />
                <Typography variant="body1">Procesando tu pago...</Typography>
              </Box>
            ) : (
              <Fade in timeout={500}>
                <Box>
                  <CheckCircleIcon sx={{ fontSize: 80, color: colors.success, mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                    ¡Pago exitoso!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    El comprobante se ha descargado automáticamente
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: alpha(colors.success, 0.1), borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.success }}>
                      Comprobante: {selectedPago?.comprobante || `COMP-${Date.now()}`}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };

  const pagosFiltrados = filterEstado === 'todos' 
    ? pagos 
    : pagos.filter(p => p.estado === filterEstado);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <ReceiptIcon sx={{ fontSize: 60, color: colors.primary, mb: 2, animation: 'pulse 1.5s infinite' }} />
        <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
          Cargando tus pagos
        </Typography>
        <LinearProgress sx={{ width: 200, mt: 3, height: 4, borderRadius: 2, backgroundColor: alpha(colors.primary, 0.1), '& .MuiLinearProgress-bar': { backgroundColor: colors.primary } }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                Panel de Pagos
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Mis Pagos
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 600 }}>
                Gestiona y visualiza todos tus pagos de gastos comunes en un solo lugar.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Filtros */}
        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: colors.surface, border: `1px solid ${colors.border}`, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['todos', 'pagado', 'pendiente', 'atrasado'].map((filtro) => (
              <Button
                key={filtro}
                variant={filterEstado === filtro ? 'contained' : 'text'}
                onClick={() => setFilterEstado(filtro)}
                sx={{
                  borderRadius: 8,
                  px: 3,
                  py: 1,
                  backgroundColor: filterEstado === filtro ? 
                    (filtro === 'pagado' ? colors.success : filtro === 'pendiente' ? colors.warning : filtro === 'atrasado' ? colors.error : colors.primary) : 'transparent',
                  color: filterEstado === filtro ? 'white' : colors.text.secondary,
                }}
              >
                {filtro === 'todos' ? 'Todos' : filtro === 'pagado' ? 'Pagados' : filtro === 'pendiente' ? 'Pendientes' : 'Atrasados'}
              </Button>
            ))}
          </Paper>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
              <Avatar sx={{ bgcolor: alpha(colors.success, 0.1), color: colors.success, width: 48, height: 48, borderRadius: 3, mb: 2 }}>
                <AccountBalanceIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
                ${stats.totalPagado.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Pagado
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
              <Avatar sx={{ bgcolor: alpha(colors.warning, 0.1), color: colors.warning, width: 48, height: 48, borderRadius: 3, mb: 2 }}>
                <ScheduleIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
                ${stats.totalPendiente.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Por Pagar
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
              <Avatar sx={{ bgcolor: alpha(colors.info, 0.1), color: colors.info, width: 48, height: 48, borderRadius: 3, mb: 2 }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
                ${stats.pagoPromedio.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Pago Promedio
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
              <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary, width: 48, height: 48, borderRadius: 3, mb: 2 }}>
                <CheckCircleOutlineIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
                {stats.pagados}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Pagos Realizados
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabla de pagos */}
        <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: colors.surface, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
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
                  <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Período</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Vencimiento</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Monto</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Estado</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Fecha Pago</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Método</Typography></TableCell>
                  <TableCell align="center"><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Acciones</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagosFiltrados.map((pago) => {
                  const estado = getEstadoConfig(pago.estado);
                  
                  return (
                    <TableRow key={pago.id} hover onMouseEnter={() => setHoveredRow(pago.id)} onMouseLeave={() => setHoveredRow(null)}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{pago.periodo}</Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>{pago.concepto}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                          <Typography variant="body2">{formatDate(pago.fechaVencimiento)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>${pago.monto.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip icon={estado.icon} label={estado.label} statuscolor={estado.color} size="small" />
                      </TableCell>
                      <TableCell>
                        {pago.fechaPago ? formatDate(pago.fechaPago) : '-'}
                      </TableCell>
                      <TableCell>
                        {pago.metodoPago || '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalle" arrow>
                          <IconButton size="small" onClick={() => { setSelectedPago(pago); setOpenPagoDialog(true); }} sx={{ color: colors.primary }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {pago.estado === 'pagado' && (
                          <Tooltip title="Descargar comprobante" arrow>
                            <IconButton size="small" onClick={() => handleDownloadPDF(pago)} sx={{ color: colors.success }}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {pago.estado !== 'pagado' && (
                          <Tooltip title="Pagar ahora" arrow>
                            <GradientButton size="small" startIcon={<PaymentIcon />} onClick={() => handleOpenPayment(pago)} sx={{ ml: 1, py: 0.5, px: 2 }}>
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
        </Paper>

        {/* Diálogo de detalle */}
        <Dialog open={openPagoDialog} onClose={() => setOpenPagoDialog(false)} maxWidth="sm" fullWidth>
          {selectedPago && (
            <>
              <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><ReceiptIcon /></Avatar>
                  <Box>
                    <Typography variant="h6">Detalle de Pago</Typography>
                    <Typography variant="caption">{selectedPago.periodo}</Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: alpha(colors.primary, 0.02), borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {selectedPago.estado === 'pagado' ? <CheckCircleIcon sx={{ color: colors.success, fontSize: 40 }} /> :
                         selectedPago.estado === 'pendiente' ? <ScheduleIcon sx={{ color: colors.warning, fontSize: 40 }} /> :
                         <ErrorOutlineIcon sx={{ color: colors.error, fontSize: 40 }} />}
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {selectedPago.estado === 'pagado' ? '¡Pago realizado!' : selectedPago.estado === 'pendiente' ? 'Pago pendiente' : 'Pago atrasado'}
                          </Typography>
                          <Typography variant="caption">{selectedPago.concepto}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Información General</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}><Typography variant="caption">Período</Typography><Typography variant="body2" fontWeight={500}>{selectedPago.periodo}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption">Vencimiento</Typography><Typography variant="body2" fontWeight={500}>{formatDate(selectedPago.fechaVencimiento)}</Typography></Grid>
                      <Grid item xs={12}><Divider /></Grid>
                      <Grid item xs={6}><Typography variant="caption">Monto</Typography><Typography variant="h6" sx={{ color: colors.primary, fontWeight: 700 }}>${selectedPago.monto.toLocaleString()}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption">Estado</Typography><StatusChip icon={getEstadoConfig(selectedPago.estado).icon} label={getEstadoConfig(selectedPago.estado).label} statuscolor={getEstadoConfig(selectedPago.estado).color} size="small" sx={{ mt: 1 }} /></Grid>
                    </Grid>
                  </Grid>
                  {selectedPago.estado === 'pagado' && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Detalles del Pago</Typography>
                      <Paper sx={{ p: 2, bgcolor: alpha(colors.success, 0.02), borderRadius: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}><Typography variant="caption">Fecha de pago</Typography><Typography variant="body2">{formatDate(selectedPago.fechaPago)}</Typography></Grid>
                          <Grid item xs={6}><Typography variant="caption">Método de pago</Typography><Typography variant="body2">{selectedPago.metodoPago}</Typography></Grid>
                          <Grid item xs={12}><Typography variant="caption">Comprobante</Typography><Typography variant="body2">{selectedPago.comprobante}</Typography></Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenPagoDialog(false)} variant="outlined">Cerrar</Button>
                {selectedPago.estado !== 'pagado' && (
                  <GradientButton startIcon={<PaymentIcon />} onClick={() => { setOpenPagoDialog(false); handleOpenPayment(selectedPago); }}>Pagar ahora</GradientButton>
                )}
                {selectedPago.estado === 'pagado' && (
                  <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => handleDownloadPDF(selectedPago)} sx={{ bgcolor: colors.success }}>Descargar</Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Diálogo de pasarela de pagos */}
        <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: colors.primary, color: 'white', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LockIcon />
                <Typography variant="h6">Pasarela de Pagos</Typography>
              </Box>
              {!processing && (
                <IconButton onClick={handleClosePaymentDialog} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            <Stepper activeStep={activeStep} sx={{ p: 3, bgcolor: '#f8fafc' }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ p: 3 }}>
              {getStepContent()}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${colors.border}` }}>
            {activeStep === 1 && (
              <Button onClick={() => setActiveStep(0)} disabled={processing}>
                Atrás
              </Button>
            )}
            {activeStep === 0 && (
              <GradientButton onClick={() => setActiveStep(1)} disabled={isNextDisabled()}>
                Continuar
              </GradientButton>
            )}
            {activeStep === 1 && (
              <GradientButton onClick={handleProcessPayment} disabled={processing}>
                {processing ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Pagar ahora'}
              </GradientButton>
            )}
            {activeStep === 2 && !processing && (
              <GradientButton onClick={handleClosePaymentDialog}>
                Cerrar
              </GradientButton>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyPays;