import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar,
  Chip, IconButton, Fab, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, InputAdornment, LinearProgress
} from '@mui/material';

import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  AssignmentInd as IdIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

import { empleadosAPI } from '../services/api';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cargo: '',
    documento: '',
    telefono: '',
    fechaContratacion: '',
    salario: '',
  });

  const loadEmpleados = async () => {
    try {
      setLoading(true);
      const response = await empleadosAPI.getAll();
      let data = response.data;
      if (Array.isArray(data)) {
        setEmpleados(data);
      } else if (Array.isArray(data?.empleados)) {
        setEmpleados(data.empleados);
      } else if (Array.isArray(data?.data)) {
        setEmpleados(data.data);
      } else {
        setEmpleados([]);
      }
    } catch (error) {
      console.error('Error cargando empleados', error);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmpleados();
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
    setFormData({
      nombre: empleado?.nombre || '',
      apellido: empleado?.apellido || '',
      cargo: empleado?.cargo || '',
      documento: empleado?.documento || '',
      telefono: empleado?.telefono || '',
      fechaContratacion: empleado?.fechaContratacion || '',
      salario: empleado?.salario != null ? String(empleado.salario) : '',
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmpleado(null);
  };

  const handleChangeField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cargo: formData.cargo,
        documento: formData.documento,
        telefono: formData.telefono,
        fechaContratacion: formData.fechaContratacion || null,
        salario: formData.salario !== '' ? Number(formData.salario) : 0,
      };
      if (selectedEmpleado && (selectedEmpleado.idEmpleado || selectedEmpleado.id)) {
        const id = selectedEmpleado.idEmpleado || selectedEmpleado.id;
        await empleadosAPI.update(id, payload);
      } else {
        await empleadosAPI.create(payload);
      }
      await loadEmpleados();
      handleCloseDialog();
    } catch (error) {
      console.error('Error guardando empleado', error);
    }
  };

  const handleDelete = async (empleado) => {
    if (!empleado) return;
    const ok = window.confirm('¿Eliminar este empleado?');
    if (!ok) return;
    const id = empleado.idEmpleado ?? empleado.id;
    if (id == null) return;
    try {
      await empleadosAPI.delete(id);
      setEmpleados((prev) => prev.filter((e) => (e.idEmpleado ?? e.id) !== id));
    } catch (error) {
      console.error('Error eliminando empleado', error);
    } finally {
      handleMenuClose();
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        👨‍💼 Gestión de Empleados
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Administración del personal del condominio
      </Typography>

      <Grid container spacing={3}>
        {empleados.map((emp) => (
          <Grid item xs={12} sm={6} md={4} key={emp.idEmpleado ?? emp.id ?? emp.documento}>
            <Card
              sx={{
                boxShadow: 4,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-6px)' }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {(emp.nombre || '?')[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">
                        {emp.nombre} {emp.apellido}
                      </Typography>
                      <Chip
                        icon={<WorkIcon />}
                        label={emp.cargo || 'Sin cargo'}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>
                  <IconButton onClick={(e) => handleMenuOpen(e, emp)}>
                    <MoreIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <IdIcon fontSize="small" sx={{ mr: 1 }} />
                    {emp.documento}
                  </Typography>
                  <Typography variant="body2">
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    {emp.telefono}
                  </Typography>
                  <Typography variant="body2">
                    <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                    Contratado: {emp.fechaContratacion || '—'}
                  </Typography>
                  {emp.salario != null && (
                    <Typography variant="body2">
                      <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
                      Salario: {emp.salario}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {empleados.length === 0 && !loading && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No hay empleados registrados
        </Typography>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOpenDialog(selectedEmpleado)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" /> Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            const emp = selectedEmpleado;
            handleMenuClose();
            handleDelete(emp);
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" /> Eliminar
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={handleChangeField('nombre')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={formData.apellido}
                onChange={handleChangeField('apellido')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cargo"
                value={formData.cargo}
                onChange={handleChangeField('cargo')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Documento"
                value={formData.documento}
                onChange={handleChangeField('documento')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChangeField('telefono')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha contratación"
                type="date"
                value={formData.fechaContratacion}
                onChange={handleChangeField('fechaContratacion')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Salario"
                type="number"
                value={formData.salario}
                onChange={handleChangeField('salario')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'white', backgroundColor: '#1e3a5f' }}>
            Cancelar
          </Button>
          <Button variant="contained" sx={{ color: 'white', backgroundColor: '#1e3a5f' }} onClick={handleSubmit}>
            {selectedEmpleado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Empleados;
