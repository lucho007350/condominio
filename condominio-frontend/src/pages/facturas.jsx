import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import {
  CheckCircle as PagadaIcon,
  Warning as PendienteIcon,
  Error as VencidaIcon,
  Apartment as UnidadIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);

  const mockFacturas = [
    {
      idFactura: 1,
      fechaEmision: '2025-01-01',
      fechaVencimiento: '2025-01-10',
      monto: 250000,
      estadoFactura: 'Pagada',
      idUnidad: 'A-101',
      progreso: 100
    },
    {
      idFactura: 2,
      fechaEmision: '2025-01-05',
      fechaVencimiento: '2025-01-20',
      monto: 320000,
      estadoFactura: 'Pendiente',
      idUnidad: 'B-202',
      progreso: 60
    },
    {
      idFactura: 3,
      fechaEmision: '2024-12-20',
      fechaVencimiento: '2025-01-02',
      monto: 180000,
      estadoFactura: 'Vencida',
      idUnidad: 'C-303',
      progreso: 100
    }
  ];

  useEffect(() => {
    setFacturas(mockFacturas);
  }, []);

  const estadoChip = (estado) => {
    if (estado === 'Pagada')
      return <Chip icon={<PagadaIcon />} label="Pagada" color="success" />;
    if (estado === 'Pendiente')
      return <Chip icon={<PendienteIcon />} label="Pendiente" color="warning" />;
    return <Chip icon={<VencidaIcon />} label="Vencida" color="error" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold">
        🧾 Facturación del Condominio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Control de facturas por unidad habitacional
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Facturas', value: facturas.length },
          { label: 'Pagadas', value: facturas.filter(f => f.estadoFactura === 'Pagada').length },
          { label: 'Pendientes', value: facturas.filter(f => f.estadoFactura === 'Pendiente').length },
          { label: 'Vencidas', value: facturas.filter(f => f.estadoFactura === 'Vencida').length }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6">{item.value}</Typography>
              <Typography color="text.secondary">{item.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID Factura</b></TableCell>
              <TableCell><b>Unidad</b></TableCell>
              <TableCell><b>Fecha Emisión</b></TableCell>
              <TableCell><b>Fecha Vencimiento</b></TableCell>
              <TableCell><b>Monto</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Vencimiento</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {facturas.map((f) => (
              <TableRow key={f.idFactura} hover>
                <TableCell>{f.idFactura}</TableCell>

                <TableCell>
                  <UnidadIcon fontSize="small" sx={{ mr: 1 }} />
                  {f.idUnidad}
                </TableCell>

                <TableCell>
                  <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                  {f.fechaEmision}
                </TableCell>

                <TableCell>{f.fechaVencimiento}</TableCell>

                <TableCell>
                  ${f.monto.toLocaleString()}
                </TableCell>

                <TableCell>{estadoChip(f.estadoFactura)}</TableCell>

                <TableCell sx={{ width: 180 }}>
                  <LinearProgress
                    variant="determinate"
                    value={f.progreso}
                    color={
                      f.estadoFactura === 'Pagada'
                        ? 'success'
                        : f.estadoFactura === 'Pendiente'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Facturas;
