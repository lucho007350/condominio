import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Avatar, Grid, TextField, Button, Divider, Card, CardContent, IconButton, Alert, Snackbar, Chip, LinearProgress, Zoom, Fade, Tooltip, alpha, Badge, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Menu } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Home as HomeIcon,
  Edit as EditIcon, Badge as BadgeIcon, CalendarToday as CalendarIcon, 
  Receipt as ReceiptIcon, CheckCircle as CheckCircleIcon, Pets as PetsIcon, 
  DirectionsCar as DirectionsCarIcon, PhoneInTalk as PhoneInTalkIcon,
  Security as SecurityIcon, Key as KeyIcon, Verified as VerifiedIcon,
  AdminPanelSettings as AdminIcon, Business as BusinessIcon, Apartment as ApartmentIcon,
  People as PeopleIcon, AttachMoney as MoneyIcon, PhotoCamera as PhotoCameraIcon, 
  Work as WorkIcon, LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { authAPI, residentesAPI } from '../services/api.jsx';

const navbarColors = {
  primary: '#0a1c2c',
  secondary: '#0f2a3a',
  accent: '#2c5f6e',
};

const profileColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  text: { primary: '#0f172a', secondary: '#475569', light: '#94a3b8' },
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Componente de Avatar Pixelado
const PixelAvatarContainer = styled(Box)(({ bgcolor }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: bgcolor,
  borderRadius: '16px',
  boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'all 0.2s ease',
  imageRendering: 'pixelated',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

// AVATARES PARA ADMIN (datos imaginarios)
const AdminAvatar = ({ variant }) => {
  switch(variant) {
    case 1:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '10%', left: '20%', width: '60%', height: '30%', backgroundColor: '#5a5a6e', borderRadius: '4px 4px 0 0', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
          <Box sx={{ position: 'absolute', top: '15%', left: '5%', width: '15%', height: '25%', backgroundColor: '#7a7a8e', borderRadius: '2px', transform: 'rotate(-20deg)' }} />
          <Box sx={{ position: 'absolute', top: '15%', right: '5%', width: '15%', height: '25%', backgroundColor: '#7a7a8e', borderRadius: '2px', transform: 'rotate(20deg)' }} />
          <Box sx={{ position: 'absolute', top: '35%', left: '25%', width: '50%', height: '35%', backgroundColor: '#d8a87c', borderRadius: '12px' }} />
          <Box sx={{ position: 'absolute', top: '45%', left: '35%', width: '8%', height: '10%', backgroundColor: '#1a1a2e', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '45%', right: '35%', width: '8%', height: '10%', backgroundColor: '#1a1a2e', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '60%', left: '35%', width: '30%', height: '8%', backgroundColor: '#8b5a2b', borderRadius: '4px' }} />
        </Box>
      );
    case 2:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: '80%', height: '40%', backgroundColor: '#e5a84a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '25%', left: '15%', width: '15%', height: '20%', backgroundColor: '#c87a2a', borderRadius: '40% 40% 20% 20%' }} />
          <Box sx={{ position: 'absolute', top: '25%', right: '15%', width: '15%', height: '20%', backgroundColor: '#c87a2a', borderRadius: '40% 40% 20% 20%' }} />
          <Box sx={{ position: 'absolute', top: '45%', left: '30%', width: '40%', height: '35%', backgroundColor: '#f5d89c', borderRadius: '15px' }} />
          <Box sx={{ position: 'absolute', top: '55%', left: '38%', width: '8%', height: '10%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '55%', right: '38%', width: '8%', height: '10%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '70%', left: '35%', width: '30%', height: '10%', backgroundColor: '#a5672a', borderRadius: '50%' }} />
        </Box>
      );
    case 3:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '15%', left: '20%', width: '60%', height: '45%', backgroundColor: '#f5c842', borderRadius: '20px 20px 8px 8px' }} />
          <Box sx={{ position: 'absolute', top: '5%', left: '30%', width: '8%', height: '20%', backgroundColor: '#d4a82a' }} />
          <Box sx={{ position: 'absolute', top: '5%', left: '46%', width: '8%', height: '20%', backgroundColor: '#d4a82a' }} />
          <Box sx={{ position: 'absolute', top: '5%', right: '30%', width: '8%', height: '20%', backgroundColor: '#d4a82a' }} />
          <Box sx={{ position: 'absolute', top: '25%', left: '20%', width: '60%', height: '35%', backgroundColor: '#f5e6c4', borderRadius: '12px' }} />
          <Box sx={{ position: 'absolute', top: '40%', left: '35%', width: '8%', height: '10%', backgroundColor: '#2a2a3a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '40%', right: '35%', width: '8%', height: '10%', backgroundColor: '#2a2a3a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '55%', left: '40%', width: '20%', height: '8%', backgroundColor: '#b87c3a', borderRadius: '4px' }} />
        </Box>
      );
    case 4:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '15%', left: '20%', width: '60%', height: '45%', backgroundColor: '#b87c4a', borderRadius: '30% 30% 40% 40%' }} />
          <Box sx={{ position: 'absolute', top: '10%', left: '35%', width: '30%', height: '25%', backgroundColor: '#e5c89c', borderRadius: '20px' }} />
          <Box sx={{ position: 'absolute', top: '25%', left: '25%', width: '10%', height: '12%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '25%', right: '25%', width: '10%', height: '12%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '45%', left: '30%', width: '40%', height: '20%', backgroundColor: '#d4a45a', borderRadius: '0 0 20px 20px' }} />
          <Box sx={{ position: 'absolute', top: '60%', left: '35%', width: '10%', height: '20%', backgroundColor: '#f5b84a', transform: 'rotate(-15deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
          <Box sx={{ position: 'absolute', top: '60%', right: '35%', width: '10%', height: '20%', backgroundColor: '#f5b84a', transform: 'rotate(15deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
        </Box>
      );
    case 5:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '15%', left: '10%', width: '35%', height: '45%', backgroundColor: '#4a6a3a', borderRadius: '25px 0 0 25px' }} />
          <Box sx={{ position: 'absolute', top: '15%', right: '10%', width: '35%', height: '45%', backgroundColor: '#4a6a3a', borderRadius: '0 25px 25px 0' }} />
          <Box sx={{ position: 'absolute', top: '20%', left: '35%', width: '30%', height: '40%', backgroundColor: '#6a8a5a', borderRadius: '20px' }} />
          <Box sx={{ position: 'absolute', top: '35%', left: '25%', width: '8%', height: '12%', backgroundColor: '#f5c542', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '35%', right: '25%', width: '8%', height: '12%', backgroundColor: '#f5c542', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '55%', left: '40%', width: '20%', height: '15%', backgroundColor: '#e05a2a', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
          <Box sx={{ position: 'absolute', top: '5%', left: '45%', width: '10%', height: '20%', backgroundColor: '#d43a1a', transform: 'rotate(20deg)' }} />
        </Box>
      );
    default: return null;
  }
};

