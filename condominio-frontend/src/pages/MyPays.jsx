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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

import { authAPI, facturasAPI, paymentAPI, residentepagosAPI, residentesAPI } from '../services/api.jsx';

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
  const fmt = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('es-CO');
  };
  
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
      ['Fecha de vencimiento', fmt(pago.fechaVencimiento)],
      ['Concepto', pago.concepto],
      ['Método de pago', pago.metodoPago || 'Transferencia Bancaria'],
      ['Fecha de pago', fmt(pago.fechaPago)],
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
  const [loadError, setLoadError] = useState('');
  const [residentId, setResidentId] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidadId, setSelectedUnidadId] = useState('all');
  const [reloadTick, setReloadTick] = useState(0);
  const [openPagoDialog, setOpenPagoDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [roleBlocked, setRoleBlocked] = useState(false);
  
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
  
  const [pagos, setPagos] = useState([]);

  const safeParseUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const normalizeDateStr = (v) => {
    if (!v) return null;
    const s = String(v);
    return s.includes('T') ? s.split('T')[0] : s;
  };

  const monthYearEs = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : null;
    if (!d || Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setLoadError('');
      setRoleBlocked(false);
      setResidentId(null);
      setUnidades([]);
      try {
        const stored = safeParseUser();
        const role = String(stored?.role || '').toLowerCase();
        if (role === 'admin') {
          setRoleBlocked(true);
          setPagos([]);
          return;
        }

        let meUser = null;
        try {
          const me = await authAPI.me();
          meUser = me?.data?.user || null;
        } catch {
          // ignore
        }

        const idResidente = meUser?.idResidente || stored?.idResidente;
        if (!idResidente) {
          setLoadError('No se encontro el id del residente en la sesion. Vuelve a iniciar sesion.');
          setPagos([]);
          return;
        }

        setResidentId(idResidente);

        const [unidadesRes, rpRes, pagosRes, factRes] = await Promise.all([
          residentesAPI.getUnidades(idResidente),
          residentepagosAPI.getAll(),
          paymentAPI.getAll(),
          facturasAPI.getAll(),
        ]);

        const unidadesList = Array.isArray(unidadesRes?.data) ? unidadesRes.data : [];
        setUnidades(unidadesList);
        const unidadIds = new Set(unidadesList.map((u) => u?.idUnidad).filter(Boolean));

        const rps = Array.isArray(rpRes?.data) ? rpRes.data : [];
        const pagosDb = Array.isArray(pagosRes?.data) ? pagosRes.data : [];
        const facturasDb = Array.isArray(factRes?.data) ? factRes.data : [];

        const pagosById = new Map(pagosDb.map((p) => [p.idPago ?? p.id, p]));
        const factById = new Map(facturasDb.map((f) => [f.idFactura ?? f.id, f]));

        const rpsMine = rps.filter((rp) => String(rp?.idResidente) === String(idResidente));

        // Fallback: ultimo pago PROCESADO por factura (por si falta residente_pago)
        const latestPagoByFacturaId = new Map();
        for (const p of pagosDb) {
          const idFactura = p?.idFactura;
          const idPago = p?.idPago ?? p?.id;
          if (!idFactura || !idPago) continue;

          const estadoPago = String(p?.estadoPago || p?.estado || '').toLowerCase();
          if (estadoPago !== 'procesado') continue;

          const fechaPago = normalizeDateStr(p?.fechaPago);
          const prev = latestPagoByFacturaId.get(String(idFactura));
          if (!prev || String(fechaPago || '') > String(prev.fechaPago || '')) {
            latestPagoByFacturaId.set(String(idFactura), {
              idPago,
              fechaPago,
              metodoPago: p?.metodoPago || null,
            });
          }
        }

        const paidByFacturaId = new Map();
        for (const rp of rpsMine) {
          const idPago = rp?.idPago;
          const pagoDb = pagosById.get(idPago);
          const idFactura = pagoDb?.idFactura;
          if (!idFactura) continue;
          paidByFacturaId.set(String(idFactura), {
            rp,
            pagoDb,
            facturaDb: factById.get(idFactura) || null,
            idPago,
            fechaPago: normalizeDateStr(rp?.fechaPago || pagoDb?.fechaPago),
            metodoPago: rp?.metodoPago || pagoDb?.metodoPago || '—',
            montoPagado: Number(rp?.montoPagado ?? pagoDb?.monto ?? 0),
          });
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const estadoFacturaToEstado = (estadoFactura, fechaVenc) => {
          const e = String(estadoFactura || '').toLowerCase();
          if (e === 'pagada') return 'pagado';
          if (e === 'vencida') return 'atrasado';
          if (fechaVenc && String(fechaVenc) < todayStr) return 'atrasado';
          return 'pendiente';
        };

        const facturasMine = facturasDb.filter((f) => unidadIds.has(f?.idUnidad));

        const mine = facturasMine
          .map((facturaDb) => {
            const idFactura = facturaDb?.idFactura ?? facturaDb?.id;
            const fechaVencimiento = normalizeDateStr(facturaDb?.fechaVencimiento);
            const periodo = facturaDb?.fechaEmision
              ? monthYearEs(normalizeDateStr(facturaDb.fechaEmision))
              : '—';

            const paid = paidByFacturaId.get(String(idFactura));
            const monto = paid ? paid.montoPagado : Number(facturaDb?.monto ?? 0);

            const paidFallback = !paid ? latestPagoByFacturaId.get(String(idFactura)) : null;

            const estado = paid
              ? 'pagado'
              : paidFallback
                ? 'pagado'
                : estadoFacturaToEstado(facturaDb?.estadoFactura, fechaVencimiento);

            return {
              id: `factura-${idFactura}`,
              idFactura,
              idPago: paid?.idPago || paidFallback?.idPago || null,
              periodo,
              fechaVencimiento: fechaVencimiento || null,
              monto,
              estado,
              fechaPago: paid?.fechaPago || paidFallback?.fechaPago || null,
              metodoPago: paid?.metodoPago || paidFallback?.metodoPago || null,
              // si el pago viene de residente_pago o solo de pagos
              comprobante: paid?.rp?.id
                ? `RP-${paid.rp.id}`
                : paid?.idPago
                  ? `PAGO-${paid.idPago}`
                  : paidFallback?.idPago
                    ? `PAGO-${paidFallback.idPago}`
                    : null,
              concepto: `Factura #${idFactura} - Unidad ${facturaDb?.numeroUnidad ?? facturaDb?.idUnidad ?? '—'}`,
              raw: { facturaDb, rp: paid?.rp || null, pagoDb: paid?.pagoDb || null },
            };
          })
          .sort((a, b) => {
            // atrasado primero, luego pendiente, luego pagado
            const order = { atrasado: 0, pendiente: 1, pagado: 2 };
            const ao = order[a.estado] ?? 9;
            const bo = order[b.estado] ?? 9;
            if (ao !== bo) return ao - bo;

            const ad = a.estado === 'pagado' ? (a.fechaPago || '') : (a.fechaVencimiento || '');
            const bd = b.estado === 'pagado' ? (b.fechaPago || '') : (b.fechaVencimiento || '');
            return String(bd).localeCompare(String(ad));
          });

        if (!alive) return;
        setPagos(mine);
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || err?.message || 'No se pudieron cargar tus pagos desde la API';
        setLoadError(msg);
        setPagos([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, [reloadTick]);

  const pagosUnidad = selectedUnidadId === 'all'
    ? pagos
    : pagos.filter((p) => String(p?.raw?.facturaDb?.idUnidad || '') === String(selectedUnidadId));

  const calcularEstadisticas = (items) => {
    const list = Array.isArray(items) ? items : [];
    const pagados = list.filter((p) => p.estado === 'pagado');
    const pendientes = list.filter((p) => p.estado === 'pendiente');
    const atrasados = list.filter((p) => p.estado === 'atrasado');
    
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

  const stats = calcularEstadisticas(pagosUnidad);

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
    const s = String(dateString);
    const base = s.includes('T') ? s.split('T')[0] : s;
    const [year, month, day] = base.split('-');
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

    setTimeout(async () => {
      const metodoTexto = paymentMethod === 'bank'
        ? `Transferencia - ${selectedBank?.name}`
        : paymentMethod === 'card'
          ? 'Tarjeta de Crédito'
          : 'PSE';

      const metodoPagoApi = paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia';

      const today = new Date().toISOString().split('T')[0];

      try {
        const idFactura = selectedPago?.idFactura ?? selectedPago?.raw?.facturaDb?.idFactura ?? null;
        if (!residentId) throw new Error('No se encontro idResidente en sesion');
        if (!idFactura) throw new Error('No se encontro idFactura para registrar el pago');

        // 1) Crear pago
        const pagoRes = await paymentAPI.create({
          fechaPago: today,
          monto: Number(selectedPago?.monto ?? 0),
          metodoPago: metodoPagoApi,
          estadoPago: 'Procesado',
          idFactura,
        });
        const createdPago = pagoRes?.data || {};
        const idPago = createdPago?.idPago ?? createdPago?.id;
        if (!idPago) throw new Error('No se recibio idPago al crear el pago');

        // 2) Asociar pago al residente
        await residentepagosAPI.create({
          idResidente: Number(residentId),
          idPago: Number(idPago),
          montoPagado: Number(selectedPago?.monto ?? 0),
        });

        // 3) Marcar factura como Pagada (requiere payload completo)
        const facturaDb = selectedPago?.raw?.facturaDb;
        if (facturaDb?.idFactura) {
          await facturasAPI.update(facturaDb.idFactura, {
            fechaEmision: facturaDb.fechaEmision,
            monto: facturaDb.monto,
            fechaVencimiento: facturaDb.fechaVencimiento,
            estadoFactura: 'Pagada',
            idUnidad: facturaDb.idUnidad,
          });
        }

        const pagoActualizado = {
          ...selectedPago,
          idPago,
          estado: 'pagado',
          fechaPago: today,
          metodoPago: metodoTexto,
          comprobante: `PAGO-${idPago}`,
          raw: {
            ...(selectedPago?.raw || {}),
            facturaDb: selectedPago?.raw?.facturaDb
              ? { ...selectedPago.raw.facturaDb, estadoFactura: 'Pagada' }
              : selectedPago?.raw?.facturaDb,
          },
        };

        setPagos((prev) => prev.map((p) => (p.id === selectedPago.id ? pagoActualizado : p)));
        setSelectedPago(pagoActualizado);
        generarComprobantePDF(pagoActualizado);
        setPaymentSuccess(true);
        setActiveStep(2);

        // Refrescar desde API para garantizar fecha/metodo
        setFilterEstado('pagado');
        setReloadTick((v) => v + 1);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'No se pudo registrar el pago en la API';
        setLoadError(msg);
      } finally {
        setProcessing(false);
      }
    }, 1200);
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
    ? pagosUnidad
    : pagosUnidad.filter((p) => p.estado === filterEstado);

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

  if (roleBlocked) {
    return (
      <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            El apartado "Mis Pagos" esta disponible solo para residentes.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {loadError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {loadError}
          </Alert>
        )}
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

            <Box sx={{ flex: 1 }} />

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Unidad</InputLabel>
              <Select
                label="Unidad"
                value={selectedUnidadId}
                onChange={(e) => setSelectedUnidadId(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                {unidades.map((u) => (
                  <MenuItem key={u.idUnidad} value={String(u.idUnidad)}>
                    {u.numero ? `Unidad ${u.numero}` : `Unidad ${u.idUnidad}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
