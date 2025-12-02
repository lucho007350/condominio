module.exports = setupRoutes;

const { Router } = require('express');
const unidadesHabitacionalesRouter = require('./unidadHabitacional.router.js');
const residentsRouter = require('./residents.router.js');
const ComunicacionRouter = require('./comunicacion.router.js');
const residenteComunicacionRouter = require('./residenteComunicacion.router.js');
const facturaRouter = require("./factura.router");
const pagosRouter = require('./pago.router.js');
const documentosRouter = require("./documento.router.js");
const ingresoRouter = require("./ingreso.router.js");
const empleadosRouter = require("./empleado.router.js");


const router = Router();

function setupRoutes(app) {
  // Ruta base principal de la API
  app.use('/api', router);

  // Montamos las rutas específicas
  router.use('/unidades', unidadesHabitacionalesRouter);
  router.use('/residentes', residentsRouter);
  router.use('/comunicaciones', ComunicacionRouter);
  router.use('/residentesComunicaciones', residenteComunicacionRouter);
  router.use("/facturas", facturaRouter);
  router.use('/pagos', pagosRouter);
  router.use("/documentos", documentosRouter);
  router.use("/ingresos", ingresoRouter);
  router.use("/empleados", empleadosRouter);
}

module.exports = setupRoutes;