// AVATARES PARA PROPIETARIO
const PropietarioAvatar = ({ variant }) => {
  switch(variant) {
    case 1:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', bottom: '20%', left: '10%', width: '80%', height: '40%', backgroundColor: '#b87c4a', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: '10%', left: '30%', width: '40%', height: '35%', backgroundColor: '#d4a86a', clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
          <Box sx={{ position: 'absolute', bottom: '20%', left: '35%', width: '30%', height: '40%', backgroundColor: '#8b5a3a' }} />
          <Box sx={{ position: 'absolute', bottom: '20%', left: '40%', width: '20%', height: '20%', backgroundColor: '#6a3a1a' }} />
          <Box sx={{ position: 'absolute', top: '25%', left: '45%', width: '10%', height: '12%', backgroundColor: '#f5e6c4', borderRadius: '4px' }} />
        </Box>
      );
    case 2:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '25%', left: '20%', width: '25%', height: '50%', backgroundColor: '#d4a82a', borderRadius: '8px' }}>
            <Box sx={{ position: 'absolute', top: '-20%', left: '30%', width: '40%', height: '30%', backgroundColor: '#b88a1a', borderRadius: '20px 20px 0 0' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '30%', right: '20%', width: '30%', height: '40%', backgroundColor: '#e5c89c', borderRadius: '50%' }}>
            <Box sx={{ position: 'absolute', top: '20%', left: '35%', width: '30%', height: '20%', backgroundColor: '#f5c842', borderRadius: '8px' }} />
            <Box sx={{ position: 'absolute', bottom: '20%', left: '30%', width: '40%', height: '15%', backgroundColor: '#f5c842' }} />
          </Box>
        </Box>
      );
    case 3:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', bottom: '20%', left: '10%', width: '80%', height: '15%', backgroundColor: '#5a5a6e', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: '10%', left: '45%', width: '10%', height: '50%', backgroundColor: '#7a7a8e' }} />
          <Box sx={{ position: 'absolute', top: '5%', left: '55%', width: '30%', height: '15%', backgroundColor: '#9a9ab6' }} />
          <Box sx={{ position: 'absolute', top: '35%', left: '30%', width: '20%', height: '25%', backgroundColor: '#c87a2a', borderRadius: '4px' }} />
        </Box>
      );
    case 4:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '50%', backgroundColor: '#a8d85a', borderRadius: '8px', border: '2px solid #6a9a2a' }}>
            <Box sx={{ position: 'absolute', top: '30%', left: '25%', width: '50%', height: '20%', backgroundColor: '#5a8a2a', borderRadius: '4px' }} />
            <Box sx={{ position: 'absolute', top: '55%', left: '30%', width: '40%', height: '15%', backgroundColor: '#5a8a2a', borderRadius: '4px' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '15%', left: '35%', width: '30%', height: '20%', backgroundColor: '#f5c842', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', bottom: '25%', right: '15%', width: '15%', height: '15%', backgroundColor: '#e5a84a', borderRadius: '50%' }} />
        </Box>
      );
    case 5:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', bottom: '15%', left: '10%', width: '80%', height: '50%', backgroundColor: '#6a8ab5', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: '10%', left: '20%', width: '20%', height: '45%', backgroundColor: '#8aaacd' }} />
          <Box sx={{ position: 'absolute', top: '10%', left: '45%', width: '20%', height: '45%', backgroundColor: '#8aaacd' }} />
          <Box sx={{ position: 'absolute', top: '10%', right: '20%', width: '20%', height: '45%', backgroundColor: '#8aaacd' }} />
          <Box sx={{ position: 'absolute', top: '20%', left: '25%', width: '10%', height: '15%', backgroundColor: '#f5e6c4', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: '20%', left: '50%', width: '10%', height: '15%', backgroundColor: '#f5e6c4', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: '20%', right: '25%', width: '10%', height: '15%', backgroundColor: '#f5e6c4', borderRadius: '4px' }} />
        </Box>
      );
    default: return null;
  }
};

