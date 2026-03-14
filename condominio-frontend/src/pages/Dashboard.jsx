import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Event as EventIcon,
} from '@mui/icons-material';
// APIs
import { empleadosAPI, facturasAPI, paymentAPI, residentesAPI, unidadesAPI } from '../services/api.jsx';

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
  const list = Array.isArray(data) ? data : [];
  if (list.length === 0) {
    return <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sin datos para mostrar</Typography>;
  }
  const maxValue = Math.max(1, ...list.map(d => Number(d.amount ?? 0)));
  
  return (
    <Box sx={{ mt: 2 }}>
      {list.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              {item.month}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
              ${Number(item.amount ?? 0).toLocaleString()}
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
                width: `${(Number(item.amount ?? 0) / maxValue) * 100}%`,
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
  const list = Array.isArray(data) ? data : [];
  const total = list.reduce((sum, item) => sum + Number(item.value ?? 0), 0);
  if (list.length === 0 || total <= 0) {
    return <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sin datos para mostrar</Typography>;
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 200, height: 200, mb: 2 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          {list.reduce((acc, item, index) => {
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
        {list.map((item, index) => (
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
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalPayments: 0,
    pendingRequests: 0,
    collectionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const [paymentData, setPaymentData] = useState([]);
  const [residentDistribution, setResidentDistribution] = useState([]);
  const [upcomingDue, setUpcomingDue] = useState([]);

  const pieColors = [colors.primary, colors.info, colors.warning];

  useEffect(() => {
    fetchDashboardData();
    const handler = () => fetchDashboardData();
    window.addEventListener('dashboard:refresh', handler);
    return () => window.removeEventListener('dashboard:refresh', handler);
  }, []);

  const toArray = (v) => (Array.isArray(v) ? v : []);
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const safeDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const monthLabelEs = (monthIndex) => (['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][monthIndex] || '');
  const isSameMonth = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  const relativeTimeEs = (date) => {
    const d = safeDate(date);
    if (!d) return '—';
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `Hace ${diffHr} h`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Ayer';
    return `Hace ${diffDay} días`;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [resRes, pagosRes, factRes, unidadesRes, empRes] = await Promise.all([
        residentesAPI.getAll(),
        paymentAPI.getAll(),
        facturasAPI.getAll(),
        unidadesAPI.getAll(),
        empleadosAPI.getAll(),
      ]);

      const residentes = toArray(resRes?.data);
      const pagos = toArray(pagosRes?.data);
      const facturas = toArray(factRes?.data);
      const unidades = toArray(unidadesRes?.data);
      const empleados = toArray(empRes?.data);

      const unidadesById = new Map();
      unidades.forEach((u) => {
        const id = u.idUnidad ?? u.id;
        if (id != null) unidadesById.set(String(id), u);
      });

      // Stats
      const now = new Date();
      const pagosProcesadosMes = pagos
        .filter((p) => String(p.estadoPago ?? p.estado ?? '').toLowerCase() === 'procesado')
        .filter((p) => {
          const fp = safeDate(p.fechaPago);
          return fp ? isSameMonth(fp, now) : false;
        });
      const totalPayments = pagosProcesadosMes.reduce((sum, p) => sum + Number(p.monto ?? 0), 0);

      const facturasPendientes = facturas.filter((f) => {
        const e = String(f.estadoFactura ?? f.estado ?? '').toLowerCase();
        const isPaid = e.includes('pagad');
        return !isPaid;
      });

      const totalFacturaMonto = facturas.reduce((sum, f) => sum + Number(f.monto ?? 0), 0);
      const totalFacturaPagadaMonto = facturas
        .filter((f) => String(f.estadoFactura ?? f.estado ?? '').toLowerCase() === 'pagada')
        .reduce((sum, f) => sum + Number(f.monto ?? 0), 0);
      const collectionRate = totalFacturaMonto > 0 ? Math.round((totalFacturaPagadaMonto / totalFacturaMonto) * 100) : 0;

      setStats({
        totalResidents: residentes.length,
        totalPayments,
        pendingRequests: facturasPendientes.length,
        collectionRate,
      });

      // Charts
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return d;
      });
      const bar = months.map((m) => {
        const amount = pagos
          .filter((p) => String(p.estadoPago ?? p.estado ?? '').toLowerCase() === 'procesado')
          .filter((p) => {
            const fp = safeDate(p.fechaPago);
            return fp ? isSameMonth(fp, m) : false;
          })
          .reduce((sum, p) => sum + Number(p.monto ?? 0), 0);
        return { month: monthLabelEs(m.getMonth()), amount };
      });
      setPaymentData(bar);

      const tipoCounts = residentes.reduce(
        (acc, r) => {
          const t = String(r.tipoResidente ?? '').toLowerCase();
          if (t.includes('prop')) acc.prop += 1;
          else if (t.includes('arren')) acc.arr += 1;
          else acc.other += 1;
          return acc;
        },
        { prop: 0, arr: 0, other: 0 }
      );
      setResidentDistribution([
        { name: 'Propietarios', value: tipoCounts.prop },
        { name: 'Arrendatarios', value: tipoCounts.arr },
        { name: 'Otros', value: tipoCounts.other },
      ]);

      // Upcoming due invoices
      const upcoming = facturas
        .map((f) => {
          const due = safeDate(f.fechaVencimiento ?? f.fecha_vencimiento);
          if (!due) return null;
          const estado = String(f.estadoFactura ?? f.estado ?? '').toLowerCase();
          if (estado.includes('pagad')) return null;
          const idUnidad = f.idUnidad ?? f.unidadId;
          const unidad = idUnidad != null ? unidadesById.get(String(idUnidad)) : null;
          const unitNumber = unidad?.numero ?? unidad?.number ?? idUnidad ?? '-';
          const days = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return {
            key: f.idFactura ?? f.id,
            label: `Factura unidad ${unitNumber}`,
            days,
          };
        })
        .filter(Boolean)
        .filter((x) => x.days >= 0)
        .sort((a, b) => a.days - b.days)
        .slice(0, 3);
      setUpcomingDue(upcoming);

      // Recent activity (payments + pending invoices + latest residents)
      const pagosRecent = pagos
        .map((p) => {
          const fp = safeDate(p.fechaPago);
          const estado = String(p.estadoPago ?? p.estado ?? '').toLowerCase();
          const completed = estado === 'procesado';
          const facturaId = p.idFactura ?? p.id_factura ?? null;
          const factura = facturaId == null
            ? null
            : facturas.find((f) => String(f.idFactura ?? f.id) === String(facturaId));
          const idUnidad = factura?.idUnidad ?? factura?.unidadId;
          const unidad = idUnidad != null ? unidadesById.get(String(idUnidad)) : null;
          const unitNumber = unidad?.numero ?? unidad?.number ?? idUnidad ?? '-';
          const amount = Number(p.monto ?? 0);
          return {
            _date: fp,
            _sort: fp ? fp.getTime() : 0,
            id: `pago-${p.idPago ?? p.id ?? Math.random()}`,
            type: 'payment',
            user: `Unidad ${unitNumber}`,
            amount,
            time: relativeTimeEs(fp),
            status: completed ? 'completed' : 'pending',
          };
        })
        .sort((a, b) => (b._sort ?? 0) - (a._sort ?? 0))
        .slice(0, 4);

      const facturasRecent = facturas
        .map((f) => {
          const refDate = safeDate(
            f.updatedAt ??
            f.fechaActualizacion ??
            f.fecha_actualizacion ??
            f.fechaEmision ??
            f.fecha_emision ??
            f.fechaVencimiento ??
            f.fecha_vencimiento
          );
          const idUnidad = f.idUnidad ?? f.unidadId;
          const unidad = idUnidad != null ? unidadesById.get(String(idUnidad)) : null;
          const unitNumber = unidad?.numero ?? unidad?.number ?? idUnidad ?? '-';
          const amount = Number(f.monto ?? 0);
          const estadoRaw = String(f.estadoFactura ?? f.estado ?? '').toLowerCase();
          const isPaid = estadoRaw.includes('pagad');
          const estadoLabel = isPaid ? 'Pagada' : (f.estadoFactura ?? f.estado ?? 'Pendiente');
          const idFallback = toNumber(f.idFactura ?? f.id);
          return {
            _date: refDate,
            _sort: refDate ? refDate.getTime() : idFallback,
            id: `factura-${f.idFactura ?? f.id ?? Math.random()}`,
            type: 'invoice',
            user: `Unidad ${unitNumber}`,
            description: `Factura ${String(estadoLabel).toLowerCase()}: $${amount.toLocaleString()}`,
            time: relativeTimeEs(refDate),
            status: isPaid ? 'completed' : 'pending',
          };
        })
        .sort((a, b) => (b._sort ?? 0) - (a._sort ?? 0))
        .slice(0, 3);

      const residentesRecent = residentes
        .map((r) => {
          const created = safeDate(
            r.createdAt ??
            r.fechaRegistro ??
            r.fecha_creacion ??
            r.updatedAt ??
            r.fechaActualizacion ??
            r.fecha_actualizacion
          );
          const idFallback = toNumber(r.idResidente ?? r.id);
          const fullName = [r.nombre, r.apellido].filter(Boolean).join(' ') || 'Residente';
          return {
            _date: created,
            _sort: created ? created.getTime() : idFallback,
            id: `residente-${r.idResidente ?? r.id ?? Math.random()}`,
            type: 'new',
            user: fullName,
            description: 'Nuevo residente registrado',
            time: relativeTimeEs(created),
            status: 'completed',
          };
        })
        .sort((a, b) => (b._sort ?? 0) - (a._sort ?? 0))
        .slice(0, 3);

      const empleadosRecent = empleados
        .map((e) => {
          const created = safeDate(
            e.createdAt ??
            e.fechaRegistro ??
            e.fecha_creacion ??
            e.updatedAt ??
            e.fechaActualizacion ??
            e.fecha_actualizacion ??
            e.fechaContratacion
          );
          const idFallback = toNumber(e.idEmpleado ?? e.id);
          const fullName = [e.nombre, e.apellido].filter(Boolean).join(' ') || 'Empleado';
          const cargo = e.cargo ? ` (${e.cargo})` : '';
          return {
            _date: created,
            _sort: created ? created.getTime() : idFallback,
            id: `empleado-${e.idEmpleado ?? e.id ?? Math.random()}`,
            type: 'employee',
            user: fullName,
            description: `Nuevo empleado registrado${cargo}`,
            time: relativeTimeEs(created),
            status: 'completed',
          };
        })
        .sort((a, b) => (b._sort ?? 0) - (a._sort ?? 0))
        .slice(0, 3);

      const unidadesRecent = unidades
        .map((u) => {
          const created = safeDate(
            u.createdAt ??
            u.fechaRegistro ??
            u.fecha_creacion ??
            u.updatedAt ??
            u.fechaActualizacion ??
            u.fecha_actualizacion
          );
          const idFallback = toNumber(u.idUnidad ?? u.id);
          const numero = u.numero ?? u.number ?? idFallback ?? '-';
          const tipo = u.tipoUnidad ?? u.tipo ?? '';
          return {
            _date: created,
            _sort: created ? created.getTime() : idFallback,
            id: `unidad-${u.idUnidad ?? u.id ?? Math.random()}`,
            type: 'unit',
            user: `Unidad ${numero}`,
            description: `Nueva unidad registrada${tipo ? ` (${tipo})` : ''}`,
            time: relativeTimeEs(created),
            status: 'completed',
          };
        })
        .sort((a, b) => (b._sort ?? 0) - (a._sort ?? 0))
        .slice(0, 3);

      // Keep a mix of movement types so non-payment events always show up.
      const mixed = [
        ...pagosRecent.slice(0, 3),
        ...facturasRecent.slice(0, 3),
        ...residentesRecent.slice(0, 2),
        ...empleadosRecent.slice(0, 2),
        ...unidadesRecent.slice(0, 2),
      ];

      const merged = mixed
        .sort((a, b) => (b._sort ?? 0) - (a._sort ?? 0))
        .slice(0, 10)
        .map(({ _date, _sort, ...rest }) => rest);

      setRecentActivity(merged);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al cargar datos del dashboard';
      setError(msg);
      setStats({ totalResidents: 0, totalPayments: 0, pendingRequests: 0, collectionRate: 0 });
      setPaymentData([]);
      setResidentDistribution([]);
      setUpcomingDue([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

      const getActivityIcon = (type) => {
        switch(type) {
          case 'payment':
            return { icon: <PaymentIcon />, color: colors.success, bgColor: alpha(colors.success, 0.1) };
          case 'invoice':
            return { icon: <ReceiptIcon />, color: colors.warning, bgColor: alpha(colors.warning, 0.1) };
          case 'unit':
            return { icon: <HomeIcon />, color: colors.primary, bgColor: alpha(colors.primary, 0.1) };
          case 'employee':
            return { icon: <PeopleIcon />, color: colors.purple, bgColor: alpha(colors.purple, 0.1) };
          default:
            return { icon: <PeopleIcon />, color: colors.info, bgColor: alpha(colors.info, 0.1) };
        }
      };

      const getActivityLabel = (type) => {
        switch(type) {
          case 'payment': return 'Pago';
          case 'invoice': return 'Factura';
          case 'unit': return 'Unidad';
          case 'employee': return 'Empleado';
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
        {error && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: `1px solid ${alpha(colors.error, 0.25)}`, backgroundColor: alpha(colors.error, 0.06) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: colors.error }} />
              <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 600 }}>No se pudieron cargar los datos reales</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 0.5 }}>{error}</Typography>
          </Paper>
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
              title="Facturas pendientes"
              value={stats.pendingRequests}
              icon={ReceiptIcon}
              color={colors.warning}
              subtitle="Pendientes / vencidas"
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
                {residentDistribution.length > 0 ? (
                  <SimplePieChart data={residentDistribution} colors={pieColors} />
                ) : (
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sin datos para mostrar</Typography>
                )}
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
                    onClick={() => navigate('/payments')}
                  />
                  
                  <QuickAction
                    title="Agregar Residente"
                    description="Registrar nuevo residente"
                    icon={PeopleIcon}
                    color={colors.warning}
                    onClick={() => navigate('/residents')}
                  />
                  
                  <QuickAction
                    title="Registrar Empleado"
                    description="Agregar nuevo empleado"
                    icon={AssessmentIcon}
                    color={colors.purple}
                    onClick={() => navigate('/employees')}
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
                  
                  {(upcomingDue.length > 0 ? upcomingDue : []).map((item, index) => (
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
                      <Typography variant="body2">{item.label}</Typography>
                      <Chip
                        label={`${item.days} días`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(item.days <= 3 ? colors.error : item.days <= 10 ? colors.warning : colors.info, 0.1),
                          color: item.days <= 3 ? colors.error : item.days <= 10 ? colors.warning : colors.info,
                        }}
                      />
                    </Box>
                  ))}

                  {upcomingDue.length === 0 && (
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      No hay facturas pendientes con vencimiento proximo
                    </Typography>
                  )}
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
