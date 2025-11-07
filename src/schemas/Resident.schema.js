const joi = require("joi");

// Campos individuales
const idResidente = joi.number().integer();
const nombre = joi.string().min(2).max(50);
const apellido = joi.string().min(2).max(50);
const tipoResidente = joi.string().valid("Propietario", "Arrendatario");
const documento = joi.string().min(5).max(20);
const telefono = joi.string().min(7).max(15);
const correo = joi.string().email();
const estado = joi.string().valid("Activo", "Inactivo");

// Crear residente
const createResidenteSchema = joi.object({
  nombre: nombre.required(),
  apellido: apellido.required(),
  tipoResidente: tipoResidente.required(),
  documento: documento.required(),
  telefono: telefono.required(),
  correo: correo.required(),
  estado: estado.required(),
});

// Actualizar residente
const updateResidenteSchema = joi.object({
  nombre,
  apellido,
  tipoResidente,
  documento,
  telefono,
  correo,
  estado,
});

// Obtener o eliminar por ID
const getResidenteSchema = joi.object({
  id: joi.number().integer().required(), // debe coincidir con el nombre del parámetro en la URL
});


module.exports = {
  createResidenteSchema,
  updateResidenteSchema,
  getResidenteSchema,
};