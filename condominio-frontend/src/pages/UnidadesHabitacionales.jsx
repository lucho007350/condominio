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

const UnidadesHabitacionales = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Mock data
  const mockUnits = [
    { id: 1, type: "Apartamento", number: "A-101", area: 85, fee: 160, status: "available" },
    { id: 2, type: "Apartamento", number: "A-202", area: 90, fee: 180, status: "occupied" },
    { id: 3, type: "Penthouse", number: "PH-1", area: 150, fee: 320, status: "available" },
    { id: 4, type: "Apartamento", number: "B-303", area: 78, fee: 150, status: "occupied" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setUnits(mockUnits);
      setLoading(false);
    }, 800);
  }, []);

  // Stats
  const totalUnits = units.length;
  const availableUnits = units.filter(u => u.status === "available").length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const avgFee =
    units.length > 0
      ? Math.round(units.reduce((sum, u) => sum + u.fee, 0) / units.length)
      : 0;

  const filteredUnits = units.filter(u => {
    const matchesSearch =
      u.number.toLowerCase().includes(search.toLowerCase()) ||
      u.type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (status) => (
    <Chip
      icon={status === "available" ? <AvailableIcon /> : <OccupiedIcon />}
      label={status === "available" ? "Disponible" : "Ocupado"}
      color={status === "available" ? "success" : "warning"}
      size="small"
      variant="outlined"
    />
  );

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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
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
                          setOpenDialog(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error">
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
              <TextField fullWidth label="Número" defaultValue={selectedUnit?.number || ""} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Tipo" defaultValue={selectedUnit?.type || ""} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Área (m²)" type="number" defaultValue={selectedUnit?.area || ""} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Cuota" type="number" defaultValue={selectedUnit?.fee || ""} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnidadesHabitacionales;
