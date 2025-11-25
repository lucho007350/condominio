const joi = require("joi");

const id = joi.number().integer();
const idResidente = joi.number().integer();
const idComunicado = joi.number().integer();

const createRCSchema = joi.object({
  idResidente: idResidente.required(),
  idComunicado: idComunicado.required()
});

const getRCSchema = joi.object({
  id: id.required()
});

module.exports = { createRCSchema, getRCSchema };
