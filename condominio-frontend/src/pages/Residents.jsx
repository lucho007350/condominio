import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead,
TableRow, IconButton, InputAdornment, Chip, Dialog, DialogTitle, DialogContent, DialogActions,} from '@mui/material';

import {Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Phone as PhoneIcon,
Email as EmailIcon, LocationOn as LocationIcon, AssignmentInd as IdIcon,} from '@mui/icons-material';
import { residentesAPI } from '../services/api';

const Residents = () => {
  const [search, setSearch] = useState('');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    tipoResidente: '',
    telefono: '',
    correo: '',
    estado: 'Activo',
  });

  const loadResidents = async () => {
    try {
      setLoading(true);
      const response = await residentesAPI.getAll();

      let data = response.data;
      // Intentar adaptarse a distintas formas de respuesta
      if (Array.isArray(data)) {
        setResidents(data);
      } else if (Array.isArray(data?.residentes)) {
        setResidents(data.residentes);
      } else if (Array.isArray(data?.data)) {
        setResidents(data.data);
      } else {
        setResidents([]);
      }
    } catch (error) {
      console.error('Error cargando residentes', error);
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const handleOpenNew = () => {
    setCurrentResident(null);
    setFormData({
      nombre: '',
      apellido: '',
      documento: '',
      tipoResidente: '',
      telefono: '',
      correo: '',
      estado: 'Activo',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (resident) => {
    setCurrentResident(resident);
    setFormData({
      nombre: resident.nombre || '',
      apellido: resident.apellido || '',
      documento: resident.documento || '',
      tipoResidente: resident.tipoResidente || '',
      telefono: resident.telefono || '',
      correo: resident.correo || '',
      estado: resident.estado || 'Activo',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentResident(null);
  };

  const handleChangeField = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (currentResident && (currentResident.idResidente || currentResident.id)) {
        const id = currentResident.idResidente || currentResident.id;
        await residentesAPI.update(id, formData);
      } else {
        await residentesAPI.create(formData);
      }
      await loadResidents();
      setDialogOpen(false);
      setCurrentResident(null);
    } catch (error) {
      console.error('Error guardando residente', error);
    }
  };

  const handleDelete = async (resident) => {
    const confirmDelete = window.confirm('¿Deseas eliminar este residente?');
    if (!confirmDelete) return;

    try {
      const id = resident.idResidente || resident.id;
      await residentesAPI.delete(id);
      setResidents((prev) =>
        prev.filter((r) => (r.idResidente || r.id) !== id)
      );
    } catch (error) {
      console.error('Error eliminando residente', error);
    }
  };

  const filteredResidents = residents.filter((resident) => {
    const nombre = (resident.nombre || '').toLowerCase();
    const apellido = (resident.apellido || '').toLowerCase();
    const documento = (resident.documento || '').toLowerCase();
    const tipoResidente = (resident.tipoResidente || '').toLowerCase();
    const telefono = (resident.telefono || '').toLowerCase();
    const correo = (resident.correo || '').toLowerCase();

    const term = search.toLowerCase();
    return (
      nombre.includes(term) ||
      apellido.includes(term) ||
      `${nombre} ${apellido}`.includes(term) ||
      documento.includes(term) ||
      tipoResidente.includes(term) ||
      telefono.includes(term) ||
      correo.includes(term)
    );
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, }}>
            👥 Gestión de Residentes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra la información de los residentes del condominio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ color: 'white', backgroundColor: '#1e3a5f' }}
          onClick={handleOpenNew}
        >
          Nuevo Residente
        </Button>
      </Box>

      {/* Búsqueda y filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar residente, departamento o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined">Filtrar</Button>
        </Box>
      </Paper>

      {/* Tabla de residentes */}
      <Paper sx={{ p: 3, boxShadow: 3 }}>
        {loading && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Cargando residentes...
          </Typography>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Tipo de residente</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResidents.map((resident, index) => (
                <TableRow
                  key={
                    resident.idResidente ||
                    resident.id ||
                    resident._id ||
                    resident.documento ||
                    index
                  }
                  hover
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 'medium' }}>
                      {(resident.nombre || '') + ' ' + (resident.apellido || '')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IdIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      {resident.documento}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={resident.tipoResidente || 'Sin tipo'}
                      color="default"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{resident.telefono}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{resident.correo}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(resident)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(resident)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredResidents.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No se encontraron residentes con esos criterios de búsqueda
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Resumen */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
          Resumen
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="textSecondary">Total Residentes</Typography>
            <Typography variant="h6">{residents.length}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Diálogo para crear/editar residente */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentResident ? 'Editar Residente' : 'Nuevo Residente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={formData.nombre}
              onChange={handleChangeField('nombre')}
            />
            <TextField
              label="Apellido"
              fullWidth
              value={formData.apellido}
              onChange={handleChangeField('apellido')}
            />
            <TextField
              label="Documento"
              fullWidth
              value={formData.documento}
              onChange={handleChangeField('documento')}
            />
            <TextField
              label="Tipo de residente"
              fullWidth
              value={formData.tipoResidente}
              onChange={handleChangeField('tipoResidente')}
            />
            <TextField
              label="Estado (Activo / Inactivo)"
              fullWidth
              value={formData.estado}
              onChange={handleChangeField('estado')}
            />
            <TextField
              label="Teléfono"
              fullWidth
              value={formData.telefono}
              onChange={handleChangeField('telefono')}
            />
            <TextField
              label="Correo"
              fullWidth
              value={formData.correo}
              onChange={handleChangeField('correo')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ color: 'white', backgroundColor: '#1e3a5f' }}
            onClick={handleSubmit}
          >
            {currentResident ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Residents;