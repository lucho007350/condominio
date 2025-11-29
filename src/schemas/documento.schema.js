const joi = require("joi");

// Campos individuales
const idDocumentos = joi.number().integer();
const nombre = joi.string().min(2).max(100);

// 🔹 Tipo limitado a dos valores
const tipo = joi.string().valid("cedula", "cedula de extranjeria");

const fechaCreacion = joi.date();
const idUnidad = joi.number().integer();
const idEmpleado = joi.number().integer();
const idComunicado = joi.number().integer();

// Crear documento
const createDocumentoSchema = joi.object({
  nombre: nombre.required(),
  tipo: tipo.required(),
  fechaCreacion: fechaCreacion.required(),
  idUnidad: idUnidad.required(),
  idEmpleado: idEmpleado.required(),
  idComunicado: idComunicado.required(),
});

// Actualizar documento
const updateDocumentoSchema = joi.object({
  nombre,
  tipo,
  fechaCreacion,
  idUnidad,
  idEmpleado,
  idComunicado,
});

// Obtener o eliminar por ID
const getDocumentoSchema = joi.object({
  id: joi.number().integer().required(),
});

module.exports = {
  createDocumentoSchema,
  updateDocumentoSchema,
  getDocumentoSchema,
};