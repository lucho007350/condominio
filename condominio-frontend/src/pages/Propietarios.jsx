import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
  Divider,
  LinearProgress,
  alpha,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Apartment as BuildingIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  QrCode as QrCodeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  MeetingRoom as RoomIcon,
  Bathtub as BathIcon,
  DirectionsCar as CarIcon,
  SquareFoot as AreaIcon,
  Description as DocumentIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

// Colores personalizados
const colors = {
  primary: '#1e3a5f',
  secondary: '#2a4a7a',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    disabled: '#94a3b8',
  },
  border: '#e2e8f0',
};

// Componentes estilizados
const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(colors.surface, 0.95)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(colors.border, 0.5)}`,
  borderRadius: 20,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 20px 30px -10px ${alpha(colors.primary, 0.2)}`,
    borderColor: alpha(colors.primary, 0.3),
  },
}));

const PropertyCard = ({ propiedad, onVerDetalle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <GlassCard
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header de la propiedad */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(colors.primary, 0.1),
                color: colors.primary,
                width: 50,
                height: 50,
                transition: 'transform 0.3s ease',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <BuildingIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                {propiedad.nombre}
              </Typography>
              <Chip
                icon={<LocationIcon sx={{ fontSize: 14 }} />}
                label={propiedad.ubicacion}
                size="small"
                sx={{
                  backgroundColor: alpha(colors.info, 0.1),
                  color: colors.info,
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>
          <Chip
            icon={propiedad.pagos.estado === 'al_dia' ? <CheckCircleIcon /> : <WarningIcon />}
            label={propiedad.pagos.estado === 'al_dia' ? 'Al día' : 'Con deuda'}
            size="small"
            sx={{
              backgroundColor: alpha(propiedad.pagos.estado === 'al_dia' ? colors.success : colors.warning, 0.1),
              color: propiedad.pagos.estado === 'al_dia' ? colors.success : colors.warning,
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información rápida de la propiedad */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <RoomIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.habitaciones}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Hab.</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <BathIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.banos}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Baños</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CarIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.parqueaderos}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Parq.</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <AreaIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.area}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Área</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información de residentes (solo primeros 2) */}
        <Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600, mb: 1 }}>
          Residentes ({propiedad.residentes.length})
        </Typography>
        
        {propiedad.residentes.slice(0, 2).map((residente, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: index < Math.min(propiedad.residentes.length, 2) - 1 ? `1px solid ${alpha(colors.border, 0.5)}` : 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: alpha(colors.info, 0.1), color: colors.info }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {residente.nombre}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  {residente.tipo}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        {propiedad.residentes.length > 2 && (
          <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', textAlign: 'center', mt: 1 }}>
            +{propiedad.residentes.length - 2} residentes más
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Información de pagos */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Último pago
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {propiedad.pagos.ultimoPago}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Próximo vencimiento
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.warning }}>
              {propiedad.pagos.proximoVencimiento}
            </Typography>
          </Box>
        </Box>

        {/* Botón de ver detalles */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<InfoIcon />}
          onClick={() => onVerDetalle(propiedad)}
          sx={{
            mt: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 16px ${alpha(colors.primary, 0.3)}`,
            },
          }}
        >
          Ver detalles completos
        </Button>
      </CardContent>
    </GlassCard>
  );
};

// Componente de diálogo de detalles
const DetallePropiedadDialog = ({ open, propiedad, onClose }) => {
  if (!propiedad) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{
        bgcolor: colors.primary,
        color: 'white',
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BuildingIcon />
          <Typography variant="h6">Detalles de la Propiedad</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Información general */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: alpha(colors.primary, 0.02),
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: colors.primary, width: 50, height: 50 }}>
                  <BuildingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary }}>
                    {propiedad.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {propiedad.ubicacion}
                  </Typography>
                </Box>
                <Chip
                  icon={propiedad.pagos.estado === 'al_dia' ? <CheckCircleIcon /> : <WarningIcon />}
                  label={propiedad.pagos.estado === 'al_dia' ? 'Al día' : 'Con deuda'}
                  sx={{
                    ml: 'auto',
                    backgroundColor: alpha(propiedad.pagos.estado === 'al_dia' ? colors.success : colors.warning, 0.1),
                    color: propiedad.pagos.estado === 'al_dia' ? colors.success : colors.warning,
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Especificaciones */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
                Especificaciones
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <RoomIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.habitaciones}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Habitaciones</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <BathIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.banos}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Baños</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <CarIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.parqueaderos}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Parqueaderos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <AreaIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.area}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Área</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Información financiera */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
                Información Financiera
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MoneyIcon sx={{ color: colors.success }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Valor comercial"
                    secondary={`$${propiedad.valorComercial.toLocaleString()}`}
                    secondaryTypographyProps={{ sx: { fontWeight: 600, color: colors.success } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ReceiptIcon sx={{ color: colors.warning }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gastos comunes mensuales"
                    secondary={`$${propiedad.gastosComunes.toLocaleString()}`}
                    secondaryTypographyProps={{ sx: { fontWeight: 600, color: colors.warning } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon sx={{ color: colors.info }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Último pago"
                    secondary={propiedad.pagos.ultimoPago}
                    secondaryTypographyProps={{ sx: { fontWeight: 600 } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon sx={{ color: colors.warning }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Próximo vencimiento"
                    secondary={propiedad.pagos.proximoVencimiento}
                    secondaryTypographyProps={{ sx: { fontWeight: 600, color: colors.warning } }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Residentes */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
                Residentes ({propiedad.residentes.length})
              </Typography>
              
              {propiedad.residentes.map((residente, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ bgcolor: alpha(colors.info, 0.1), color: colors.info }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {residente.nombre}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {residente.tipo}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, ml: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                      <Typography variant="caption">{residente.telefono}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                      <Typography variant="caption">{residente.email}</Typography>
                    </Box>
                  </Box>
                  {index < propiedad.residentes.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Historial de pagos */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
                Historial de Pagos
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.02) }}>
                      <TableCell><strong>Mes</strong></TableCell>
                      <TableCell align="right"><strong>Monto</strong></TableCell>
                      <TableCell><strong>Fecha de pago</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {propiedad.pagos.historial.map((pago, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{pago.mes}</TableCell>
                        <TableCell align="right">${pago.monto.toLocaleString()}</TableCell>
                        <TableCell>{pago.fecha}</TableCell>
                        <TableCell>
                          <Chip
                            icon={pago.estado === 'pagado' ? <CheckCircleIcon /> : <WarningIcon />}
                            label={pago.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                            size="small"
                            sx={{
                              backgroundColor: alpha(pago.estado === 'pagado' ? colors.success : colors.warning, 0.1),
                              color: pago.estado === 'pagado' ? colors.success : colors.warning,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Documentos */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
                Documentos
              </Typography>
              
              <Grid container spacing={2}>
                {propiedad.documentos.map((doc, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: `1px solid ${colors.border}`,
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DocumentIcon sx={{ color: colors.primary }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {doc.nombre}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {doc.fecha}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" sx={{ color: colors.primary }}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: alpha(colors.primary, 0.02) }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: colors.border,
            color: colors.text.primary,
            borderRadius: 2,
            px: 3,
          }}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          sx={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            borderRadius: 2,
            px: 3,
          }}
        >
          Pagar gastos comunes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MisPropiedades = () => {
  const [loading, setLoading] = useState(true);
  const [propietario, setPropietario] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setPropietario(userData);

    // Datos de ejemplo para propiedades
    const mockPropiedades = [
      {
        id: 1,
        nombre: 'Casa Num. 12 ',
        ubicacion: 'Piso 5, Torre A',
        area: '85 m²',
        habitaciones: 3,
        banos: 2,
        parqueaderos: 1,
        valorComercial: 180000000,
        gastosComunes: 85000,
        residentes: [
          { nombre: 'Carlos Rodríguez', tipo: 'Arrendatario', telefono: '+56 9 1234 5678', email: 'carlos@email.com' },
          { nombre: 'María González', tipo: 'Familiar', telefono: '+56 9 8765 4321', email: 'maria@email.com' },
        ],
        pagos: {
          ultimoPago: '05/03/2026',
          estado: 'al_dia',
          proximoVencimiento: '10/04/2026',
          historial: [
            { mes: 'Marzo 2026', monto: 85000, fecha: '05/03/2026', estado: 'pagado' },
            { mes: 'Febrero 2026', monto: 85000, fecha: '08/02/2026', estado: 'pagado' },
            { mes: 'Enero 2026', monto: 85000, fecha: '07/01/2026', estado: 'pagado' },
          ]
        },
        documentos: [
          { nombre: 'Escritura', fecha: '15/03/2023' },
          { nombre: 'Certificado de avalúo', fecha: '20/12/2025' },
        ]
      },
      {
        id: 2,
        nombre: 'Casa Num. 34',
        ubicacion: 'Piso 3, Torre B',
        area: '72 m²',
        habitaciones: 2,
        banos: 2,
        parqueaderos: 1,
        valorComercial: 155000000,
        gastosComunes: 78000,
        residentes: [
          { nombre: 'Ana Martínez', tipo: 'Arrendataria', telefono: '+56 9 2345 6789', email: 'ana@email.com' },
        ],
        pagos: {
          ultimoPago: '02/03/2026',
          estado: 'al_dia',
          proximoVencimiento: '10/04/2026',
          historial: [
            { mes: 'Marzo 2026', monto: 78000, fecha: '02/03/2026', estado: 'pagado' },
            { mes: 'Febrero 2026', monto: 78000, fecha: '05/02/2026', estado: 'pagado' },
          ]
        },
        documentos: [
          { nombre: 'Escritura', fecha: '20/06/2022' },
        ]
      },
      {
        id: 3,
        nombre: 'Casa Num. 56',
        ubicacion: 'Primer piso, Torre A',
        area: '120 m²',
        habitaciones: 0,
        banos: 1,
        parqueaderos: 2,
        valorComercial: 250000000,
        gastosComunes: 120000,
        residentes: [
          { nombre: 'Comercial SpA', tipo: 'Arrendatario', telefono: '+56 9 3456 7890', email: 'comercial@email.com' },
        ],
        pagos: {
          ultimoPago: '01/03/2026',
          estado: 'al_dia',
          proximoVencimiento: '10/04/2026',
          historial: [
            { mes: 'Marzo 2026', monto: 120000, fecha: '01/03/2026', estado: 'pagado' },
          ]
        },
        documentos: [
          { nombre: 'Escritura', fecha: '10/01/2024' },
          { nombre: 'Contrato arriendo', fecha: '15/01/2024' },
        ]
      },
    ];

    setTimeout(() => {
      setPropiedades(mockPropiedades);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVerDetalle = (propiedad) => {
    setSelectedProperty(propiedad);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredPropiedades = tabValue === 0 
    ? propiedades 
    : tabValue === 1 
      ? propiedades.filter(p => p.habitaciones > 0) // Residenciales
      : tabValue === 2
        ? propiedades.filter(p => p.habitaciones === 0) // Comerciales
        : propiedades.filter(p => p.parqueaderos > 1); // Estacionamientos (ejemplo)

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <BuildingIcon sx={{ fontSize: 60, color: colors.primary, mb: 2, animation: 'pulse 2s infinite' }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            Cargando tus propiedades
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
            Obteniendo información de tus inmuebles
          </Typography>
        </Box>
        <LinearProgress
          sx={{
            width: 200,
            mt: 3,
            height: 4,
            borderRadius: 2,
            backgroundColor: alpha(colors.primary, 0.1),
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.primary,
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.2)',
              }}
            >
              <HomeIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                Bienvenido
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {propietario?.name || 'Propietario'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<BuildingIcon />}
                  label={`${propiedades.length} propiedades`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip
                  icon={<PersonIcon />}
                  label="Propietario"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Estadísticas rápidas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Propiedades', value: propiedades.length, icon: <BuildingIcon />, color: colors.primary },
            { label: 'Residentes', value: propiedades.reduce((acc, p) => acc + p.residentes.length, 0), icon: <PersonIcon />, color: colors.info },
            { label: 'Valor total', value: `$${propiedades.reduce((acc, p) => acc + p.valorComercial, 0).toLocaleString()}`, icon: <MoneyIcon />, color: colors.success },
            { label: 'Gastos comunes', value: `$${propiedades.reduce((acc, p) => acc + p.gastosComunes, 0).toLocaleString()}/mes`, icon: <ReceiptIcon />, color: colors.warning },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha(stat.color, 0.05),
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      width: 50,
                      height: 50,
                      margin: '0 auto 8px',
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h5" sx={{ color: stat.color, fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Tabs para filtrar */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            bgcolor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 48,
              },
              '& .Mui-selected': {
                color: `${colors.primary} !important`,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primary,
              },
            }}
          >
            <Tab label="Todas las propiedades" />
            <Tab label="Residenciales" />
            <Tab label="Comerciales" />
            <Tab label="Estacionamientos" />
          </Tabs>
        </Paper>

        {/* Grid de propiedades */}
        <Grid container spacing={3}>
          {filteredPropiedades.map((propiedad, index) => (
            <Grid item xs={12} md={6} lg={4} key={propiedad.id}>
              <PropertyCard propiedad={propiedad} onVerDetalle={handleVerDetalle} />
            </Grid>
          ))}
        </Grid>

        {filteredPropiedades.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              bgcolor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <BuildingIcon sx={{ fontSize: 60, color: colors.text.disabled, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
              No hay propiedades en esta categoría
            </Typography>
          </Paper>
        )}

        {/* Diálogo de detalles */}
        <DetallePropiedadDialog
          open={openDialog}
          propiedad={selectedProperty}
          onClose={handleCloseDialog}
        />
      </Container>
    </Box>
  );
};

export default MisPropiedades;