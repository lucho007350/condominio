import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  Alert,
  Avatar,
  Container,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

import { paymentAPI, facturasAPI } from '../services/api';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const colors = {
  primary: '#0f2a3a',
  secondary: '#1d3e52',
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

// Mapeo estado API (Pendiente, Procesado, Rechazado) <-> vista (pending, paid, overdue)
const estadoToView = (estadoPago) => {
  if (!estadoPago) return 'pending';
  const e = String(estadoPago);
  if (e === 'Procesado') return 'paid';
  if (e === 'Rechazado') return 'overdue';
  return 'pending';
};
const viewToEstado = (status) => {
  if (status === 'paid') return 'Procesado';
  if (status === 'overdue') return 'Rechazado';
  return 'Pendiente';
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalCollected: 0,
    pendingAmount: 0,
    overduePayments: 0,
  });
  const [formData, setFormData] = useState({
    fechaPago: '',
    monto: '',
    metodoPago: 'Transferencia',
    estadoPago: 'Pendiente',
    idFactura: '',
  });

  const normalizePago = (p, facturasList = []) => {
    const factura = facturasList.find((f) => (f.idFactura ?? f.id) === (p.idFactura ?? p.idFactura));
    const dueDate = factura?.fechaVencimiento ?? factura?.fecha_vencimiento ?? null;
    const apartment = factura?.numeroUnidad ?? factura?.numero ?? factura?.idUnidad ?? '-';
    return {
      id: p.idPago ?? p.id,
      idPago: p.idPago ?? p.id,
      resident: '-',
      apartment: String(apartment),
      amount: Number(p.monto ?? 0),
      dueDate,
      paymentDate: p.fechaPago ?? null,
      status: estadoToView(p.estadoPago ?? p.estado),
      method: p.metodoPago ?? p.metodo ?? '',
      receipt: '-',
      notes: '',
      idFactura: p.idFactura ?? p.idFactura,
    };
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pagosRes, facturasRes] = await Promise.all([
        paymentAPI.getAll(),
        facturasAPI.getAll(),
      ]);
      const facturasList = Array.isArray(facturasRes.data) ? facturasRes.data : [];
      const pagosList = Array.isArray(pagosRes.data) ? pagosRes.data : [];
      setFacturas(facturasList);
      const normalized = pagosList.map((p) => normalizePago(p, facturasList));
      setPayments(normalized);

      const totalCollected = normalized
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = normalized
        .filter((p) => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      const overduePayments = normalized.filter((p) => p.status === 'overdue').length;
      setStats({
        totalCollected,
        pendingAmount,
        overduePayments,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar los pagos');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filtrar pagos
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.apartment.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Cambiar página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const handleExportPDF = () => {
    const rows = filteredPayments;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const now = new Date();
    const title = 'Reporte de Pagos';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 40, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generado: ${format(now, 'dd/MM/yyyy HH:mm', { locale: es })}`, 40, 58);
    doc.text(`Filtro estado: ${filterStatus} | Busqueda: ${searchTerm || '-'}`, 40, 72);
    doc.text(`Registros: ${rows.length}`, 40, 86);

    const head = [[
      'Apartamento',
      'Monto',
      'Fecha Vencimiento',
      'Fecha Pago',
      'Estado',
      'Metodo',
      'Recibo',
    ]];

    const body = rows.map((p) => {
      const estado = p.status === 'paid' ? 'Pagado' : p.status === 'pending' ? 'Pendiente' : 'Vencido';
      return [
        String(p.apartment ?? '-'),
        `$${Number(p.amount ?? 0).toLocaleString()}`,
        formatDate(p.dueDate),
        p.paymentDate ? formatDate(p.paymentDate) : '-',
        estado,
        String(p.method ?? '-'),
        String(p.receipt ?? '-'),
      ];
    });

    autoTable(doc, {
      head,
      body,
      startY: 105,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [15, 42, 58] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 40, right: 40 },
    });

    const fileName = `pagos_${format(now, 'yyyyMMdd_HHmm')}.pdf`;
    doc.save(fileName);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  // Obtener icono según estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckIcon />;
      case 'pending': return <PendingIcon />;
      case 'overdue': return <WarningIcon />;
      default: return null;
    }
  };

  const handleOpenDialog = (payment = null) => {
    setSelectedPayment(payment);
    if (payment) {
      const fp = payment.paymentDate ? new Date(payment.paymentDate) : null;
      setFormData({
        fechaPago: fp ? format(fp, 'yyyy-MM-dd') : '',
        monto: payment.amount ?? '',
        metodoPago: payment.method || 'Transferencia',
        estadoPago: viewToEstado(payment.status),
        idFactura: payment.idFactura ?? '',
      });
    } else {
      setFormData({
        fechaPago: format(new Date(), 'yyyy-MM-dd'),
        monto: '',
        metodoPago: 'Transferencia',
        estadoPago: 'Pendiente',
        idFactura: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
    setFormData({
      fechaPago: '',
      monto: '',
      metodoPago: 'Transferencia',
      estadoPago: 'Pendiente',
      idFactura: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        fechaPago: formData.fechaPago || null,
        monto: Number(formData.monto),
        metodoPago: formData.metodoPago,
        estadoPago: formData.estadoPago,
        idFactura: Number(formData.idFactura),
      };
      if (selectedPayment) {
        await paymentAPI.update(selectedPayment.idPago ?? selectedPayment.id, payload);
      } else {
        await paymentAPI.create(payload);
      }

      const idFactura = Number(formData.idFactura);
      if (formData.estadoPago === 'Procesado' && idFactura && !isNaN(idFactura)) {
        try {
          await facturasAPI.update(idFactura, {
            estadoFactura: 'Pagada'
          });
        } catch (facturaErr) {
          console.error('Error al actualizar factura:', facturaErr);
        }
      }

      handleCloseDialog();
      await fetchPayments();
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el pago');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (payment) => {
    if (!window.confirm('¿Está seguro de eliminar este pago?')) return;
    try {
      setError(null);
      await paymentAPI.delete(payment.idPago ?? payment.id);
      await fetchPayments();
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar');
    }
  };

  const handleMarkAsPaid = async (payment) => {
    try {
      setError(null);
      const today = format(new Date(), 'yyyy-MM-dd');
      const payload = {
        fechaPago: payment.paymentDate ? format(new Date(payment.paymentDate), 'yyyy-MM-dd') : today,
        monto: payment.amount,
        metodoPago: payment.method || 'Transferencia',
        estadoPago: 'Procesado',
        idFactura: payment.idFactura,
      };
      await paymentAPI.update(payment.idPago ?? payment.id, payload);
      
      const idFacturaPago = Number(payment.idFactura);
      if (idFacturaPago && !isNaN(idFacturaPago)) {
        try {
          await facturasAPI.update(idFacturaPago, {
            estadoFactura: 'Pagada'
          });
        } catch (facturaErr) {
          console.error('Error al actualizar factura:', facturaErr);
        }
      }
      
      await fetchPayments();
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar');
    }
  };

  // Componente de estadísticas
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', boxShadow: 'none', borderRadius: 3, border: `1px solid ${colors.border}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
              {typeof value === 'number' && (title.includes('Recaudado') || title.includes('Pendiente')) 
                ? `$${value.toLocaleString()}` 
                : value}
              {title.includes('Tasa') && '%'}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress sx={{ backgroundColor: alpha(colors.primary, 0.1), '& .MuiLinearProgress-bar': { backgroundColor: colors.primary } }} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
        <Container 
          maxWidth="xl"
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

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
                  <PaymentIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Gestión de Pagos
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Administra los pagos de cuotas del condominio
                  </Typography>
                </Box>
              </Box>
              <GradientButton
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ bgcolor: colors.success }}
              >
                Registrar Pago
              </GradientButton>
            </Box>
          </Paper>

          {/* Estadísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Total Recaudado"
                value={stats.totalCollected}
                icon={<MoneyIcon />}
                color="#4CAF50"
                subtitle="Este mes"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Monto Pendiente"
                value={stats.pendingAmount}
                icon={<PendingIcon />}
                color="#FF9800"
                subtitle="Por cobrar"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Pagos Vencidos"
                value={stats.overduePayments}
                icon={<WarningIcon />}
                color="#F44336"
                subtitle="Atrasados"
              />
            </Grid>
          </Grid>

          {/* Filtros y búsqueda */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar por apartamento o recibo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: colors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Estado"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">Todos los estados</MenuItem>
                    <MenuItem value="paid">Pagado</MenuItem>
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="overdue">Vencido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <GradientButton
                  fullWidth
                  startIcon={<DownloadIcon />}
                  onClick={handleExportPDF}
                  sx={{ bgcolor: colors.info }}
                >
                  Exportar
                </GradientButton>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabla de pagos */}
          <Paper sx={{ borderRadius: 4, border: `1px solid ${colors.border}`, boxShadow: 'none', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.02) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Condominio</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Monto</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha Vencimiento</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha Pago</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado del pago</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Método</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Recibo</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>
                          <Chip 
                            label={payment.apartment} 
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: colors.primary }}>
                            ${payment.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                            {formatDate(payment.dueDate)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                              {formatDate(payment.paymentDate)}
                            </Box>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(payment.status)}
                            label={
                              payment.status === 'paid' ? 'Pagado' :
                              payment.status === 'pending' ? 'Pendiente' : 'Vencido'
                            }
                            color={getStatusColor(payment.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{payment.method || '-'}</TableCell>
                        <TableCell>
                          {payment.receipt ? (
                            <Chip label={payment.receipt} size="small" color="primary" />
                          ) : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Editar">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(payment)}
                                sx={{ color: colors.primary, '&:hover': { backgroundColor: alpha(colors.primary, 0.1) } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDelete(payment)}
                                sx={{ '&:hover': { backgroundColor: alpha(colors.error, 0.1) } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {payment.status !== 'paid' && (
                              <Tooltip title="Marcar como pagado">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleMarkAsPaid(payment)}
                                  sx={{ color: colors.success, '&:hover': { backgroundColor: alpha(colors.success, 0.1) } }}
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPayments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} de ${count}`
              }
              sx={{
                borderTop: `1px solid ${colors.border}`,
              }}
            />
          </Paper>

          {/* Resumen */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: colors.text.primary }}>
                  📊 Resumen por Estado
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['paid', 'pending', 'overdue'].map((status) => {
                    const count = payments.filter(p => p.status === status).length;
                    const amount = payments
                      .filter(p => p.status === status)
                      .reduce((sum, p) => sum + p.amount, 0);
                    
                    return (
                      <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(status)}
                          <Typography sx={{ ml: 1 }}>
                            {status === 'paid' ? 'Pagados' : 
                             status === 'pending' ? 'Pendientes' : 'Vencidos'}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="textSecondary">
                            {count} pagos
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: colors.primary }}>
                            ${amount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: colors.text.primary }}>
                  ⚠️ Pagos Vencidos
                </Typography>
                {payments.filter(p => p.status === 'overdue').length === 0 ? (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    No hay pagos vencidos. ¡Excelente trabajo!
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {payments
                      .filter(p => p.status === 'overdue')
                      .map(payment => (
                        <Box 
                          key={payment.id} 
                          sx={{ 
                            p: 2, 
                            border: `1px solid ${alpha(colors.error, 0.3)}`, 
                            borderRadius: 2,
                            backgroundColor: alpha(colors.error, 0.05)
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Unidad {payment.apartment}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.error }}>
                              ${payment.amount.toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            Vencido el {formatDate(payment.dueDate)}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Diálogo para registrar/editar pago */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ 
              backgroundColor: colors.primary, 
              color: 'white', 
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon />
                <Typography variant="h6">
                  {selectedPayment ? 'Editar Pago' : 'Registrar Nuevo Pago'}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Factura</InputLabel>
                    <Select
                      name="idFactura"
                      value={formData.idFactura}
                      onChange={handleInputChange}
                      required
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">
                        <em>Seleccione una factura</em>
                      </MenuItem>
                      {facturas.map((f) => (
                        <MenuItem key={f.idFactura ?? f.id} value={f.idFactura ?? f.id}>
                          Factura #{f.idFactura ?? f.id} – Unidad {f.numeroUnidad ?? f.numero ?? f.idUnidad ?? '-'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de pago"
                    type="date"
                    name="fechaPago"
                    value={formData.fechaPago}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monto"
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, step: 1000 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon sx={{ color: colors.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="estadoPago"
                      value={formData.estadoPago}
                      label="Estado"
                      onChange={handleInputChange}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                      <MenuItem value="Procesado">Procesado (Pagado)</MenuItem>
                      <MenuItem value="Rechazado">Rechazado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Método de pago</InputLabel>
                    <Select
                      name="metodoPago"
                      value={formData.metodoPago}
                      label="Método de pago"
                      onChange={handleInputChange}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Efectivo">Efectivo</MenuItem>
                      <MenuItem value="Transferencia">Transferencia</MenuItem>
                      <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, bgcolor: alpha(colors.background, 0.5) }}>
              <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
                Cancelar
              </Button>
              <GradientButton
                onClick={handleSave}
                disabled={saving || !formData.idFactura || !formData.fechaPago || formData.monto === ''}
              >
                {saving ? 'Guardando...' : selectedPayment ? 'Actualizar' : 'Registrar'}
              </GradientButton>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default Payments;
