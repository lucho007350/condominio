const joi = require("joi");

const id = joi.number().integer();
const idResidente = joi.number().integer();
const idPago = joi.number().integer();
const montoPagado = joi.number().positive();
const fechaPago = joi.date();

// 🔹 Crear ResidentePago
const createResidentePagoSchema = joi.object({
  idResidente: idResidente.required(),
  idPago: idPago.required(),
  montoPagado: montoPagado.required(),
  fechaPago: fechaPago.optional()
});

// 🔹 Obtener/eliminar por ID
const getResidentePagoSchema = joi.object({
  id: id.required()
});

module.exports = {
  createResidentePagoSchema,
  getResidentePagoSchema
};
