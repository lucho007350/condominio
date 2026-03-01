import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';

import {
  Campaign as GeneralIcon,
  Warning as UrgenteIcon,
  Event as EventoIcon,
  CalendarMonth as FechaIcon
} from '@mui/icons-material';

import { communicationAPI } from '../services/api';

const Comunicacion = () => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComunicados = async () => {
    try {
      setLoading(true);
      const response = await communicationAPI.getAll();
      let data = response.data;
      if (Array.isArray(data)) {
        setComunicados(data);
      } else if (Array.isArray(data?.comunicaciones)) {
        setComunicados(data.comunicaciones);
      } else if (Array.isArray(data?.data)) {
        setComunicados(data.data);
      } else {
        setComunicados([]);
      }
    } catch (error) {
      console.error('Error al obtener comunicaciones:', error);
      setComunicados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComunicados();
  }, []);

  const tipoConfig = (tipo) => {
    const t = (tipo || '').toLowerCase();
    if (t === 'urgente' || t === 'emergencia') return { color: 'error', icon: <UrgenteIcon /> };
    if (t === 'evento') return { color: 'primary', icon: <EventoIcon /> };
    if (t === 'reglamento') return { color: 'info', icon: <GeneralIcon /> };
    if (t === 'aviso') return { color: 'warning', icon: <GeneralIcon /> };
    return { color: 'default', icon: <GeneralIcon /> };
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        📢 Comunicados del Condominio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Información importante para residentes y copropietarios
      </Typography>

      <Grid container spacing={3}>
        {comunicados.map((c) => {
          const config = tipoConfig(c.tipo);
          const key = c.idComunicado ?? c.id ?? c.titulo;

          return (
            <Grid item xs={12} md={6} key={key}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-6px)' }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${config.color}.main`, mr: 2 }}>
                      {config.icon}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight="bold" variant="h6">
                        {c.titulo}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FechaIcon fontSize="small" />
                        <Typography variant="caption">
                          {formatFecha(c.fechaPublicacion)}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={c.tipo || 'Otro'}
                      color={config.color}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {c.contenido}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {comunicados.length === 0 && !loading && (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
          No hay comunicados registrados
        </Typography>
      )}
    </Box>
  );
};

export default Comunicacion;
