module.exports = setupRoutes;

const { Router } = require('express');
const unidadesHabitacionalesRouter = require('./unidadHabitacional.router.js');
const residentsRouter = require('./residents.router.js');

const router = Router();

function setupRoutes(app) {
  // Ruta base principal de la API
  app.use('/api', router);

  // Montamos las rutas específicas
  router.use('/unidades', unidadesHabitacionalesRouter);
  router.use('/residentes', residentsRouter);
}

module.exports = setupRoutes;