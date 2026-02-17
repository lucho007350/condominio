import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider
} from '@mui/material';

import {
  Campaign as GeneralIcon,
  Warning as UrgenteIcon,
  Event as EventoIcon,
  CalendarMonth as FechaIcon
} from '@mui/icons-material';

import { communicationAPI } from '../services/api.jsx';

const Comunicacion = () => {
  const [comunicados, setComunicados] = useState([]);

  const mockComunicados = [
    {
      idComunicado: 1,
      titulo: 'Corte de agua programado',
      contenido: 'El día viernes habrá suspensión del servicio de agua desde las 8:00 AM hasta las 2:00 PM.',
      fechaPublicacion: '2025-01-15',
      tipo: 'Urgente'
    },
    {
      idComunicado: 2,
      titulo: 'Reunión general de copropietarios',
      contenido: 'Se convoca a reunión general el próximo sábado en el salón comunal a las 6:00 PM.',
      fechaPublicacion: '2025-01-10',
      tipo: 'Evento'
    },
    {
      idComunicado: 3,
      titulo: 'Horario de administración',
      contenido: 'La oficina de administración atenderá de lunes a viernes de 8:00 AM a 5:00 PM.',
      fechaPublicacion: '2025-01-05',
      tipo: 'General'
    }
  ];

  useEffect(() => {
    // Cargar comunicados desde la API
    communicationAPI
      .getAll()
      .then((response) => {
        // Ajusta esta parte si tu backend devuelve los campos con otros nombres
        setComunicados(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener comunicaciones:', error);
        // En caso de error, mostramos los datos de ejemplo
        setComunicados(mockComunicados);
      });
  }, []);

  const tipoConfig = (tipo) => {
    switch (tipo) {
      case 'Urgente':
        return { color: 'error', icon: <UrgenteIcon /> };
      case 'Evento':
        return { color: 'primary', icon: <EventoIcon /> };
      default:
        return { color: 'default', icon: <GeneralIcon /> };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold">
        📢 Comunicados del Condominio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Información importante para residentes y copropietarios
      </Typography>

      {/* Feed */}
      <Grid container spacing={3}>
        {comunicados.map((c) => {
          const config = tipoConfig(c.tipo);

          return (
            <Grid item xs={12} md={6} key={c.idComunicado}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-6px)' }
                }}
              >
                <CardContent>
                  {/* Header */}
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
                          {c.fechaPublicacion}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={c.tipo}
                      color={config.color}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Contenido */}
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {c.contenido}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Comunicacion;
