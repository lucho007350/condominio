const joi = require("joi");

const idUnidadHabitacional = joi.number().integer();
const tipoUnidad = joi.string().min(2).max(50);
const numero = joi.string().min(1).max(10);
const estado = joi.string().valid("Disponible", "Ocupada", "Mantenimiento"); // 👈 CORREGIDO
const area = joi.number().positive();
const valorCuota = joi.number().positive();

// Crear unidad
const createUnidadHabitacionalSchema = joi.object({
  tipoUnidad: tipoUnidad.required(),
  numero: numero.required(),
  estado: estado.required(),
  area: area.required(),
  valorCuota: valorCuota.required(),
});

// Actualizar unidad
const updateUnidadHabitacionalSchema = joi.object({
  tipoUnidad,
  numero,
  estado,
  area,
  valorCuota,
});

// Obtener por ID
const getUnidadHabitacionalSchema = joi.object({
  id: idUnidadHabitacional.required(),
});

module.exports = {
  createUnidadHabitacionalSchema,
  updateUnidadHabitacionalSchema,
  getUnidadHabitacionalSchema,
};
