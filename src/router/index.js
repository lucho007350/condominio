const { Router } = require('express');
const unidadesHabitacionalesRouter = require('./unidadHabitacional.router.js'); // 🔹 nuevo import

const router = Router();

function setupRoutes(app) {
  // Ruta base principal de la API
  app.use('/api', router);

  // 🔹 Montamos las rutas de unidades habitacionales
  router.use('/unidades', unidadesHabitacionalesRouter);
}

module.exports = setupRoutes;