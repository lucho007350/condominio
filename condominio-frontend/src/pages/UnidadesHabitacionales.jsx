import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Button, IconButton, Chip,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Card, CardContent, Tooltip, LinearProgress,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

import {
  Apartment as UnitIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as AvailableIcon,
  Block as OccupiedIcon,
  SquareFoot as AreaIcon,
  AttachMoney as MoneyIcon,
  Build as MaintenanceIcon,
} from "@mui/icons-material";

import { unidadesAPI } from "../services/api";

const UnidadesHabitacionales = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    tipoUnidad: "",
    numero: "",
    estado: "Disponible",
    area: "",
    valorCuota: "",
  });

  const loadUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await unidadesAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.unidades || [];

      const normalizadas = data.map((u) => {
        const rawEstado = (u.estado || "").toString().toLowerCase();
        let status;
        if (rawEstado === "disponible") status = "available";
        else if (rawEstado === "ocupado" || rawEstado === "ocupada") status = "occupied";
        else if (rawEstado === "mantenimiento" || rawEstado === "en mantenimiento") status = "maintenance";
        else status = "maintenance";

        return {
          ...u,
          id: u.idUnidad || u.id || u.id_unidad,
          type: u.tipoUnidad,
          number: u.numero,
          area: u.area,
          fee: u.valorCuota,
          status,
        };
      });

      setUnits(normalizadas);
    } catch (err) {
      const backendErrors = err?.response?.data?.error;
      const backendMessage = Array.isArray(backendErrors)
        ? backendErrors.join(" ")
        : err?.response?.data?.message || "Error al cargar las unidades.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  // Stats
  const totalUnits = units.length;
  const availableUnits = units.filter(u => u.status === "available").length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const maintenanceUnits = units.filter(u => u.status === "maintenance").length;
  const avgFee =
    units.length > 0
      ? Math.round(units.reduce((sum, u) => sum + u.fee, 0) / units.length)
      : 0;

  const filteredUnits = units.filter(u => {
    const searchTerm = search.toLowerCase();
    const numStr = (u.number ?? "").toString().toLowerCase();
    const typeStr = (u.type ?? "").toString().toLowerCase();

    const matchesSearch =
      numStr.includes(searchTerm) ||
      typeStr.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (status) => {
    if (status === "available") {
      return (
        <Chip
          icon={<AvailableIcon />}
          label="Disponible"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }
    if (status === "occupied") {
      return (
        <Chip
          icon={<OccupiedIcon />}
          label="Ocupado"
          color="warning"
          size="small"
          variant="outlined"
        />
      );
    }
    return (
      <Chip
        label="Mantenimiento"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              p: 1,
              mr: 2,
              borderRadius: "50%",
              backgroundColor: `${color}15`,
            }}
          >
            {React.cloneElement(icon, { sx: { color } })}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            🏢 Unidades Habitacionales
          </Typography>
          <Typography color="text.secondary">
            Administración de unidades del condominio
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedUnit(null);
          setFormValues({
            tipoUnidad: "",
            numero: "",
            estado: "Disponible",
            area: "",
            valorCuota: "",
          });
          setOpenDialog(true);
        }} sx={{ color: 'white', backgroundColor: '#1e3a5f' }}>
          Nueva Unidad
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Unidades" value={totalUnits} icon={<UnitIcon />} color="#2196F3" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Disponibles" value={availableUnits} icon={<AvailableIcon />} color="#4CAF50" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Ocupadas" value={occupiedUnits} icon={<OccupiedIcon />} color="#FF9800" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="En mantenimiento" value={maintenanceUnits} icon={<MaintenanceIcon />} color="#9E9E9E" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Cuota Promedio" value={`$${avgFee}`} icon={<MoneyIcon />} color="#9C27B0" />
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por número o tipo..."
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
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                label="Estado"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="available">Disponible</MenuItem>
                <MenuItem value="occupied">Ocupado</MenuItem>
                <MenuItem value="maintenance">Mantenimiento</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Área (m²)</TableCell>
                <TableCell>Cuota</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUnits
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((unit) => (
                  <TableRow key={unit.id} hover>
                    <TableCell>{unit.number}</TableCell>
                    <TableCell>{unit.type}</TableCell>
                    <TableCell>
                      <AreaIcon fontSize="small" /> {unit.area}
                    </TableCell>
                    <TableCell>${unit.fee}</TableCell>
                    <TableCell>{getStatusChip(unit.status)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => {
                          setSelectedUnit(unit);
                          setFormValues({
                            tipoUnidad: unit.type,
                            numero: unit.number,
                            estado:
                              unit.status === "available"
                                ? "Disponible"
                                : unit.status === "occupied"
                                ? "Ocupado"
                                : "Mantenimiento",
                            area: unit.area,
                            valorCuota: unit.fee,
                          });
                          setOpenDialog(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const confirmar = window.confirm("¿Eliminar esta unidad?");
                            if (!confirmar) return;
                            try {
                              setLoading(true);
                              setError(null);
                              const id = unit.idUnidad || unit.id;
                              await unidadesAPI.delete(id);
                              await loadUnits();
                            } catch (err) {
                              const backendErrors = err?.response?.data?.error;
                              const backendMessage = Array.isArray(backendErrors)
                                ? backendErrors.join(" ")
                                : err?.response?.data?.message || "Error al eliminar la unidad.";
                              setError(backendMessage);
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredUnits.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUnit ? "Editar Unidad" : "Registrar Unidad"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número"
                value={formValues.numero}
                onChange={(e) => setFormValues((prev) => ({ ...prev, numero: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo"
                value={formValues.tipoUnidad}
                onChange={(e) => setFormValues((prev) => ({ ...prev, tipoUnidad: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Área (m²)"
                type="number"
                value={formValues.area}
                onChange={(e) => setFormValues((prev) => ({ ...prev, area: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cuota"
                type="number"
                value={formValues.valorCuota}
                onChange={(e) => setFormValues((prev) => ({ ...prev, valorCuota: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  value={formValues.estado}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, estado: e.target.value }))
                  }
                >
                  <MenuItem value="Disponible">Disponible</MenuItem>
                  <MenuItem value="Ocupado">Ocupado</MenuItem>
                  <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              const payload = {
                tipoUnidad: formValues.tipoUnidad,
                numero: formValues.numero,
                estado: formValues.estado,
                area: Number(formValues.area),
                valorCuota: Number(formValues.valorCuota),
              };

              try {
                setLoading(true);
                setError(null);
                if (selectedUnit) {
                  const id = selectedUnit.idUnidad || selectedUnit.id;
                  await unidadesAPI.update(id, payload);
                } else {
                  await unidadesAPI.create(payload);
                }
                await loadUnits();
                setOpenDialog(false);
              } catch (err) {
                const backendErrors = err?.response?.data?.error;
                const backendMessage = Array.isArray(backendErrors)
                  ? backendErrors.join(" ")
                  : err?.response?.data?.message || "Error al guardar la unidad.";
                setError(backendMessage);
              } finally {
                setLoading(false);
              }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnidadesHabitacionales;