// AVATARES PARA RESIDENTE
const ResidenteAvatar = ({ variant }) => {
  switch(variant) {
    case 1:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '55%', backgroundColor: '#e5a87c', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '5%', left: '25%', width: '15%', height: '20%', backgroundColor: '#d88a5a', clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)' }} />
          <Box sx={{ position: 'absolute', top: '5%', right: '25%', width: '15%', height: '20%', backgroundColor: '#d88a5a', clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)' }} />
          <Box sx={{ position: 'absolute', top: '35%', left: '30%', width: '8%', height: '10%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '35%', right: '30%', width: '8%', height: '10%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '55%', left: '40%', width: '20%', height: '8%', backgroundColor: '#c87a4a', borderRadius: '4px' }} />
        </Box>
      );
    case 2:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%', backgroundColor: '#e55a2a', borderRadius: '50%' }}>
            <Box sx={{ position: 'absolute', top: '30%', left: '20%', width: '60%', height: '10%', backgroundColor: '#2a2a2a' }} />
            <Box sx={{ position: 'absolute', top: '45%', left: '10%', width: '10%', height: '40%', backgroundColor: '#2a2a2a' }} />
            <Box sx={{ position: 'absolute', top: '45%', right: '10%', width: '10%', height: '40%', backgroundColor: '#2a2a2a' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '35%', left: '35%', width: '8%', height: '10%', backgroundColor: '#ffffff', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '35%', right: '35%', width: '8%', height: '10%', backgroundColor: '#ffffff', borderRadius: '50%' }} />
        </Box>
      );
    case 3:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '20%', left: '15%', width: '70%', height: '55%', backgroundColor: '#4a7a9a', borderRadius: '8px' }}>
            <Box sx={{ position: 'absolute', top: '15%', left: '10%', width: '80%', height: '70%', backgroundColor: '#f5e6c4' }} />
            <Box sx={{ position: 'absolute', top: '30%', left: '20%', width: '60%', height: '15%', backgroundColor: '#2a2a2a' }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '20%', width: '60%', height: '15%', backgroundColor: '#2a2a2a' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '30%', left: '40%', width: '20%', height: '25%', backgroundColor: '#8a5a3a', borderRadius: '4px' }} />
        </Box>
      );
    case 4:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '25%', left: '10%', width: '80%', height: '45%', backgroundColor: '#3a3a5a', borderRadius: '12px' }}>
            <Box sx={{ position: 'absolute', top: '30%', left: '15%', width: '12%', height: '20%', backgroundColor: '#5a5a8a', borderRadius: '8px' }} />
            <Box sx={{ position: 'absolute', top: '30%', right: '15%', width: '12%', height: '20%', backgroundColor: '#5a5a8a', borderRadius: '8px' }} />
            <Box sx={{ position: 'absolute', top: '55%', left: '40%', width: '20%', height: '15%', backgroundColor: '#8a8aaa', borderRadius: '4px' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '35%', left: '45%', width: '10%', height: '12%', backgroundColor: '#e55a2a', borderRadius: '4px' }} />
        </Box>
      );
    case 5:
      return (
        <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '20%', left: '30%', width: '40%', height: '45%', backgroundColor: '#6ab56a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '10%', left: '35%', width: '30%', height: '25%', backgroundColor: '#e58a5a', borderRadius: '50%' }}>
            <Box sx={{ position: 'absolute', top: '30%', left: '30%', width: '40%', height: '15%', backgroundColor: '#f5c842', borderRadius: '8px' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '45%', left: '30%', width: '8%', height: '12%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '45%', right: '30%', width: '8%', height: '12%', backgroundColor: '#2a2a2a', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: '65%', left: '40%', width: '20%', height: '8%', backgroundColor: '#c87a3a', borderRadius: '50%' }} />
        </Box>
      );
    default: return null;
  }
};

