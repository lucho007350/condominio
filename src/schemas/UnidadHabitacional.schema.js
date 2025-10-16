const joi = require("joi");

// Campos individuales
const idUnidad = joi.number().integer();
const numero = joi.string().min(1).max(10);
const tipoUnidad = joi.string().valid("Apartamento", "Casa");
const area = joi.number().positive();
const estado = joi.string().valid("Ocupado", "Desocupado");

// Crear unidad habitacional
const createUnidadHabitacionalSchema = joi.object({
  numero: numero.required(),
  tipoUnidad: tipoUnidad.required(),
  area: area.required(),
  estado: estado.required(),
});

// Actualizar unidad habitacional
const updateUnidadHabitacionalSchema = joi.object({
  numero,
  tipoUnidad,
  area,
  estado,
});

// Obtener o eliminar por ID
const getUnidadHabitacionalSchema = joi.object({
  id: joi.number().integer().required(), // debe coincidir con el nombre del parámetro en la URL
});

module.exports = {
  createUnidadHabitacionalSchema,
  updateUnidadHabitacionalSchema,
  getUnidadHabitacionalSchema,
};
