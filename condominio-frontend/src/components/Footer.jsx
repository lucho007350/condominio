import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        backgroundColor: '#1e3a5f',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
      }}
    >
      <Divider sx={{ mb: 1 }} />

      <Typography variant="body2" color="white">
        © {new Date().getFullYear()} Condominio App · Todos los derechos reservados
      </Typography>

      <Typography variant="caption" color="white">
        Sistema de gestión administrativa de condominios
      </Typography>
    </Box>
  );
};

export default Footer;