// Definición de avatares por rol
const PIXEL_AVATARS = {
  admin: [
    { id: 1, bg: '#2d1f1a', variant: 1, name: 'Vikingo', component: AdminAvatar },
    { id: 2, bg: '#1e2a2f', variant: 2, name: 'León', component: AdminAvatar },
    { id: 3, bg: '#2d2a1a', variant: 3, name: 'Corona', component: AdminAvatar },
    { id: 4, bg: '#2a1f2d', variant: 4, name: 'Águila', component: AdminAvatar },
    { id: 5, bg: '#1f2d2a', variant: 5, name: 'Dragón', component: AdminAvatar },
  ],
  propietario: [
    { id: 1, bg: '#2d4a2a', variant: 1, name: 'Casa', component: PropietarioAvatar },
    { id: 2, bg: '#4a3e2a', variant: 2, name: 'Tesoro', component: PropietarioAvatar },
    { id: 3, bg: '#2a4a4a', variant: 3, name: 'Construcción', component: PropietarioAvatar },
    { id: 4, bg: '#4a2a3e', variant: 4, name: 'Inversión', component: PropietarioAvatar },
    { id: 5, bg: '#3e4a2a', variant: 5, name: 'Edificio', component: PropietarioAvatar },
  ],
  residente: [
    { id: 1, bg: '#2a4a6a', variant: 1, name: 'Gato', component: ResidenteAvatar },
    { id: 2, bg: '#6a4a2a', variant: 2, name: 'Deporte', component: ResidenteAvatar },
    { id: 3, bg: '#4a2a6a', variant: 3, name: 'Estudio', component: ResidenteAvatar },
    { id: 4, bg: '#2a6a4a', variant: 4, name: 'Gamer', component: ResidenteAvatar },
    { id: 5, bg: '#6a2a4a', variant: 5, name: 'Naturaleza', component: ResidenteAvatar },
  ],
};

// Animaciones
const fadeInUp = {
  animation: 'fadeInUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const fadeInLeft = {
  animation: 'fadeInLeft 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
  '@keyframes fadeInLeft': {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
};

const pulse = {
  animation: 'pulse 0.3s ease-in-out',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.02)' },
    '100%': { transform: 'scale(1)' },
  },
};

const ProfileCard = styled(Card)({
  borderRadius: 28,
  border: 'none',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
  overflow: 'hidden',
});

