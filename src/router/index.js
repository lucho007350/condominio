const { Router } = require('express');
const residentsRouter = require('./residents.router.js'); // importa el router de residentes
const ComunicacionRouter = require('./comunicacion.router.js');

const router = Router();

function setupRoutes(app) {
  // Ruta base principal de la API
  app.use('/api', router);


  // 🔹 Montamos las rutas de residentes
  router.use('/residentes', residentsRouter);
  router.use('/comunicaciones', ComunicacionRouter);
}

module.exports = setupRoutes;
