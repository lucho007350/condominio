module.exports = setupRoutes;

const { Router } = require('express');
const unidadesHabitacionalesRouter = require('./unidadHabitacional.router.js');
const residentsRouter = require('./residents.router.js');
const ComunicacionRouter = require('./comunicacion.router.js');
const facturasRouter = require('./facturas.router.js');
const pagosRouter = require('./pago.router.js');


const router = Router();

function setupRoutes(app) {
  // Ruta base principal de la API
  app.use('/api', router);

  // Montamos las rutas específicas
  router.use('/unidades', unidadesHabitacionalesRouter);
  router.use('/residentes', residentsRouter);
  router.use('/comunicaciones', ComunicacionRouter);
  router.use('/facturas', facturasRouter);
    router.use('/pagos', pagosRouter);
 
}

module.exports = setupRoutes;