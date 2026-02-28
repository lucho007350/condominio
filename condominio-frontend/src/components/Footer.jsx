import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        backgroundColor: '#1e3a5f',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <Typography variant="body2" color="white" sx={{ display: 'block', mb: 0.5 }}>
        © {new Date().getFullYear()} Condominio App · Todos los derechos reservados
      </Typography>
      <Typography variant="caption" color="rgba(255,255,255,0.85)">
        Sistema de gestión administrativa de condominios
      </Typography>
    </Box>
  );
};

export default Footer;
