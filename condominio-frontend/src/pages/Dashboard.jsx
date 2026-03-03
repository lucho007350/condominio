import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  Divider,
  alpha,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  RequestQuote as RequestIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
  Receipt as ReceiptIcon,
  Build as BuildIcon,
  Event as EventIcon,
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
  pink: '#ec4899',
  orange: '#f97316',
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
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 20px 30px -10px ${alpha(colors.primary, 0.2)}`,
    borderColor: alpha(colors.primary, 0.3),
  },
}));

const GradientButton = styled(Button)(({ bgcolor = colors.primary }) => ({
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.8)} 100%)`,
  color: 'white',
  borderRadius: 12,
  padding: '8px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: `0 4px 10px ${alpha(bgcolor, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(bgcolor, 0.4)}`,
  },
}));

const StatCard = ({ title, value, icon, color, subtitle, trend, trendValue }) => {
  const IconComponent = icon;
  
  return (
    <Zoom in timeout={300}>
      <GlassCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 48,
                height: 48,
                borderRadius: 3,
              }}
            >
              <IconComponent />
            </Avatar>
            {trend && (
              <Chip
                icon={trend === 'up' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                label={`${trendValue}%`}
                size="small"
                sx={{
                  backgroundColor: alpha(trend === 'up' ? colors.success : colors.error, 0.1),
                  color: trend === 'up' ? colors.success : colors.error,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.5 }}>
            {typeof value === 'number' && title.includes('Recaudado') ? `$${value.toLocaleString()}` : value}
            {title === 'Tasa de Cobro' && '%'}
          </Typography>
          
          <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
            {title}
          </Typography>
          
          {subtitle && (
            <Typography variant="caption" sx={{ color: color, mt: 1, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </GlassCard>
    </Zoom>
  );
};

const QuickAction = ({ title, description, icon, color, onClick }) => {
  const IconComponent = icon;
  
  return (
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: `1px solid ${alpha(colors.border, 0.8)}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 10px 20px ${alpha(color, 0.15)}`,
            borderColor: alpha(color, 0.3),
            backgroundColor: alpha(color, 0.02),
          },
        }}
        onClick={onClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 40,
              height: 40,
            }}
          >
            <IconComponent />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

// Componente de gráfico de barras simple (solo con CSS)
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.amount));
  
  return (
    <Box sx={{ mt: 2 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              {item.month}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
              ${item.amount.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 8,
              backgroundColor: alpha(colors.primary, 0.1),
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${(item.amount / maxValue) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                borderRadius: 4,
                transition: 'width 1s ease',
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Componente de gráfico de pastel simple
const SimplePieChart = ({ data, colors: pieColors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 200, height: 200, mb: 2 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          {data.reduce((acc, item, index) => {
            const percentage = item.value / total;
            const startAngle = acc.lastAngle;
            const angle = percentage * 360;
            const endAngle = startAngle + angle;
            
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');
            
            acc.elements.push(
              <path
                key={index}
                d={pathData}
                fill={pieColors[index % pieColors.length]}
                stroke="white"
                strokeWidth="1"
              />
            );
            
            acc.lastAngle = endAngle;
            return acc;
          }, { elements: [], lastAngle: 0 }).elements}
        </svg>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        {data.map((item, index) => (
          <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: pieColors[index] }} />
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              {item.name}: {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalPayments: 0,
    pendingRequests: 0,
    collectionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Datos para gráficos
  const paymentData = [
    { month: 'Ene', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Abr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 },
  ];

  const residentDistribution = [
    { name: 'Propietarios', value: 45 },
    { name: 'Arrendatarios', value: 30 },
    { name: 'Invitados', value: 15 },
  ];

  const pieColors = [colors.primary, colors.info, colors.warning];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setTimeout(() => {
      setStats({
        totalResidents: 128,
        totalPayments: 85000,
        pendingRequests: 12,
        collectionRate: 92,
      });
      
      setRecentActivity([
        { id: 1, type: 'payment', user: 'Juan Pérez', amount: 85000, time: 'Hace 2 horas', status: 'completed' },
        { id: 2, type: 'request', user: 'María García', description: 'Mantenimiento ascensor', time: 'Hace 4 horas', status: 'pending' },
        { id: 3, type: 'new', user: 'Carlos López', description: 'Nuevo residente - Unidad 305', time: 'Ayer', status: 'completed' },
        { id: 4, type: 'payment', user: 'Ana Martínez', amount: 85000, time: 'Ayer', status: 'completed' },
        { id: 5, type: 'request', user: 'Pedro Rodríguez', description: 'Limpieza áreas comunes', time: '2 días', status: 'pending' },
        { id: 6, type: 'payment', user: 'Laura Sánchez', amount: 85000, time: '3 días', status: 'completed' },
      ]);
      
      setLoading(false);
    }, 1000);
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'payment':
        return { icon: <PaymentIcon />, color: colors.success, bgColor: alpha(colors.success, 0.1) };
      case 'request':
        return { icon: <BuildIcon />, color: colors.warning, bgColor: alpha(colors.warning, 0.1) };
      default:
        return { icon: <PeopleIcon />, color: colors.info, bgColor: alpha(colors.info, 0.1) };
    }
  };

  const getActivityLabel = (type) => {
    switch(type) {
      case 'payment': return 'Pago';
      case 'request': return 'Solicitud';
      default: return 'Nuevo';
    }
  };

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
          <DashboardIcon sx={{ fontSize: 60, color: colors.primary, mb: 2, animation: 'pulse 2s infinite' }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            Cargando Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
            Obteniendo datos del sistema
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
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: 'rgba(255,255,255,0.2)',
                }}
              >
                <DashboardIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Panel de Control
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Bienvenido al sistema de gestión del condominio
                </Typography>
              </Box>
            </Box>
            
            <GradientButton
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              bgcolor="rgba(255,255,255,0.2)"
              sx={{ color: 'white' }}
            >
              Actualizar Datos
            </GradientButton>
          </Box>
        </Paper>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Residentes"
              value={stats.totalResidents}
              icon={PeopleIcon}
              color={colors.primary}
              subtitle="Total registrados"
              trend="up"
              trendValue={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Recaudado"
              value={stats.totalPayments}
              icon={MoneyIcon}
              color={colors.success}
              subtitle="Este mes"
              trend="up"
              trendValue={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pendientes"
              value={stats.pendingRequests}
              icon={RequestIcon}
              color={colors.warning}
              subtitle="Solicitudes por atender"
              trend="down"
              trendValue={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tasa de Cobro"
              value={stats.collectionRate}
              icon={TrendingIcon}
              color={colors.purple}
              subtitle="Del total esperado"
              trend="up"
              trendValue={3}
            />
          </Grid>
        </Grid>

        {/* Gráficos simples */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                      Evolución de Pagos
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      Últimos 6 meses
                    </Typography>
                  </Box>
                  <Chip
                    icon={<AssessmentIcon />}
                    label="Ver reporte"
                    size="small"
                    sx={{ backgroundColor: alpha(colors.primary, 0.1), color: colors.primary }}
                  />
                </Box>
                <SimpleBarChart data={paymentData} />
              </CardContent>
            </GlassCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
                  Distribución de Residentes
                </Typography>
                <SimplePieChart data={residentDistribution} colors={pieColors} />
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Contenido principal */}
        <Grid container spacing={3}>
          {/* Actividad Reciente */}
          <Grid item xs={12} lg={8}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                      Actividad Reciente
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      Últimas transacciones y movimientos
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    endIcon={<AddIcon />}
                    sx={{ color: colors.primary }}
                  >
                    Ver todo
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.02) }}>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Tipo</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Descripción</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Usuario</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Tiempo</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Estado</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActivity.map((activity, index) => {
                        const activityIcon = getActivityIcon(activity.type);
                        
                        return (
                          <TableRow
                            key={activity.id}
                            hover
                            onMouseEnter={() => setHoveredRow(activity.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                            sx={{
                              transition: 'all 0.2s ease',
                              backgroundColor: hoveredRow === activity.id ? alpha(colors.primary, 0.02) : 'transparent',
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: activityIcon.bgColor,
                                    color: activityIcon.color,
                                  }}
                                >
                                  {activityIcon.icon}
                                </Avatar>
                                <Typography variant="body2">
                                  {getActivityLabel(activity.type)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {activity.type === 'payment'
                                  ? `Pago de $${activity.amount.toLocaleString()}`
                                  : activity.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{activity.user}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                {activity.time}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {activity.status === 'completed' ? (
                                <Chip
                                  icon={<CheckIcon />}
                                  label="Completado"
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(colors.success, 0.1),
                                    color: colors.success,
                                    '& .MuiChip-icon': { color: colors.success },
                                  }}
                                />
                              ) : (
                                <Chip
                                  icon={<WarningIcon />}
                                  label="Pendiente"
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(colors.warning, 0.1),
                                    color: colors.warning,
                                    '& .MuiChip-icon': { color: colors.warning },
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </GlassCard>
          </Grid>

          {/* Acciones Rápidas */}
          <Grid item xs={12} lg={4}>
            <GlassCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
                  Acciones Rápidas
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <QuickAction
                    title="Registrar Pago"
                    description="Agregar nuevo pago de residente"
                    icon={MoneyIcon}
                    color={colors.success}
                    onClick={() => console.log('Registrar pago')}
                  />
                  
                  <QuickAction
                    title="Nueva Solicitud"
                    description="Crear solicitud de mantenimiento"
                    icon={BuildIcon}
                    color={colors.info}
                    onClick={() => console.log('Nueva solicitud')}
                  />
                  
                  <QuickAction
                    title="Agregar Residente"
                    description="Registrar nuevo residente"
                    icon={PeopleIcon}
                    color={colors.warning}
                    onClick={() => console.log('Agregar residente')}
                  />
                  
                  <QuickAction
                    title="Generar Reporte"
                    description="Crear reporte mensual"
                    icon={AssessmentIcon}
                    color={colors.purple}
                    onClick={() => console.log('Generar reporte')}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Próximos vencimientos */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon sx={{ color: colors.primary, fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary }}>
                      Próximos vencimientos
                    </Typography>
                  </Box>
                  
                  {[
                    { event: 'Pago cuota mensual', days: 5, color: colors.warning },
                    { event: 'Reunión de condominio', days: 7, color: colors.info },
                    { event: 'Mantenimiento ascensor', days: 15, color: colors.success },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < 2 ? `1px solid ${alpha(colors.border, 0.5)}` : 'none',
                      }}
                    >
                      <Typography variant="body2">{item.event}</Typography>
                      <Chip
                        label={`${item.days} días`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(item.color, 0.1),
                          color: item.color,
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;