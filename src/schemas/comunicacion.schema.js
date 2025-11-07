const joi = require("joi");

// Campos individuales
const idComunicado = joi.number().integer();
const titulo = joi.string().min(3).max(100);
const contenido = joi.string().min(10);
const fechaPublicacion = joi.date();
const tipo = joi.string().valid("Aviso", "Evento", "Reglamento", "Emergencia", "Otro");

// Crear comunicación
const createComunicacionSchema = joi.object({
  titulo: titulo.required(),
  contenido: contenido.required(),
  fechaPublicacion: fechaPublicacion.required(),
  tipo: tipo.required(),
});

// Actualizar comunicación
const updateComunicacionSchema = joi.object({
  titulo,
  contenido,
  fechaPublicacion,
  tipo,
});

// Obtener o eliminar por ID
const getComunicacionSchema = joi.object({
  id: joi.number().integer().required(), // debe coincidir con el parámetro en la URL
});

module.exports = {
  createComunicacionSchema,
  updateComunicacionSchema,
  getComunicacionSchema,
};