import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, IconButton, LinearProgress, Button, Table,
TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material'; //biblioteca de componentes para interfaz

//iconos
import { People as PeopleIcon, AttachMoney as MoneyIcon, RequestQuote as RequestIcon,
  TrendingUp as TrendingIcon, Refresh as RefreshIcon, Add as AddIcon, CheckCircle as CheckIcon,
  Warning as WarningIcon,} from '@mui/icons-material';

// Importar las APIs de residentes y comunicaciones
import { residentAPI, communicationAPI, empleadosAPI } from '../services/api.jsx';

const Dashboard = () => { 
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalPayments: 0,
    pendingRequests: 0,
    collectionRate: 0,
  });
  const [loading, setLoading] = useState(true); //mostrar cargando si es true y si es false mostrar contenido
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchDashboardData = () => {

    
    
    setTimeout(() => {
      setStats({
        totalResidents: 25,
        totalPayments: 45000,
        pendingRequests: 8,
        collectionRate: 85,
      });
      
      setRecentActivity([
        { id: 1, type: 'payment', user: 'Juan Pérez', amount: 1500, time: 'Hace 2 horas', status: 'completed' },
        { id: 2, type: 'request', user: 'María García', description: 'Mantenimiento ascensor', time: 'Hace 4 horas', status: 'pending' },
        { id: 3, type: 'new', user: 'Carlos López', description: 'Nuevo residente', time: 'Ayer', status: 'completed' },
        { id: 4, type: 'payment', user: 'Ana Martínez', amount: 1500, time: 'Ayer', status: 'completed' },
        { id: 5, type: 'request', user: 'Pedro Rodríguez', description: 'Limpieza áreas comunes', time: '2 días', status: 'pending' },
      ]);
      
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDashboardData(); //llama a la funcion para obtener datos al cargar el componente
    
    // Petición al endpoint get all de residentes
    residentAPI.unidades()// cambio con el parsero
      .then(response => {
        console.log('Unidades obtenidos:', response.data);
      })
      .catch(error => {
        console.error('Error al obtener residentes:', error);
      });

    // Petición al endpoint get all de comunicados
    communicationAPI.getAll()
      .then(response => {
        console.log('Comunicados obtenidos:', response.data);
      })
      .catch(error => {
        console.error('Error al obtener comunicados:', error);
      });

      empleadosAPI.getAll()
        .then(response => {
          console.log('Empleados obtenidos:', response.data);
        })
        .catch(error => {
          console.error('Error al obtener empleados:', error);
        });
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '12px',
              p: 1.5,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
              {typeof value === 'number' && title.includes('Recaudado') ? `$${value.toLocaleString()}` : value}
              {title === 'Tasa de Cobro' && '%'}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const QuickAction = ({ title, description, icon, color, onClick }) => (
    <Paper
      sx={{
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          backgroundColor: `${color}08`,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ color, mr: 1 }}>{icon}</Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            🏢 Panel de Control
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Bienvenido al sistema de gestión del condominio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          sx={{ color: 'white', backgroundColor: '#1e3a5f' }}
        >
          Actualizar
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Residentes"
            value={stats.totalResidents}
            icon={<PeopleIcon />}
            color="#1e3a5f"
            subtitle="Total registrados"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recaudado"
            value={stats.totalPayments}
            icon={<MoneyIcon />}
            color="#2196F3"
            subtitle="Este mes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pendientes"
            value={stats.pendingRequests}
            icon={<RequestIcon />}
            color="#FF9800"
            subtitle="Solicitudes por atender"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tasa de Cobro"
            value={stats.collectionRate}
            icon={<TrendingIcon />}
            color="#9C27B0"
            subtitle="Del total esperado"
          />
        </Grid>
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Actividad Reciente */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                📋 Actividad Reciente
              </Typography>
              <Button size="small" startIcon={<AddIcon />}>
                Ver todo
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Tiempo</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor:
                              activity.type === 'payment'
                                ? '#4CAF5015'
                                : activity.type === 'request'
                                ? '#FF980015'
                                : '#2196F315',
                          }}
                        >
                          {activity.type === 'payment' ? (
                            <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: '#4CAF50' }} />
                          ) : activity.type === 'request' ? (
                            <RequestIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF9800' }} />
                          ) : (
                            <PeopleIcon sx={{ fontSize: 16, mr: 0.5, color: '#2196F3' }} />
                          )}
                          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                            {activity.type === 'payment'
                              ? 'Pago'
                              : activity.type === 'request'
                              ? 'Solicitud'
                              : 'Nuevo'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {activity.type === 'payment'
                          ? `Pago de $${activity.amount}`
                          : activity.description}
                      </TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                      <TableCell>
                        {activity.status === 'completed' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
                            <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <span>Completado</span>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: '#FF9800' }}>
                            <WarningIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <span>Pendiente</span>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Acciones Rápidas */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, boxShadow: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              ⚡ Acciones Rápidas
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <QuickAction
                title="Registrar Pago"
                description="Agregar nuevo pago de residente"
                icon={<MoneyIcon />}
                color="#4CAF50"
                onClick={() => console.log('Registrar pago')}
              />
              
              <QuickAction
                title="Nueva Solicitud"
                description="Crear solicitud de mantenimiento"
                icon={<RequestIcon />}
                color="#2196F3"
                onClick={() => console.log('Nueva solicitud')}
              />
              
              <QuickAction
                title="Agregar Residente"
                description="Registrar nuevo residente"
                icon={<PeopleIcon />}
                color="#FF9800"
                onClick={() => console.log('Agregar residente')}
              />
              
              <QuickAction
                title="Generar Reporte"
                description="Crear reporte mensual"
                icon={<TrendingIcon />}
                color="#9C27B0"
                onClick={() => console.log('Generar reporte')}
              />
            </Box>

            {/* Información adicional */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                📅 Próximos vencimientos
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                • Pago cuota mensual - 5 días
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                • Reunión de condominio - 7 días
              </Typography>
              <Typography variant="body2">
                • Mantenimiento ascensor - 15 días
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};




export default Dashboard;