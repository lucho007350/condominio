const joi = require("joi");

// Campos individuales
const idFactura = joi.number().integer();
const fechaEmision = joi.date();
const monto = joi.number().precision(2);
const fechaVencimiento = joi.date();
const estadoFactura = joi.string().valid("Pendiente", "Pagada", "Vencida");
const idUnidad = joi.number().integer(); // FK a UnidadHabitacional

// Crear factura
const createFacturaSchema = joi.object({
  fechaEmision: fechaEmision.required(),
  monto: monto.required(),
  fechaVencimiento: fechaVencimiento.required(),
  estadoFactura: estadoFactura.required(),
  idUnidad: idUnidad.required(),
});

// Actualizar factura
const updateFacturaSchema = joi.object({
  fechaEmision,
  monto,
  fechaVencimiento,
  estadoFactura,
  idUnidad,
});

// Obtener o eliminar por ID
const getFacturaSchema = joi.object({
  id: joi.number().integer().required(),
});

module.exports = {
  createFacturaSchema,
  updateFacturaSchema,
  getFacturaSchema,
};
