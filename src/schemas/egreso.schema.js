const joi = require("joi");

// Campos individuales
const idEgreso = joi.number().integer();
const fecha = joi.date();
const monto = joi.number().positive();
const concepto = joi.string().min(3).max(150);
const idEmpleado = joi.number().integer();

// Crear egreso
const createEgresoSchema = joi.object({
  fecha: fecha.required(),
  monto: monto.required(),
  concepto: concepto.required(),
  idEmpleado: idEmpleado.required(),
});

// Actualizar egreso
const updateEgresoSchema = joi.object({
  fecha,
  monto,
  concepto,
  idEmpleado,
});

// Obtener / eliminar por ID
const getEgresoSchema = joi.object({
  id: joi.number().integer().required(), // debe coincidir con el parámetro URL
});

module.exports = {
  createEgresoSchema,
  updateEgresoSchema,
  getEgresoSchema,
};
