import React, { useState, useEffect } from 'react';
import {Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
TablePagination, Button, IconButton, Chip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
DialogActions, Grid, MenuItem, Select, FormControl, InputLabel, Card, CardContent, LinearProgress,
Tooltip, Alert,} from '@mui/material';

import {Search as SearchIcon, FilterList as FilterIcon, Download as DownloadIcon, Add as AddIcon,
Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon, Pending as PendingIcon, 
Warning as WarningIcon, AttachMoney as MoneyIcon, CalendarMonth as CalendarIcon, Person as PersonIcon, 
Receipt as ReceiptIcon,} from '@mui/icons-material';


import { DatePicker } from '@mui/x-date-pickers/DatePicker'; //para seleccionar fechas
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; //para localizacion de fechas
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; //adaptador de fechas
import { format } from 'date-fns'; //funcion para formatear fechas
import { es } from 'date-fns/locale'; //localizacion en español

const Payments = () => {
  // Estados
  const [payments, setPayments] = useState([]);  
  const [loading, setLoading] = useState(true);
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

  // Datos
  const mockPayments = [
    {
      id: 1,
      resident: 'Juan Pérez',
      apartment: '101',
      amount: 1500,
      dueDate: '2024-01-15',
      paymentDate: '2024-01-10',
      status: 'paid',
      method: 'Transferencia',
      receipt: 'RC-001',
      notes: 'Pago completo',
    },
    {
      id: 2,
      resident: 'María García',
      apartment: '202',
      amount: 1500,
      dueDate: '2024-01-15',
      paymentDate: null,
      status: 'pending',
      method: '',
      receipt: '',
      notes: '',
    },
    {
      id: 3,
      resident: 'Carlos López',
      apartment: '303',
      amount: 1500,
      dueDate: '2024-01-15',
      paymentDate: '2024-01-12',
      status: 'paid',
      method: 'Efectivo',
      receipt: 'RC-002',
      notes: '',
    },
    {
      id: 4,
      resident: 'Ana Martínez',
      apartment: '404',
      amount: 1500,
      dueDate: '2024-01-15',
      paymentDate: null,
      status: 'overdue',
      method: '',
      receipt: '',
      notes: 'Recordar llamar',
    },
    {
      id: 5,
      resident: 'Pedro Rodríguez',
      apartment: '505',
      amount: 1500,
      dueDate: '2024-02-15',
      paymentDate: null,
      status: 'pending',
      method: '',
      receipt: '',
      notes: '',
    },
    {
      id: 6,
      resident: 'Laura Sánchez',
      apartment: '606',
      amount: 1500,
      dueDate: '2024-01-15',
      paymentDate: '2024-01-14',
      status: 'paid',
      method: 'Tarjeta',
      receipt: 'RC-003',
      notes: 'Pago online',
    },
    {
      id: 7,
      resident: 'Miguel Torres',
      apartment: '707',
      amount: 1500,
      dueDate: '2023-12-15',
      paymentDate: null,
      status: 'overdue',
      method: '',
      receipt: '',
      notes: 'Moroso',
    },
    {
      id: 8,
      resident: 'Sofía Ramírez',
      apartment: '808',
      amount: 1500,
      dueDate: '2024-01-15',
      paymentDate: '2024-01-08',
      status: 'paid',
      method: 'Transferencia',
      receipt: 'RC-004',
      notes: '',
    },
  ];

  useEffect(() => {
    fetchPayments(); //trae los pagos
    calculateStats(); //calcula las estadísticas
  }, []); // Ejecutar al cargar el componente

  const fetchPayments = () => {  // Simular llamada a API
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  };

  const calculateStats = () => {
    const totalCollected = mockPayments // obtener solo los pagos realizados
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0); // reducirlos a un unico valor
    
    const pendingAmount = mockPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    //vencidos
    const overduePayments = mockPayments.filter(p => p.status === 'overdue').length;
    
    const totalExpected = mockPayments.length * 1500;
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    setStats({ 
      totalCollected,
      pendingAmount,
      overduePayments,
      collectionRate,
    });
  };

  // Filtrar pagos
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.apartment.includes(searchTerm) ||
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

  // Manejar apertura/cierre de diálogo formulario
  const handleOpenDialog = (payment = null) => { // si payment es null, es para registrar nuevo pago
    setSelectedPayment(payment)//si es null, no hay pago seleccionado
    setOpenDialog(true);//abrir diálogo
  };

  const handleCloseDialog = () => { //cerrar diálogo
    setOpenDialog(false);//
    setSelectedPayment(null);//limpiar pago seleccionado
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
                placeholder="Buscar por residente, apartamento o recibo..."
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
                  <TableCell>Residente</TableCell>
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          {payment.resident}
                        </Box>
                      </TableCell>
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
                            <IconButton size="small" color="error">
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
                            {payment.resident} - Apt. {payment.apartment}
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
                  label="Residente"
                  defaultValue={selectedPayment?.resident || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apartamento"
                  defaultValue={selectedPayment?.apartment || ''}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monto"
                  type="number"
                  defaultValue={selectedPayment?.amount || 1500}
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
                  label="Fecha de Vencimiento"
                  defaultValue={selectedPayment?.dueDate ? new Date(selectedPayment.dueDate) : new Date()}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    defaultValue={selectedPayment?.status || 'pending'}
                  >
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="paid">Pagado</MenuItem>
                    <MenuItem value="overdue">Vencido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    label="Método de Pago"
                    defaultValue={selectedPayment?.method || ''}
                  >
                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                    <MenuItem value="Transferencia">Transferencia</MenuItem>
                    <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Recibo"
                  defaultValue={selectedPayment?.receipt || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas"
                  multiline
                  rows={3}
                  defaultValue={selectedPayment?.notes || ''}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleCloseDialog}>
              {selectedPayment ? 'Actualizar' : 'Registrar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Payments;