const StatItem = styled(Box)(({ color }) => ({
  textAlign: 'center',
  padding: '20px 12px',
  borderRadius: 20,
  background: `linear-gradient(135deg, ${alpha(color, 0.03)} 0%, ${alpha(color, 0.08)} 100%)`,
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.12)} 100%)`,
    boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
  },
}));

const InfoField = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 14,
  padding: '14px 0',
  borderBottom: `1px solid ${alpha(profileColors.border, 0.6)}`,
  '&:last-child': { borderBottom: 'none' },
});

const AnimatedIconButton = styled(IconButton)({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: alpha(navbarColors.accent, 0.08),
  },
});

const ProfileHeader = styled(Box)({
  background: `linear-gradient(135deg, ${navbarColors.primary} 0%, ${navbarColors.secondary} 100%)`,
  borderRadius: 24,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('residente');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [animateSave, setAnimateSave] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);
  const [unidades, setUnidades] = useState([]);
  
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editEmergencyOpen, setEditEmergencyOpen] = useState(false);

  // Datos del perfil según la tabla residentes
  const [userData, setUserData] = useState({
    idResidente: null,
    nombre: '',
    apellido: '',
    tipoResidente: 'Residente',
    documento: '',
    telefono: '',
    correo: '',
    estado: 'Activo',
  });

  // Datos imaginarios para admin
  const [adminData] = useState({
    nombre: 'Admin Principal',
    apellido: 'Sistema',
    tipoResidente: 'Administrador',
    documento: 'ADMIN-001',
    telefono: '+57 300 123 4567',
    correo: 'admin@condova.com',
    estado: 'Activo',
  });

  const [editForm, setEditForm] = useState({ ...userData });

  const fullName = userRole === 'admin' 
    ? `${adminData.nombre} ${adminData.apellido}` 
    : [userData.nombre, userData.apellido].filter(Boolean).join(' ') || user?.username || 'Usuario';

  const displayData = userRole === 'admin' ? adminData : userData;

  const setStoredUser = (nextUser) => {
    try {
      const local = localStorage.getItem('user');
      const session = sessionStorage.getItem('user');
      if (local) localStorage.setItem('user', JSON.stringify(nextUser));
      else if (session) sessionStorage.setItem('user', JSON.stringify(nextUser));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let alive = true;
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setUser(storedUser);

    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        // Determinar rol
        const role = storedUser?.role === 'admin' || storedUser?.rol === 'administrador' ? 'admin' :
                     storedUser?.role === 'propietario' || storedUser?.rol === 'propietario' ? 'propietario' : 
                     storedUser?.tipoResidente === 'Propietario' ? 'propietario' : 'residente';
        setUserRole(role);

        // Si es admin, no cargar datos de la BD
        if (role === 'admin') {
          if (alive) setLoading(false);
          // Cargar avatar de admin
          const savedAvatar = localStorage.getItem(`pixelAvatar_admin`);
          if (savedAvatar && alive) {
            setSelectedAvatar(JSON.parse(savedAvatar));
          } else if (alive) {
            setSelectedAvatar(PIXEL_AVATARS.admin[0]);
          }
          return;
        }

        // Para residentes y propietarios, cargar datos de la BD
        let residente = null;
        const residentId = storedUser?.idResidente;
        
        if (residentId) {
          try {
            const res = await residentesAPI.getById(residentId);
            residente = res?.data || null;
            
            // Obtener unidades del residente
            try {
              const ures = await residentesAPI.getUnidades(residentId);
              const list = Array.isArray(ures?.data) ? ures.data : [];
              if (alive) setUnidades(list);
            } catch (err) {
              if (alive) setUnidades([]);
            }
          } catch (err) {
            console.log('Error getting residente:', err);
          }
        }

        // Mapear datos del residente según estructura de la BD
        const next = {
          idResidente: residentId || null,
          nombre: residente?.nombre || '',
          apellido: residente?.apellido || '',
          tipoResidente: residente?.tipoResidente || (role === 'propietario' ? 'Propietario' : 'Residente'),
          documento: residente?.documento || '',
          telefono: residente?.telefono || '',
          correo: residente?.correo || storedUser?.email || '',
          estado: 'Activo',
        };

        if (alive) {
          setUserData(next);
          setEditForm(next);
        }

        // Cargar avatar guardado por rol
        const savedAvatar = localStorage.getItem(`pixelAvatar_${role}`);
        if (savedAvatar && alive) {
          setSelectedAvatar(JSON.parse(savedAvatar));
        } else if (alive) {
          setSelectedAvatar(PIXEL_AVATARS[role][0]);
        }
        
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || err?.message || 'No se pudo cargar el perfil';
        setLoadError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  const handleInputChange = (e) => { const { name, value } = e.target; setEditForm(prev => ({ ...prev, [name]: value })); };
  
  const showSnackbarWithAnimation = (message) => {
    setAnimateSave(true);
    setSnackbar({ open: true, message, severity: 'success' });
    setTimeout(() => setAnimateSave(false), 300);
  };

  const handleSavePersonal = async () => {
    if (userRole === 'admin') {
      showSnackbarWithAnimation('Los datos de administrador son de solo lectura');
      setEditPersonalOpen(false);
      return;
    }
    
    const residentId = userData.idResidente;
    if (!residentId) {
      setSnackbar({ open: true, message: 'No se encontró ID del residente', severity: 'error' });
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        documento: editForm.documento,
      };
      
      const res = await residentesAPI.update(residentId, payload);
      const updated = res?.data || payload;
      
      setUserData(prev => ({ ...prev, ...updated }));
      setEditPersonalOpen(false);
      showSnackbarWithAnimation('Información personal actualizada');
      
      const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      const merged = {
        ...storedUser,
        nombre: updated.nombre,
        name: [updated.nombre, updated.apellido].filter(Boolean).join(' ') || storedUser?.name,
      };
      setStoredUser(merged);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'No se pudo actualizar';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveContact = async () => {
    if (userRole === 'admin') {
      showSnackbarWithAnimation('Los datos de administrador son de solo lectura');
      setEditContactOpen(false);
      return;
    }
    
    const residentId = userData.idResidente;
    if (!residentId) {
      setSnackbar({ open: true, message: 'No se encontró ID del residente', severity: 'error' });
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        correo: editForm.correo,
        telefono: editForm.telefono,
      };
      
      const res = await residentesAPI.update(residentId, payload);
      const updated = res?.data || payload;
      
      setUserData(prev => ({ ...prev, ...updated }));
      setEditContactOpen(false);
      showSnackbarWithAnimation('Información de contacto actualizada');
      
      const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      const merged = {
        ...storedUser,
        email: updated.correo || storedUser?.email,
        correo: updated.correo || storedUser?.correo,
      };
      setStoredUser(merged);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'No se pudo actualizar';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveEmergency = async () => {
    if (userRole === 'admin') {
      showSnackbarWithAnimation('Los datos de administrador son de solo lectura');
      setEditEmergencyOpen(false);
      return;
    }
    setEditEmergencyOpen(false);
    showSnackbarWithAnimation('Contacto de emergencia - Funcionalidad en desarrollo');
  };
  
  const handleCloseSnackbar = () => { setSnackbar({ ...snackbar, open: false }); };

  const openEditPersonal = () => { setEditForm({ ...displayData }); setEditPersonalOpen(true); };
  const openEditContact = () => { setEditForm({ ...displayData }); setEditContactOpen(true); };
  const openEditEmergency = () => { setEditEmergencyOpen(true); };

  const handleAvatarMenuOpen = (event) => {
    setAvatarMenuAnchor(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem(`pixelAvatar_${userRole}`, JSON.stringify(avatar));
    showSnackbarWithAnimation('Avatar pixelado actualizado');
    handleAvatarMenuClose();
  };

  // Estadísticas según rol
  const getStats = () => {
    if (userRole === 'admin') return [
      { icon: <PeopleIcon sx={{ fontSize: 24 }} />, label: 'Residentes', value: '156', color: '#3b82f6' },
      { icon: <ApartmentIcon sx={{ fontSize: 24 }} />, label: 'Unidades', value: '48', color: '#10b981' },
      { icon: <MoneyIcon sx={{ fontSize: 24 }} />, label: 'Facturas', value: '$12.5M', color: '#f59e0b' },
      { icon: <SecurityIcon sx={{ fontSize: 24 }} />, label: 'Empleados', value: '12', color: '#8b5cf6' },
    ];
    if (userRole === 'propietario') return [
      { icon: <BusinessIcon sx={{ fontSize: 24 }} />, label: 'Propiedades', value: '2', color: '#3b82f6' },
      { icon: <HomeIcon sx={{ fontSize: 24 }} />, label: 'Arrendadas', value: '1', color: '#10b981' },
      { icon: <MoneyIcon sx={{ fontSize: 24 }} />, label: 'Ingresos', value: '$1.8M', color: '#f59e0b' },
      { icon: <ReceiptIcon sx={{ fontSize: 24 }} />, label: 'Pagos', value: 'Al día', color: '#8b5cf6' },
    ];
    return [
      { icon: <PersonIcon sx={{ fontSize: 24 }} />, label: 'Habitantes', value: '3', color: '#3b82f6' },
      { icon: <PetsIcon sx={{ fontSize: 24 }} />, label: 'Mascotas', value: '1', color: '#10b981' },
      { icon: <DirectionsCarIcon sx={{ fontSize: 24 }} />, label: 'Vehículos', value: '1', color: '#f59e0b' },
      { icon: <SecurityIcon sx={{ fontSize: 24 }} />, label: 'Seguridad', value: '24/7', color: '#8b5cf6' },
    ];
  };

  if (loading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: profileColors.background }}>
      <LinearProgress sx={{ width: 200 }} />
    </Box>
  );

  const stats = getStats();
  const currentAvatars = PIXEL_AVATARS[userRole] || PIXEL_AVATARS.residente;
  const AvatarComponent = selectedAvatar?.component || ResidenteAvatar;

  return (
    <Box sx={{ backgroundColor: profileColors.background, minHeight: '100vh', pt: 0 }}>
          <Container 
          maxWidth={false}
          sx={{
            py: 2,
            px: { md: 7 },
            ml: { md: '40px' },
          }}
        >

        {loadError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {loadError}
          </Alert>
        )}
        
        <ProfileCard sx={{ ...fadeInUp }}>
          <ProfileHeader>
            <Box sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
              <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title="Cambiar avatar pixelado">
                          <IconButton 
                            onClick={handleAvatarMenuOpen}
                            size="small" 
                            sx={{ 
                              bgcolor: 'white', 
                              '&:hover': { bgcolor: navbarColors.accent, color: 'white' }, 
                              width: 34, 
                              height: 34, 
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              border: '2px solid white',
                            }}
                          >
                            <PhotoCameraIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <Box
                        sx={{
                          width: { xs: 90, sm: 110 },
                          height: { xs: 90, sm: 110 },
                          borderRadius: '20px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '4px solid rgba(255,255,255,0.4)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}
                        onClick={handleAvatarMenuOpen}
                      >
                        <PixelAvatarContainer bgcolor={selectedAvatar?.bg}>
                          <AvatarComponent variant={selectedAvatar?.variant} />
                        </PixelAvatarContainer>
                      </Box>
                    </Badge>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1, fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }}>
                        {fullName}
                      </Typography>
                      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip icon={<VerifiedIcon sx={{ fontSize: 16 }} />} label="Verificado" size="small" sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', height: 28 }} />
                        <Chip icon={userRole === 'admin' ? <AdminIcon sx={{ fontSize: 16 }} /> : userRole === 'propietario' ? <BusinessIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />} label={displayData.tipoResidente} size="small" sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', height: 28 }} />
                        <Chip icon={<KeyIcon sx={{ fontSize: 16 }} />} label={userRole === 'admin' ? 'ADMIN-001' : `RES-${displayData.idResidente || '000'}`} size="small" sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', height: 28 }} />
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ProfileHeader>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Grid de Estadísticas */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {stats.map((stat, idx) => (
                <Grid item xs={6} sm={3} key={idx}>
                  <StatItem color={stat.color}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(stat.color, 0.1), color: stat.color, mb: 1.5 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.6rem', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: profileColors.text.secondary, fontWeight: 500, mt: 0.5 }}>
                      {stat.label}
                    </Typography>
                  </StatItem>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* Información Principal */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha(navbarColors.accent, 0.1), color: navbarColors.accent, width: 40, height: 40 }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Información Personal</Typography>
                    </Box>
                    <IconButton onClick={openEditPersonal} size="small" sx={{ color: navbarColors.accent }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <InfoField>
                    <BadgeIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                    <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Documento</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{displayData.documento || '—'}</Typography></Box>
                  </InfoField>
                  <InfoField>
                    <CalendarIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                    <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Fecha de registro</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{new Date().toLocaleDateString()}</Typography></Box>
                  </InfoField>
                  <InfoField>
                    <CheckCircleIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                    <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Estado</Typography><Chip label={displayData.estado} size="small" sx={{ bgcolor: alpha(profileColors.success, 0.1), color: profileColors.success, height: 24 }} /></Box>
                  </InfoField>
                  <InfoField>
                    <HomeIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                    <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Unidad</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {unidades.length > 0 ? unidades.map(u => u.numero || u.idUnidad).join(', ') : (userRole === 'admin' ? 'Administración' : '—')}
                      </Typography>
                    </Box>
                  </InfoField>
                  <InfoField>
                    <WorkIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                    <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Ocupación</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{userRole === 'admin' ? 'Administrador del Sistema' : displayData.tipoResidente || '—'}</Typography></Box>
                  </InfoField>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha(navbarColors.accent, 0.1), color: navbarColors.accent, width: 40, height: 40 }}>
                          <EmailIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Contacto</Typography>
                      </Box>
                      <IconButton onClick={openEditContact} size="small" sx={{ color: navbarColors.accent }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <InfoField>
                      <EmailIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                      <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Correo electrónico</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{displayData.correo || user?.email || '—'}</Typography></Box>
                    </InfoField>
                    <InfoField>
                      <PhoneIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                      <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Teléfono</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{displayData.telefono || '—'}</Typography></Box>
                    </InfoField>
                    <InfoField>
                      <LocationOnIcon sx={{ color: profileColors.text.light, fontSize: 20, mt: 0.2 }} />
                      <Box flex={1}><Typography variant="caption" sx={{ color: profileColors.text.secondary, display: 'block' }}>Dirección</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{userRole === 'admin' ? 'Oficina de Administración' : '—'}</Typography></Box>
                    </InfoField>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </ProfileCard>

        {/* Menú de selección de avatares pixelados */}
        <Menu
          anchorEl={avatarMenuAnchor}
          open={Boolean(avatarMenuAnchor)}
          onClose={handleAvatarMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 3,
              p: 1.5,
              minWidth: 360,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#94a3b8', textAlign: 'center', fontFamily: 'monospace' }}>
            🎮 █ AVATARES PIXEL ART █ 🎮
          </Typography>
          <Divider sx={{ my: 1, borderColor: alpha('#fff', 0.1) }} />
          <Grid container spacing={1.5} sx={{ p: 1 }}>
            {currentAvatars.map((avatar, index) => {
              const AvatarComp = avatar.component;
              return (
                <Grid item xs={4} key={index}>
                  <Box
                    onClick={() => handleAvatarSelect(avatar)}
                    sx={{
                      width: '100%',
                      aspectRatio: '1/1',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedAvatar?.id === avatar.id ? `3px solid ${navbarColors.accent}` : '2px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        borderColor: navbarColors.accent,
                      },
                    }}
                  >
                    <PixelAvatarContainer bgcolor={avatar.bg}>
                      <AvatarComp variant={avatar.variant} />
                    </PixelAvatarContainer>
                  </Box>
                  <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 0.5, color: '#94a3b8', fontSize: '10px' }}>
                    {avatar.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Menu>

        {/* Diálogos de edición */}
        <Dialog open={editPersonalOpen} onClose={() => setEditPersonalOpen(false)} maxWidth="sm" fullWidth TransitionComponent={Zoom}>
          <DialogTitle sx={{ bgcolor: navbarColors.primary, color: 'white' }}>Editar Información Personal</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField fullWidth label="Nombre" name="nombre" value={editForm.nombre} onChange={handleInputChange} margin="normal" />
            <TextField fullWidth label="Apellido" name="apellido" value={editForm.apellido} onChange={handleInputChange} margin="normal" />
            <TextField fullWidth label="Documento" name="documento" value={editForm.documento} onChange={handleInputChange} margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditPersonalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSavePersonal} sx={{ bgcolor: navbarColors.accent }} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editContactOpen} onClose={() => setEditContactOpen(false)} maxWidth="sm" fullWidth TransitionComponent={Zoom}>
          <DialogTitle sx={{ bgcolor: navbarColors.primary, color: 'white' }}>Editar Información de Contacto</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField fullWidth label="Correo electrónico" name="correo" value={editForm.correo} onChange={handleInputChange} margin="normal" />
            <TextField fullWidth label="Teléfono" name="telefono" value={editForm.telefono} onChange={handleInputChange} margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditContactOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveContact} sx={{ bgcolor: navbarColors.accent }} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editEmergencyOpen} onClose={() => setEditEmergencyOpen(false)} maxWidth="sm" fullWidth TransitionComponent={Zoom}>
          <DialogTitle sx={{ bgcolor: navbarColors.primary, color: 'white' }}>Contacto de Emergencia</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Esta funcionalidad estará disponible próximamente.
            </Alert>
            <TextField fullWidth label="Nombre" name="emergenciaContacto" value="" onChange={() => {}} margin="normal" disabled />
            <TextField fullWidth label="Teléfono" name="telefonoEmergencia" value="" onChange={() => {}} margin="normal" disabled />
            <TextField fullWidth label="Relación" name="relacionEmergencia" value="" onChange={() => {}} margin="normal" disabled />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditEmergencyOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
          TransitionComponent={Fade}
          sx={{ '& .MuiSnackbarContent-root': animateSave ? pulse : {} }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Profile;