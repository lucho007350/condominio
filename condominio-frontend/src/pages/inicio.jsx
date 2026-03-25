import React, { useEffect, useMemo, useState } from 'react';
import { Container, Box, Typography, alpha } from '@mui/material';
import { Row, Col } from 'react-bootstrap';

import { residentesAPI, unidadesAPI } from '../services/api.jsx';

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const Inicio = () => {
  const primaryColor = '#0a1c2c';
  const accentColor = '#2c5f6e';

  const [unitsCount, setUnitsCount] = useState(null);
  const [residentsCount, setResidentsCount] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoadingStats(true);
        setStatsError('');
        const [unitsRes, residentsRes] = await Promise.all([
          unidadesAPI.getAll(),
          residentesAPI.getAll(),
        ]);

        const units = toArray(unitsRes?.data);
        const residents = toArray(residentsRes?.data);

        if (!alive) return;
        setUnitsCount(units.length);
        setResidentsCount(residents.length);
      } catch (err) {
        if (!alive) return;
        setUnitsCount(null);
        setResidentsCount(null);
        const msg = err?.response?.data?.message || err?.message;
        console.error('Inicio stats error:', err);
        setStatsError(msg ? `No se pudieron cargar las cifras desde la API: ${msg}` : 'No se pudieron cargar las cifras desde la API.');
      } finally {
        if (alive) setLoadingStats(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const unitsLabel = loadingStats ? '...' : unitsCount == null ? '-' : String(unitsCount);
    const residentsLabel = loadingStats ? '...' : residentsCount == null ? '-' : String(residentsCount);

    return [
      { number: unitsLabel, label: 'Unidades', icon: '🏢' },
      { number: residentsLabel, label: 'Residentes', icon: '👥' },
      { number: '24/7', label: 'Seguridad', icon: '🛡️' },
    ];
  }, [loadingStats, residentsCount, unitsCount]);

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 56px)', overflow: 'hidden', backgroundColor: '#000' }}>
      {/* Video de fondo - OCUPA TODA LA PANTALLA */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/202602171648.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Overlay con gradiente azul oscuro - OCUPA TODA LA PANTALLA */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(primaryColor, 0.85)} 0%, ${alpha(primaryColor, 0.7)} 100%)`,
          zIndex: 1,
        }}
      />

      {/* Contenido principal - CENTRADO CON RESPETO AL NAVBAR */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                {/* Badge de bienvenida */}
                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50px',
                    padding: '0.5rem 1.5rem',
                    mb: 3,
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  ✦ BIENVENIDO A ✦
                </Box>

                {/* Título principal */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    mb: 2,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  CONDOMINIO
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: `linear-gradient(135deg, #fff 0%, ${accentColor} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                    }}
                  >
                    LAS MARGARITAS
                  </Box>
                </Typography>

                {/* Descripción */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.8,
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  Vive en el lugar más exclusivo de la ciudad. Disfruta de gimnasio, áreas verdes,
                  seguridad 24/7 y salón de eventos. Un espacio diseñado para tu bienestar y el de tu familia.
                </Typography>

                {/* Tarjetas de estadísticas */}
                <Row className="justify-content-center g-4">
                  {stats.map((stat, index) => (
                    <Col key={index} xs={6} sm={4} md={3}>
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '20px',
                          padding: '1.5rem 1rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          cursor: 'default',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          animation: `fadeInUp 1s ease-out ${index * 0.1}s both`,
                          '&:hover': {
                            transform: 'translateY(-10px)',
                            background: 'rgba(255, 255, 255, 0.15)',
                            boxShadow: `0 15px 40px ${alpha(accentColor, 0.3)}`,
                          },
                        }}
                      >
                        {/* Icono */}
                        <Box sx={{ fontSize: '2.5rem', mb: 0.5, opacity: 0.9 }}>
                          {stat.icon}
                        </Box>

                        {/* Número */}
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.2,
                            mb: 0.25,
                            textShadow: `2px 2px 4px ${accentColor}`,
                          }}
                        >
                          {stat.number}
                        </Typography>

                        {/* Label */}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {stat.label}
                        </Typography>

                        {/* Línea decorativa */}
                        <Box
                          sx={{
                            width: '40px',
                            height: '2px',
                            background: accentColor,
                            margin: '0.75rem auto 0',
                            borderRadius: '2px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Col>
                  ))}
                </Row>

                {statsError && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: 'rgba(255, 255, 255, 0.85)',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {statsError}
                  </Typography>
                )}
              </Box>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* Estilos CSS personalizados */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: ${accentColor};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${primaryColor};
        }
      `}</style>
    </Box>
  );
};

export default Inicio;