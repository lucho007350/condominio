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
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  AssignmentInd as IdIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const mockEmpleados = [
    {
      idEmpleado: 1,
      nombre: 'Carlos',
      apellido: 'Ramírez',
      cargo: 'Administrador',
      documento: '1023456789',
      telefono: '3001234567',
      fechaContratacion: '2023-01-15'
    },
    {
      idEmpleado: 2,
      nombre: 'Laura',
      apellido: 'Gómez',
      cargo: 'Contadora',
      documento: '1019876543',
      telefono: '3104567890',
      fechaContratacion: '2022-09-10'
    },
    {
      idEmpleado: 3,
      nombre: 'Miguel',
      apellido: 'Torres',
      cargo: 'Vigilante',
      documento: '1004567891',
      telefono: '3209876543',
      fechaContratacion: '2024-03-01'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEmpleados(mockEmpleados);
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

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold">
        👨‍💼 Gestión de Empleados
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Administración del personal del condominio
      </Typography>

      {/* Cards */}
      <Grid container spacing={3}>
        {empleados.map(emp => (
          <Grid item xs={12} sm={6} md={4} key={emp.idEmpleado}>
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
                      {emp.nombre[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">
                        {emp.nombre} {emp.apellido}
                      </Typography>
                      <Chip
                        icon={<WorkIcon />}
                        label={emp.cargo}
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
                    Contratado: {emp.fechaContratacion}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAB */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Menú flotante */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOpenDialog(selectedEmpleado)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" /> Editar
        </MenuItem>
        <MenuItem>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" /> Eliminar
        </MenuItem>
      </Menu>

      {/* Diálogo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Nombre" defaultValue={selectedEmpleado?.nombre || ''} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Apellido" defaultValue={selectedEmpleado?.apellido || ''} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cargo"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon />
                    </InputAdornment>
                  )
                }}
                defaultValue={selectedEmpleado?.cargo || ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Documento" defaultValue={selectedEmpleado?.documento || ''} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Teléfono" defaultValue={selectedEmpleado?.telefono || ''} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained">
            {selectedEmpleado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Empleados;
