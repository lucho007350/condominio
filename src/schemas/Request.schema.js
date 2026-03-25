const Joi = require('joi');

const idRequestSchema = Joi.object({
  id: Joi.number().integer().positive()
});

const createRequestSchema = Joi.object({
  tipo: Joi.string().valid('peticion', 'queja', 'reclamo', 'sugerencia').required(),
  asunto: Joi.string().min(1).max(200).required(),
  descripcion: Joi.string().min(1).max(2000).required(),
  prioridad: Joi.string().valid('baja', 'media', 'alta').default('media'),
  estado: Joi.string().valid('pendiente', 'en_proceso', 'resuelto', 'rechazado').default('pendiente'),
  fecha: Joi.any(),
  propietarioId: Joi.any(),
  propietarioNombre: Joi.string().allow(null, ''),
  remitenteUsuario: Joi.string().allow(null, ''),
  remitenteNombre: Joi.string().allow(null, '')
});

const updateRequestSchema = Joi.object({
  tipo: Joi.string().valid('peticion', 'queja', 'reclamo', 'sugerencia'),
  asunto: Joi.string().min(3).max(200),
  descripcion: Joi.string().min(10).max(2000),
  prioridad: Joi.string().valid('baja', 'media', 'alta'),
  estado: Joi.string().valid('pendiente', 'en_proceso', 'resuelto', 'rechazado'),
  fecha: Joi.date().iso(),
  propietarioId: Joi.number().integer().allow(null),
  propietarioNombre: Joi.string().allow(null),
  remitenteUsuario: Joi.string().allow(null),
  remitenteNombre: Joi.string().allow(null),
  respuesta: Joi.string().allow(null, '')
});

const updateStatusSchema = Joi.object({
  estado: Joi.string().valid('pendiente', 'en_proceso', 'resuelto', 'rechazado').required()
});

module.exports = {
  idRequestSchema,
  createRequestSchema,
  updateRequestSchema,
  updateStatusSchema
};