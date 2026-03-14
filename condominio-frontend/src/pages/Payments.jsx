import React, { useState, useEffect } from 'react';
import {Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
TablePagination, Button, IconButton, Chip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
DialogActions, Grid, MenuItem, Select, FormControl, InputLabel, Card, CardContent, LinearProgress,
Tooltip, Alert,} from '@mui/material';

import {Search as SearchIcon, FilterList as FilterIcon, Download as DownloadIcon, Add as AddIcon,
Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon, Pending as PendingIcon, 
Warning as WarningIcon, AttachMoney as MoneyIcon, CalendarMonth as CalendarIcon, Receipt as ReceiptIcon,} from '@mui/icons-material';

import { paymentAPI, facturasAPI } from '../services/api';

import { DatePicker } from '@mui/x-date-pickers/DatePicker'; //para seleccionar fechas
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; //para localizacion de fechas
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; //adaptador de fechas
import { format } from 'date-fns'; //funcion para formatear fechas
import { es } from 'date-fns/locale'; //localizacion en español

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await fetchPayments();
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar');
    }
  };

  // Componente de estadísticas
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
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
        <LinearProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              💰 Gestión de Pagos
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Administra los pagos de cuotas del condominio
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ color: 'white', backgroundColor: '#1e3a5f' }}
          >
            Registrar Pago
          </Button>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Recaudado"
              value={stats.totalCollected}
              icon={<MoneyIcon />}
              color="#4CAF50"
              subtitle="Este mes"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Monto Pendiente"
              value={stats.pendingAmount}
              icon={<PendingIcon />}
              color="#FF9800"
              subtitle="Por cobrar"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
        <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
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
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">Todos los estados</MenuItem>
                  <MenuItem value="paid">Pagado</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="overdue">Vencido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ color: 'white', backgroundColor: '#1e3a5f' }}
                >
                  Exportar
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  sx={{ color: 'white', backgroundColor: '#1e3a5f' }}
                >
                  Reporte
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de pagos */}
        <Paper sx={{ boxShadow: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
<TableCell>Apartamento</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Fecha Vencimiento</TableCell>
                  <TableCell>Fecha Pago</TableCell>
                  <TableCell>Estado del pago</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Recibo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Chip label={payment.apartment} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          ${payment.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          {formatDate(payment.dueDate)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
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
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenDialog(payment)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" color="error" onClick={() => handleDelete(payment)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {payment.status !== 'paid' && (
                            <Tooltip title="Marcar como pagado">
                              <IconButton size="small" color="success" onClick={() => handleMarkAsPaid(payment)}>
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
          />
        </Paper>

        {/* Resumen */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
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
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
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
            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                ⚠️ Pagos Vencidos
              </Typography>
              {payments.filter(p => p.status === 'overdue').length === 0 ? (
                <Alert severity="success">
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
                          border: '1px solid #ffcdd2', 
                          borderRadius: 1,
                          backgroundColor: '#ffebee'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">
                            Unidad {payment.apartment}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                            ${payment.amount.toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          Vencido el {formatDate(payment.dueDate)}
                        </Typography>
                        {payment.notes && (
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            Nota: {payment.notes}
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Diálogo para registrar/editar pago */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedPayment ? 'Editar Pago' : 'Registrar Nuevo Pago'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                
                <FormControl fullWidth size="medium" sx={{ minHeight: 64 }}>
                  <Select
                    name="idFactura"
                    value={formData.idFactura}
                    onChange={handleInputChange}
                    required
                    displayEmpty
                    renderValue={(v) => {
                      if (!v) return 'Seleccione una factura';
                      const f = facturas.find((x) => (x.idFactura ?? x.id) === Number(v));
                      return f
                        ? `Factura #${f.idFactura ?? f.id} – Unidad ${f.numeroUnidad ?? f.numero ?? f.idUnidad ?? '-'}`
                        : `Factura #${v}`;
                    }}
                    sx={{
                      fontSize: '1.0625rem',
                      py: 1.5,
                      '& .MuiSelect-select': { py: 1.5 },
                    }}
                  >
                    <MenuItem value="">
                      <em>Seleccione una factura</em>
                    </MenuItem>
                    {facturas.map((f) => (
                      <MenuItem key={f.idFactura ?? f.id} value={f.idFactura ?? f.id} sx={{ fontSize: '1.0625rem' }}>
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
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
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
                  >
                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                    <MenuItem value="Transferencia">Transferencia</MenuItem>
                    <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !formData.idFactura || !formData.fechaPago || formData.monto === ''}
              sx={{ backgroundColor: '#1e3a5f' }}
            >
              {saving ? 'Guardando...' : selectedPayment ? 'Actualizar' : 'Registrar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Payments;
