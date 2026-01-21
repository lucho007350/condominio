import React, { useState } from 'react';
import { Paper, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead,
TableRow, IconButton, InputAdornment, Chip,} from '@mui/material';

import {Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Phone as PhoneIcon,
Email as EmailIcon, LocationOn as LocationIcon,} from '@mui/icons-material';

const Residents = () => {
  const [search, setSearch] = useState('');
  
  // Datos de ejemplo
  const residents = [
    { id: 1, name: 'Juan Pérez', apartment: '101', phone: '555-0101', email: 'juan@email.com', status: 'active' },
    { id: 2, name: 'María García', apartment: '102', phone: '555-0102', email: 'maria@email.com', status: 'active' },
    { id: 3, name: 'Carlos López', apartment: '201', phone: '555-0103', email: 'carlos@email.com', status: 'active' },
    { id: 4, name: 'Ana Martínez', apartment: '202', phone: '555-0104', email: 'ana@email.com', status: 'inactive' },
    { id: 5, name: 'Pedro Rodríguez', apartment: '301', phone: '555-0105', email: 'pedro@email.com', status: 'active' },
  ];

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(search.toLowerCase()) ||
    resident.apartment.includes(search) ||
    resident.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            👥 Gestión de Residentes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra la información de los residentes del condominio
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResidents.map((resident) => (
                <TableRow key={resident.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'medium' }}>{resident.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      {resident.apartment}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{resident.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{resident.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={resident.status === 'active' ? 'Activo' : 'Inactivo'} //muestra estado
                      color={resident.status === 'active' ? 'success' : 'default'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
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
            <Typography variant="h6">5</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Activos</Typography>
            <Typography variant="h6" color="success.main">4</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Inactivos</Typography>
            <Typography variant="h6" color="text.secondary">1</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Residents;