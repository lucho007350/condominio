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
  Alert,
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

import { authAPI, facturasAPI, paymentAPI, residentepagosAPI, residentesAPI } from '../services/api.jsx';

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
const GlassCard = styled(Card)(() => ({
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

  const residentes = Array.isArray(propiedad?.residentes) ? propiedad.residentes : [];
  const pagosEstado = String(propiedad?.pagos?.estado || '').toLowerCase();
  const pagosConfig =
    pagosEstado === 'al_dia'
      ? { icon: <CheckCircleIcon />, label: 'Al día', color: colors.success }
      : pagosEstado === 'con_deuda'
        ? { icon: <WarningIcon />, label: 'Con deuda', color: colors.warning }
        : { icon: <InfoIcon />, label: 'Sin info', color: colors.info };

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
                label={propiedad.ubicacion || '—'}
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
            icon={pagosConfig.icon}
            label={pagosConfig.label}
            size="small"
            sx={{
              backgroundColor: alpha(pagosConfig.color, 0.1),
              color: pagosConfig.color,
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información rápida de la propiedad */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <RoomIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.habitaciones ?? '—'}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Hab.</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <BathIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.banos ?? '—'}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Baños</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CarIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.parqueaderos ?? '—'}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Parq.</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <AreaIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{propiedad.area ?? '—'}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>Área</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información de residentes (solo primeros 2) */}
        <Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600, mb: 1 }}>
          Residentes ({residentes.length})
        </Typography>
        
        {residentes.slice(0, 2).map((residente, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: index < Math.min(residentes.length, 2) - 1 ? `1px solid ${alpha(colors.border, 0.5)}` : 'none',
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

        {residentes.length > 2 && (
          <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', textAlign: 'center', mt: 1 }}>
            +{residentes.length - 2} residentes más
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
              {propiedad?.pagos?.ultimoPago || '—'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Próximo vencimiento
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.warning }}>
              {propiedad?.pagos?.proximoVencimiento || '—'}
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

  const residentes = Array.isArray(propiedad?.residentes) ? propiedad.residentes : [];
  const historial = Array.isArray(propiedad?.pagos?.historial) ? propiedad.pagos.historial : [];
  const documentos = Array.isArray(propiedad?.documentos) ? propiedad.documentos : [];

  const gastosComunes = Number(propiedad?.gastosComunes);
  const valorComercial = Number(propiedad?.valorComercial);
  const fmtMoney = (n) => (Number.isFinite(n) ? `$${Math.round(n).toLocaleString()}` : '—');

  const pagosEstado = String(propiedad?.pagos?.estado || '').toLowerCase();
  const pagosConfig =
    pagosEstado === 'al_dia'
      ? { icon: <CheckCircleIcon />, label: 'Al día', color: colors.success }
      : pagosEstado === 'con_deuda'
        ? { icon: <WarningIcon />, label: 'Con deuda', color: colors.warning }
        : { icon: <InfoIcon />, label: 'Sin info', color: colors.info };

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
                  icon={pagosConfig.icon}
                  label={pagosConfig.label}
                  sx={{
                    ml: 'auto',
                    backgroundColor: alpha(pagosConfig.color, 0.1),
                    color: pagosConfig.color,
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
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.habitaciones ?? '—'}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Habitaciones</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <BathIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.banos ?? '—'}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Baños</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <CarIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.parqueaderos ?? '—'}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>Parqueaderos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <AreaIcon sx={{ color: colors.primary, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ color: colors.text.primary }}>{propiedad.area ?? '—'}</Typography>
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
                    secondary={fmtMoney(valorComercial)}
                    secondaryTypographyProps={{ sx: { fontWeight: 600, color: Number.isFinite(valorComercial) ? colors.success : colors.text.secondary } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ReceiptIcon sx={{ color: colors.warning }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gastos comunes mensuales"
                    secondary={fmtMoney(gastosComunes)}
                    secondaryTypographyProps={{ sx: { fontWeight: 600, color: Number.isFinite(gastosComunes) ? colors.warning : colors.text.secondary } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon sx={{ color: colors.info }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Último pago"
                    secondary={propiedad?.pagos?.ultimoPago || '—'}
                    secondaryTypographyProps={{ sx: { fontWeight: 600 } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon sx={{ color: colors.warning }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Próximo vencimiento"
                    secondary={propiedad?.pagos?.proximoVencimiento || '—'}
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
                Residentes ({residentes.length})
              </Typography>
              
              {residentes.length === 0 ? (
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  No hay residentes asociados en la API para esta unidad.
                </Typography>
              ) : residentes.map((residente, index) => (
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
                  {index < residentes.length - 1 && <Divider sx={{ my: 1 }} />}
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
                    {historial.length === 0 ? (
                      <TableRow hover>
                        <TableCell colSpan={4} sx={{ color: colors.text.secondary }}>
                          Sin historial de pagos
                        </TableCell>
                      </TableRow>
                    ) : historial.map((pago, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{pago.mes || '—'}</TableCell>
                        <TableCell align="right">{fmtMoney(Number(pago.monto))}</TableCell>
                        <TableCell>{pago.fecha || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            icon={String(pago.estado || '').toLowerCase() === 'pagado' ? <CheckCircleIcon /> : <WarningIcon />}
                            label={String(pago.estado || '').toLowerCase() === 'pagado' ? 'Pagado' : 'Pendiente'}
                            size="small"
                            sx={{
                              backgroundColor: alpha(String(pago.estado || '').toLowerCase() === 'pagado' ? colors.success : colors.warning, 0.1),
                              color: String(pago.estado || '').toLowerCase() === 'pagado' ? colors.success : colors.warning,
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
                {documentos.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Sin documentos registrados
                    </Typography>
                  </Grid>
                ) : documentos.map((doc, index) => (
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
                            {doc.nombre || 'Documento'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {doc.fecha || '—'}
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
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let alive = true;

    const safeParseUser = () => {
      try {
        return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      } catch {
        return {};
      }
    };

    const normalizeDateStr = (v) => {
      if (!v) return null;
      const s = String(v);
      return s.includes('T') ? s.split('T')[0] : s;
    };

    const fmtDate = (dateStr) => {
      const d = dateStr ? new Date(dateStr) : null;
      if (!d || Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('es-CO');
    };

    const monthYearEs = (dateStr) => {
      const d = dateStr ? new Date(dateStr) : null;
      if (!d || Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    };

    const load = async () => {
      setLoading(true);
      setLoadError('');
      setPropiedades([]);

      const stored = safeParseUser();
      setPropietario(stored);

      let meUser = null;
      try {
        const me = await authAPI.me();
        const fullData = me?.data || {};
        meUser = fullData?.user || fullData?.residente || fullData;
        
        // Si tiene residente, usarlo para nombre/apellido
        if (fullData?.residente) {
          meUser.nombre = fullData.residente.nombre || meUser.nombre;
          meUser.apellido = fullData.residente.apellido || meUser.apellido;
        }
      } catch {
        // ignore
      }

      // Combinar datos: stored + meUser
      const mergedUser = { ...stored, ...meUser };
      
      // Preferir datos reales de /auth/me para nombre/apellido.
      if (mergedUser && alive) {
        setPropietario(mergedUser);
      }

      const idResidente = mergedUser?.idResidente || mergedUser?.id || stored?.idResidente || stored?.id;
      if (!idResidente) {
        if (!alive) return;
        setLoadError('No se encontró el id del propietario en la sesión. Vuelve a iniciar sesión.');
        setLoading(false);
        return;
      }

      try {
        const [unidadesRes, rpRes, pagosRes, factRes] = await Promise.all([
          residentesAPI.getUnidades(idResidente),
          residentepagosAPI.getAll(),
          paymentAPI.getAll(),
          facturasAPI.getAll(),
        ]);

        const unidadesList = Array.isArray(unidadesRes?.data)
          ? unidadesRes.data
          : Array.isArray(unidadesRes)
            ? unidadesRes
            : [];

        if (!alive) return;

        if (unidadesList.length === 0) {
          setLoadError('No tienes propiedades/unidades en custodia asignadas. Contacta al administrador.');
          setPropiedades([]);
          setLoading(false);
          return;
        }

        const rps = Array.isArray(rpRes?.data) ? rpRes.data : [];
        const pagosDb = Array.isArray(pagosRes?.data) ? pagosRes.data : [];
        const facturasDb = Array.isArray(factRes?.data) ? factRes.data : [];

        const pagosById = new Map(pagosDb.map((p) => [String(p.idPago ?? p.id), p]));
        const rpsMine = rps.filter((rp) => String(rp?.idResidente) === String(idResidente));

        const latestPagoByFacturaId = new Map();
        for (const p of pagosDb) {
          const idFactura = p?.idFactura;
          const idPago = p?.idPago ?? p?.id;
          if (!idFactura || !idPago) continue;
          const estadoPago = String(p?.estadoPago || p?.estado || '').toLowerCase();
          if (estadoPago !== 'procesado') continue;
          const fechaPago = normalizeDateStr(p?.fechaPago);
          const prev = latestPagoByFacturaId.get(String(idFactura));
          if (!prev || String(fechaPago || '') > String(prev.fechaPago || '')) {
            latestPagoByFacturaId.set(String(idFactura), { idPago, fechaPago });
          }
        }

        const paidByFacturaId = new Map();
        for (const rp of rpsMine) {
          const idPago = rp?.idPago;
          const pagoDb = idPago != null ? pagosById.get(String(idPago)) : null;
          const idFactura = pagoDb?.idFactura ?? rp?.idFactura;
          if (!idFactura) continue;
          const fechaPago = normalizeDateStr(rp?.fechaPago || pagoDb?.fechaPago);
          const prev = paidByFacturaId.get(String(idFactura));
          if (!prev || String(fechaPago || '') > String(prev.fechaPago || '')) {
            paidByFacturaId.set(String(idFactura), { fechaPago, idPago });
          }
        }

        const todayStr = new Date().toISOString().split('T')[0];

        const computePagosForUnidad = (idUnidad) => {
          const list = facturasDb.filter((f) => String(f?.idUnidad) === String(idUnidad));
          if (list.length === 0) {
            return { estado: 'sin_info', ultimoPago: '—', proximoVencimiento: '—', historial: [] };
          }

          const enriched = list.map((facturaDb) => {
            const idFactura = facturaDb?.idFactura ?? facturaDb?.id;
            const fechaVenc = normalizeDateStr(facturaDb?.fechaVencimiento);

            const paid = paidByFacturaId.get(String(idFactura));
            const paidFallback = !paid ? latestPagoByFacturaId.get(String(idFactura)) : null;
            const isPaid = Boolean(paid || paidFallback);

            const estado = isPaid
              ? 'pagado'
              : fechaVenc && String(fechaVenc) < todayStr
                ? 'atrasado'
                : 'pendiente';

            return {
              idFactura,
              fechaVenc,
              fechaEmision: normalizeDateStr(facturaDb?.fechaEmision),
              monto: Number(facturaDb?.monto ?? 0),
              estado,
              fechaPago: paid?.fechaPago || paidFallback?.fechaPago || null,
            };
          });

          const unpaid = enriched.filter((x) => x.estado !== 'pagado');
          const paidList = enriched.filter((x) => x.estado === 'pagado');

          const ultimoPago = paidList
            .map((x) => x.fechaPago)
            .filter(Boolean)
            .sort((a, b) => String(b).localeCompare(String(a)))[0];

          const proximoVenc = unpaid
            .map((x) => x.fechaVenc)
            .filter(Boolean)
            .sort((a, b) => String(a).localeCompare(String(b)))[0];

          const estadoUnidad = unpaid.length === 0 ? 'al_dia' : 'con_deuda';

          const historial = enriched
            .slice()
            .sort((a, b) => String(b.fechaVenc || '').localeCompare(String(a.fechaVenc || '')))
            .slice(0, 6)
            .map((x) => ({
              mes: monthYearEs(x.fechaEmision || x.fechaVenc),
              monto: x.monto,
              fecha: x.estado === 'pagado' ? fmtDate(x.fechaPago) : fmtDate(x.fechaVenc),
              estado: x.estado === 'pagado' ? 'pagado' : 'pendiente',
            }));

          return {
            estado: estadoUnidad,
            ultimoPago: ultimoPago ? fmtDate(ultimoPago) : '—',
            proximoVencimiento: proximoVenc ? fmtDate(proximoVenc) : '—',
            historial,
          };
        };

        const mapped = unidadesList.map((u) => {
          const idUnidad = u?.idUnidad ?? u?.id;
          const numero = u?.numero ?? u?.number ?? idUnidad;
          const tipo = u?.tipoUnidad ?? u?.tipo ?? '';
          const areaNum = u?.area;
          const cuotaNum = Number(u?.valorCuota ?? u?.cuota);
          const pagos = computePagosForUnidad(idUnidad);

          return {
            id: idUnidad,
            nombre: numero != null ? `Unidad ${numero}` : 'Unidad',
            ubicacion: tipo || '—',
            area: areaNum != null && areaNum !== '' ? `${areaNum} m²` : '—',
            habitaciones: u?.habitaciones ?? u?.cuartos ?? '—',
            banos: u?.banos ?? u?.baños ?? '—',
            parqueaderos: u?.parqueaderos ?? '—',
            valorComercial: u?.valorComercial ?? null,
            gastosComunes: Number.isFinite(cuotaNum) ? cuotaNum : null,
            residentes: [],
            pagos,
            documentos: [],
            rawUnidad: u,
          };
        });

        setPropiedades(mapped);
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message ?? err?.message ?? 'No se pudieron cargar tus propiedades desde la API';
        setLoadError(msg);
        setPropiedades([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  const displayOwnerName = (u) => {
    const nombre = String(u?.nombre || u?.firstName || '').trim();
    const apellido = String(u?.apellido || u?.lastName || '').trim();
    const full = [nombre, apellido].filter(Boolean).join(' ').trim();
    if (full) return full;
    const name = String(u?.name || '').trim();
    if (name && !name.includes('@')) return name;
    const username = String(u?.username || '').trim();
    if (username && !username.includes('@')) return username;
    return 'Bienvenido';
  };

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

  const classifyTipo = (propiedad) => {
    const tipo = String(propiedad?.rawUnidad?.tipoUnidad ?? propiedad?.rawUnidad?.tipo ?? propiedad?.ubicacion ?? '').toLowerCase();
    if (tipo.includes('parqueadero') || tipo.includes('estacionamiento')) return 'estacionamiento';
    if (tipo.includes('comercial') || tipo.includes('local')) return 'comercial';
    return 'residencial';
  };

  const filteredPropiedades = tabValue === 0
    ? propiedades
    : tabValue === 1
      ? propiedades.filter((p) => classifyTipo(p) === 'residencial')
      : tabValue === 2
        ? propiedades.filter((p) => classifyTipo(p) === 'comercial')
        : propiedades.filter((p) => classifyTipo(p) === 'estacionamiento');

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
        {loadError && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {loadError}
          </Alert>
        )}
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
                {displayOwnerName(propietario)}
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
            { label: 'Al día', value: propiedades.filter((p) => String(p?.pagos?.estado || '').toLowerCase() === 'al_dia').length, icon: <CheckCircleIcon />, color: colors.success },
            { label: 'Con deuda', value: propiedades.filter((p) => String(p?.pagos?.estado || '').toLowerCase() === 'con_deuda').length, icon: <WarningIcon />, color: colors.warning },
            { label: 'Cuota total', value: `$${propiedades.reduce((acc, p) => acc + (Number(p?.gastosComunes) || 0), 0).toLocaleString()}/mes`, icon: <ReceiptIcon />, color: colors.info },
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
          {filteredPropiedades.map((propiedad) => (
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
