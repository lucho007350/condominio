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
} from '@mui/material';

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
  Person as PersonIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker'; //para seleccionar fechas
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; //para localizacion de fechas
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; //adaptador de fechas
import { format } from 'date-fns'; //funcion para formatear fechas
import { es } from 'date-fns/locale'; //localizacion en español
import { paymentAPI, facturasAPI } from '../services/api';

const Payments = () => {
  // Estados
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); //Página actual (0 = primera)
  const [rowsPerPage, setRowsPerPage] = useState(10); //Filas por página
  const [searchTerm, setSearchTerm] = useState(''); //Término de búsqueda
  const [filterStatus, setFilterStatus] = useState('all'); //Filtro de estado
  const [openDialog, setOpenDialog] = useState(false); // para registrar/editar pago
  const [selectedPayment, setSelectedPayment] = useState(null); //pago seleccionado para editar
  const [stats, setStats] = useState({
    totalCollected: 0,
    pendingAmount: 0,
    overduePayments: 0,
    collectionRate: 0,
  });

  const [formValues, setFormValues] = useState({
    fechaPago: '',
    monto: '',
    metodoPago: '',
    estadoPago: 'Pendiente',
    idFactura: '',
  });

  const calculateStats = (list) => {
    const base = list || payments;

    const totalCollected = base
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingAmount = base
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const overduePayments = base.filter((p) => p.status === 'overdue').length;
    const totalExpected = base.length > 0 ? base.length * 1 : 0;
    const collectionRate =
      totalExpected > 0
        ? Math.round((totalCollected / totalExpected) * 100)
        : 0;

    setStats({
      totalCollected,
      pendingAmount,
      overduePayments,
      collectionRate,
    });
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pagosRes, facturasRes] = await Promise.all([
        paymentAPI.getAll(),
        facturasAPI.getAll(),
      ]);

      const pagosData = Array.isArray(pagosRes.data)
        ? pagosRes.data
        : pagosRes.data?.pagos || [];

      const facturasData = Array.isArray(facturasRes.data)
        ? facturasRes.data
        : facturasRes.data?.facturas || facturasRes.data || [];

      const unidadPorFactura = {};
      facturasData.forEach((f) => {
        const numeroUnidad = f.numeroUnidad ?? f.numero ?? null;
        if (f.idFactura && numeroUnidad != null) {
          unidadPorFactura[f.idFactura] = numeroUnidad;
        }
      });

      const normalizados = pagosData.map((p) => {
        const estado = p.estadoPago || p.estado || 'Pendiente';
        const status =
          estado === 'Procesado'
            ? 'paid'
            : estado === 'Pendiente'
            ? 'pending'
            : 'overdue';

        const apartmentNumber =
          unidadPorFactura[p.idFactura] ?? unidadPorFactura[p.idFactura ?? p.id] ?? null;

        return {
          ...p,
          id: p.idPago || p.id,
          amount: p.monto,
          status,
          dueDate: p.fechaPago,
          paymentDate: p.fechaPago,
          method: p.metodoPago,
          apartment: apartmentNumber,
        };
      });

      setPayments(normalizados);
      calculateStats(normalizados);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || 'Error al cargar los pagos.';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments(); // trae los pagos reales
  }, []); // Ejecutar al cargar el componente

  // Filtrar pagos
  const filteredPayments = payments.filter(payment => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      String(payment.apartment || '').toLowerCase().includes(term) ||
      (payment.receipt || '').toLowerCase().includes(term) ||
      String(payment.idFactura || '').includes(searchTerm);
    
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

  // Manejar apertura/cierre de diálogo formulario
  const handleOpenDialog = (payment = null) => { // si payment es null, es para registrar nuevo pago
    if (payment) {
      setSelectedPayment(payment);
      setFormValues({
        fechaPago: payment.fechaPago || payment.dueDate || '',
        monto: payment.monto ?? payment.amount ?? '',
        metodoPago: payment.metodoPago || payment.method || '',
        estadoPago: payment.estadoPago || (payment.status === 'paid'
          ? 'Procesado'
          : payment.status === 'pending'
          ? 'Pendiente'
          : 'Rechazado'),
        idFactura: payment.idFactura ?? '',
      });
    } else {
      setSelectedPayment(null);
      setFormValues({
        fechaPago: '',
        monto: '',
        metodoPago: '',
        estadoPago: 'Pendiente',
        idFactura: '',
      });
    }
    setOpenDialog(true);//abrir diálogo
  };

  const handleCloseDialog = () => { //cerrar diálogo
    setOpenDialog(false);//
    setSelectedPayment(null);//limpiar pago seleccionado
  };

  const handleChangeForm = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleChangeFechaPago = (value) => {
    if (!value) {
      setFormValues((prev) => ({ ...prev, fechaPago: '' }));
      return;
    }
    const iso = value.toISOString().split('T')[0];
    setFormValues((prev) => ({ ...prev, fechaPago: iso }));
  };

  const handleSavePayment = async () => {
    const payload = {
      fechaPago: formValues.fechaPago,
      monto: Number(formValues.monto),
      metodoPago: formValues.metodoPago,
      estadoPago: formValues.estadoPago,
      idFactura: Number(formValues.idFactura),
    };

    try {
      setLoading(true);
      setError(null);
      if (selectedPayment) {
        const id = selectedPayment.idPago || selectedPayment.id;
        await paymentAPI.update(id, payload);
      } else {
        await paymentAPI.create(payload);
      }

      await loadPayments();
      handleCloseDialog();
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || 'Error al guardar el pago.';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (payment) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este pago?');
    if (!confirmar) return;

    try {
      setLoading(true);
      setError(null);
      const id = payment.idPago || payment.id;
      await paymentAPI.delete(id);
      const updated = payments.filter(
        (p) => (p.idPago || p.id) !== id,
      );
      setPayments(updated);
      calculateStats(updated);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || 'Error al eliminar el pago.';
      setError(backendMessage);
    } finally {
      setLoading(false);
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
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
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
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tasa de Cobranza"
              value={stats.collectionRate}
              icon={<CheckIcon />}
              color="#2196F3"
              subtitle="Eficiencia"
            />
          </Grid>
        </Grid>

        {/* Filtros y búsqueda */}
        <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por apartamento (unidad), factura o recibo..."
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
                  <TableCell>Estado</TableCell>
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
                        <Chip
                          label={payment.apartment != null ? `Unidad ${payment.apartment}` : 'Sin unidad'}
                          size="small"
                        />
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
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeletePayment(payment)}
                                >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {payment.status !== 'paid' && (
                            <Tooltip title="Marcar como pagado">
                              <IconButton size="small" color="success">
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
                            {payment.resident || 'Sin residente'} - Factura {payment.idFactura ?? '-'}
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
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monto"
                  type="number"
                  value={formValues.monto}
                  onChange={handleChangeForm('monto')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha de Pago"
                  value={formValues.fechaPago ? new Date(formValues.fechaPago) : null}
                  onChange={handleChangeFechaPago}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    value={formValues.estadoPago}
                    onChange={handleChangeForm('estadoPago')}
                  >
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="Procesado">Procesado</MenuItem>
                    <MenuItem value="Rechazado">Rechazado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    label="Método de Pago"
                    value={formValues.metodoPago}
                    onChange={handleChangeForm('metodoPago')}
                  >
                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                    <MenuItem value="Transferencia">Transferencia</MenuItem>
                    <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ID Factura"
                  type="number"
                  value={formValues.idFactura}
                  onChange={handleChangeForm('idFactura')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleSavePayment}>
              {selectedPayment ? 'Actualizar' : 'Registrar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Payments;