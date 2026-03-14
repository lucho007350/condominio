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
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "",
    area: "",
    cuota: "",
    estado: "disponible"
  });

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await unidadesAPI.getAll();
      const mappedUnits = response.data.map(unit => {
        const estadoLower = String(unit.estado || "").toLowerCase();
        let status = "available";
        if (estadoLower.includes("ocupad") || estadoLower === "1" || estadoLower === "true") {
          status = "occupied";
        } else if (estadoLower.includes("mantenimiento")) {
          status = "maintenance";
        }
        
        return {
          id: unit.idUnidad || unit.id,
          type: unit.tipoUnidad || unit.tipo || "",
          number: unit.numero || "",
          area: unit.area || 0,
          fee: unit.valorCuota || unit.cuota || 0,
          status: status
        };
      });
      setUnits(mappedUnits);
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const totalUnits = units.length;
  const availableUnits = units.filter(u => u.status === "available").length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const maintenanceUnits = units.filter(u => u.status === "maintenance").length;
  const avgFee = units.length > 0
    ? Math.round(units.reduce((sum, u) => sum + (Number(u.fee) || 0), 0) / units.length)
    : 0;

  const filteredUnits = units.filter(u => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = search === "" || 
      (u.number && u.number.toLowerCase().includes(searchLower)) ||
      (u.type && u.type.toLowerCase().includes(searchLower));

    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "available" && u.status === "available") ||
      (filterStatus === "occupied" && u.status === "occupied") ||
      (filterStatus === "maintenance" && u.status === "maintenance");

    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (status) => {
    const config = {
      available: { label: "Disponible", color: "success", icon: <AvailableIcon /> },
      occupied: { label: "Ocupado", color: "warning", icon: <OccupiedIcon /> },
      maintenance: { label: "Mantenimiento", color: "info", icon: <OccupiedIcon /> }
    };
    const { label, color, icon } = config[status] || config.available;
    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
        variant="outlined"
      />
    );
  };

  const handleOpenDialog = (unit = null) => {
    if (unit) {
      setSelectedUnit(unit);
      let estadoForm = "disponible";
      if (unit.status === "occupied") estadoForm = "ocupado";
      else if (unit.status === "maintenance") estadoForm = "maintenance";
      
      setFormData({
        numero: unit.number || "",
        tipo: unit.type || "",
        area: unit.area || "",
        cuota: unit.fee || "",
        estado: estadoForm
      });
    } else {
      setSelectedUnit(null);
      setFormData({
        numero: "",
        tipo: "",
        area: "",
        cuota: "",
        estado: "disponible"
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUnit(null);
    setFormData({
      numero: "",
      tipo: "",
      area: "",
      cuota: "",
      estado: "disponible"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const estadoMap = {
        disponible: "Disponible",
        ocupado: "Ocupada",
        maintenance: "Mantenimiento"
      };
      
      const data = {
        numero: formData.numero,
        tipoUnidad: formData.tipo,
        area: parseFloat(formData.area),
        valorCuota: parseFloat(formData.cuota),
        estado: estadoMap[formData.estado] || "Disponible"
      };

      if (selectedUnit) {
        await unidadesAPI.update(selectedUnit.id, data);
      } else {
        await unidadesAPI.create(data);
      }

      handleCloseDialog();
      fetchUnits();
    } catch (error) {
      console.error("Error saving unit:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta unidad?")) {
      try {
        await unidadesAPI.delete(id);
        fetchUnits();
      } catch (error) {
        console.error("Error deleting unit:", error);
      }
    }
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
<Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ color: 'white', backgroundColor: '#1e3a5f' }}>
            Nueva Unidad
          </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Total Unidades" value={totalUnits} icon={<UnitIcon />} color="#2196F3" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Disponibles" value={availableUnits} icon={<AvailableIcon />} color="#4CAF50" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Ocupadas" value={occupiedUnits} icon={<OccupiedIcon />} color="#FF9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Mantenimiento" value={maintenanceUnits} icon={<OccupiedIcon />} color="#607D8B" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
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
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                value={filterStatus}
                label="Estado"
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(0);
                }}
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
                        <IconButton size="small" onClick={() => handleOpenDialog(unit)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleDelete(unit.id)}>
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUnit ? "Editar Unidad" : "Registrar Unidad"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Área (m²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cuota"
                name="cuota"
                type="number"
                value={formData.cuota}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  label="Estado"
                  onChange={handleInputChange}
                >
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="ocupado">Ocupado</MenuItem>
                <MenuItem value="maintenance">Mantenimiento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnidadesHabitacionales;
