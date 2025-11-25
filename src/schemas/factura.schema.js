const joi = require("joi");

const fechaEmision = joi.date();
const monto = joi.number().positive();
const fechaVencimiento = joi.date();
const estadoFactura = joi.string().valid("Pendiente", "Pagada", "Vencida");
const idUnidad = joi.number().integer();

const createFacturaSchema = joi.object({
  fechaEmision: fechaEmision.required(),
  monto: monto.required(),
  fechaVencimiento: fechaVencimiento.required(),
  estadoFactura: estadoFactura.default("Pendiente"),
  idUnidad: idUnidad.required()
});

module.exports = { createFacturaSchema };
