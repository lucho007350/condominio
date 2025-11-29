const joi = require("joi");

// Campos individuales
const idIngreso = joi.number().integer();
const fecha = joi.date();
const monto = joi.number().precision(2);
const concepto = joi.string().min(3).max(100);
const idPago = joi.number().integer();

// Crear ingreso
const createIngresoSchema = joi.object({
  fecha: fecha.required(),
  monto: monto.required(),
  concepto: concepto.required(),
  idPago: idPago.required(),
});

// Actualizar ingreso
const updateIngresoSchema = joi.object({
  fecha,
  monto,
  concepto,
  idPago,
});

// Obtener o eliminar por ID
const getIngresoSchema = joi.object({
  id: joi.number().integer().required(),
});

module.exports = {
  createIngresoSchema,
  updateIngresoSchema,
  getIngresoSchema,
};
