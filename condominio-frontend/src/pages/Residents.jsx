import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, InputAdornment, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Snackbar, Avatar, Container, alpha,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Phone as PhoneIcon,
  Email as EmailIcon, Badge as BadgeIcon, Close as CloseIcon, People as PeopleIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { residentesAPI } from '../services/api.jsx';

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
    const isPropietario = String(residentToDelete.tipoResidente || '').toLowerCase() === 'propietario';
    
    try {
      await residentesAPI.delete(residentToDelete.idResidente);
      setResidents((prev) => prev.filter((r) => r.idResidente !== residentToDelete.idResidente));
      handleCloseDeleteConfirm();
      
      let msg = isPropietario
        ? 'Propietario eliminado correctamente'
        : 'Residente eliminado correctamente';
      
      const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      if (storedUser.idResidente === residentToDelete.idResidente) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      setSnackbar({ open: true, message: msg, severity: 'success' });
      window.dispatchEvent(new Event('dashboard:refresh'));
    } catch (err) {
      console.error('Error al eliminar:', err);
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al eliminar';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container 
        maxWidth="xl"
      >
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
                <PeopleIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Gestión de Residentes
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Administra la información de los residentes del condominio
                </Typography>
              </Box>
            </Box>
            <GradientButton
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ bgcolor: colors.success }}
            >
              Nuevo Residente
            </GradientButton>
          </Box>
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Búsqueda */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, documento, teléfono o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Tabla de residentes */}
        <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 700 }}>
              Lista de Residentes
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
              {filteredResidents.length} registros encontrados
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress sx={{ color: colors.primary }} />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.02) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Documento</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Contacto</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResidents.map((resident) => (
                    <TableRow key={resident.idResidente} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                          {[resident.nombre, resident.apellido].filter(Boolean).join(' ') || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BadgeIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                          <Typography variant="body2">{resident.tipoResidente ?? '—'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          {resident.documento ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                            <Typography variant="body2">{resident.telefono ?? '—'}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                            <Typography variant="body2">{resident.correo ?? '—'}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={String(resident.estado ?? '').toLowerCase() === 'activo' ? 'Activo' : 'Inactivo'}
                          size="small"
                          sx={{
                            backgroundColor: String(resident.estado ?? '').toLowerCase() === 'activo' 
                              ? alpha(colors.success, 0.1) 
                              : alpha(colors.error, 0.1),
                            color: String(resident.estado ?? '').toLowerCase() === 'activo' ? colors.success : colors.error,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEdit(resident)}
                          sx={{ 
                            color: colors.primary,
                            '&:hover': { backgroundColor: alpha(colors.primary, 0.1) }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDeleteConfirm(resident)}
                          sx={{ 
                            color: colors.error,
                            '&:hover': { backgroundColor: alpha(colors.error, 0.1) }
                          }}
                        >
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
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 60, color: colors.text.disabled, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                {residents.length === 0 ? 'No hay residentes registrados' : 'No se encontraron residentes con esos criterios de búsqueda'}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Resumen */}
        <Paper sx={{ p: 3, mt: 3, borderRadius: 3, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
            Resumen
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                Total Residentes
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary }}>
                {residents.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                Activos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.success }}>
                {totalActivos}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                Inactivos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.secondary }}>
                {totalInactivos}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Diálogo crear / editar residente */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ 
            backgroundColor: colors.primary, 
            color: 'white', 
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeIcon />
              <Typography variant="h6">
                {editingResident ? 'Editar Residente' : 'Nuevo Residente'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Nombre" 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleInputChange} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Apellido" 
                  name="apellido" 
                  value={form.apellido} 
                  onChange={handleInputChange} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select name="tipoResidente" value={form.tipoResidente} label="Tipo" onChange={handleInputChange}>
                    <MenuItem value="Propietario">Propietario</MenuItem>
                    <MenuItem value="Residente">Residente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Documento" 
                  name="documento" 
                  value={form.documento} 
                  onChange={handleInputChange} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Teléfono" 
                  name="telefono" 
                  value={form.telefono} 
                  onChange={handleInputChange} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Correo" 
                  name="correo" 
                  type="email" 
                  value={form.correo} 
                  onChange={handleInputChange} 
                  required 
                />
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
          <DialogActions sx={{ p: 2.5, bgcolor: alpha(colors.background, 0.5) }}>
            <Button onClick={handleCloseDialog} disabled={saving} variant="outlined">
              Cancelar
            </Button>
            <GradientButton onClick={handleSubmit} disabled={saving}>
              {saving ? 'Guardando…' : editingResident ? 'Guardar cambios' : 'Crear'}
            </GradientButton>
          </DialogActions>
        </Dialog>

        {/* Diálogo confirmar eliminar */}
        <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ backgroundColor: colors.primary, color: 'white', py: 2 }}>
            <Typography variant="h6">¿Eliminar residente?</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Se eliminará a {residentToDelete && [residentToDelete.nombre, residentToDelete.apellido].filter(Boolean).join(' ')}. Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDeleteConfirm} disabled={saving} variant="outlined">
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={saving}>
              {saving ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Residents;