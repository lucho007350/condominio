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
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
      }}
    >
      <Divider sx={{ mb: 1 }} />

      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Condominio App · Todos los derechos reservados
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Sistema de gestión administrativa de condominios
      </Typography>
    </Box>
  );
};

export default Footer;
