import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, InputAdornment, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Snackbar,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Phone as PhoneIcon,
  Email as EmailIcon, Badge as BadgeIcon, Close as CloseIcon } from '@mui/icons-material';
import { residentesAPI } from '../services/api.jsx';

const emptyForm = {
  nombre: '',
  apellido: '',
  tipoResidente: 'Propietario',
  documento: '',
  telefono: '',
  correo: '',
  estado: 'Activo',
};

const Residents = () => {
  const [search, setSearch] = useState('');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await residentesAPI.getAll();
        const data = response?.data ?? [];
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) setResidents(list);
      } catch (err) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Error al cargar residentes';
        if (!cancelled) setError(msg);
        if (!cancelled) setResidents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredResidents = residents.filter((r) => {
    const term = search.toLowerCase();
    const fullName = `${r.nombre ?? ''} ${r.apellido ?? ''}`.toLowerCase();
    const doc = String(r.documento ?? '').toLowerCase();
    const tel = String(r.telefono ?? '').toLowerCase();
    const mail = String(r.correo ?? '').toLowerCase();
    const tipo = String(r.tipoResidente ?? '').toLowerCase();
    return fullName.includes(term) || doc.includes(term) || tel.includes(term) || mail.includes(term) || tipo.includes(term);
  });

  const totalActivos = residents.filter((r) => String(r.estado ?? '').toLowerCase() === 'activo').length;
  const totalInactivos = residents.length - totalActivos;

  const handleOpenCreate = () => {
    setEditingResident(null);
    setForm(emptyForm);
    setOpenDialog(true);
  };

  const handleOpenEdit = (resident) => {
    setEditingResident(resident);
    setForm({
      nombre: resident.nombre ?? '',
      apellido: resident.apellido ?? '',
      tipoResidente: resident.tipoResidente ?? 'Propietario',
      documento: resident.documento ?? '',
      telefono: resident.telefono ?? '',
      correo: resident.correo ?? '',
      estado: resident.estado ?? 'Activo',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResident(null);
    setForm(emptyForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nombre?.trim() || !form.apellido?.trim() || !form.documento?.trim() || !form.telefono?.trim() || !form.correo?.trim()) {
      setSnackbar({ open: true, message: 'Complete todos los campos obligatorios', severity: 'error' });
      return;
    }
    setSaving(true);
    try {
      if (editingResident) {
        const response = await residentesAPI.update(editingResident.idResidente, form);
        const updated = response?.data ?? response;
        setResidents((prev) =>
          prev.map((r) => (r.idResidente === editingResident.idResidente ? updated : r))
        );
        setSnackbar({ open: true, message: 'Residente actualizado correctamente', severity: 'success' });
      } else {
        const response = await residentesAPI.create(form);
        const created = response?.data ?? response;
        setResidents((prev) => [created, ...prev]);
        setSnackbar({ open: true, message: 'Residente creado correctamente', severity: 'success' });
      }
      window.dispatchEvent(new Event('dashboard:refresh'));
      handleCloseDialog();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al guardar';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteConfirm = (resident) => {
    setResidentToDelete(resident);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setResidentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!residentToDelete?.idResidente) return;
    setSaving(true);
    try {
      await residentesAPI.delete(residentToDelete.idResidente);
      setResidents((prev) => prev.filter((r) => r.idResidente !== residentToDelete.idResidente));
      handleCloseDeleteConfirm();
      setSnackbar({ open: true, message: 'Residente eliminado correctamente', severity: 'success' });
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al eliminar';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

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
          onClick={handleOpenCreate}
        >
          Nuevo Residente
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, documento, teléfono o correo..."
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
      </Paper>

      {/* Tabla de residentes */}
      <Paper sx={{ p: 3, boxShadow: 3 }}>
        {loading ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResidents.map((resident) => (
                  <TableRow key={resident.idResidente} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'medium' }}>
                        {[resident.nombre, resident.apellido].filter(Boolean).join(' ') || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BadgeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        {resident.tipoResidente ?? '—'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{resident.documento ?? '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{resident.telefono ?? '—'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{resident.correo ?? '—'}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={String(resident.estado ?? '').toLowerCase() === 'activo' ? 'Activo' : 'Inactivo'}
                        color={String(resident.estado ?? '').toLowerCase() === 'activo' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(resident)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDeleteConfirm(resident)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && filteredResidents.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              {residents.length === 0 ? 'No hay residentes registrados' : 'No se encontraron residentes con esos criterios de búsqueda'}
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
          <Box>
            <Typography variant="body2" color="textSecondary">Activos</Typography>
            <Typography variant="h6" color="success.main">{totalActivos}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Inactivos</Typography>
            <Typography variant="h6" color="text.secondary">{totalInactivos}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Diálogo crear / editar residente */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e3a5f', color: 'white' }}>
          {editingResident ? 'Editar Residente' : 'Nuevo Residente'}
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" name="nombre" value={form.nombre} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Apellido" name="apellido" value={form.apellido} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select name="tipoResidente" value={form.tipoResidente} label="Tipo" onChange={handleInputChange}>
                  <MenuItem value="Propietario">Propietario</MenuItem>
                  <MenuItem value="Arrendatario">Arrendatario</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Documento" name="documento" value={form.documento} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Teléfono" name="telefono" value={form.telefono} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Correo" name="correo" type="email" value={form.correo} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select name="estado" value={form.estado} label="Estado" onChange={handleInputChange}>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving} sx={{ backgroundColor: '#1e3a5f' }}>
            {saving ? 'Guardando…' : editingResident ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo confirmar eliminar */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>¿Eliminar residente?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Se eliminará a {residentToDelete && [residentToDelete.nombre, residentToDelete.apellido].filter(Boolean).join(' ')}. Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} disabled={saving}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={saving}>
            {saving ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Residents;
