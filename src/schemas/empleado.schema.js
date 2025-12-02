const joi = require("joi");

// Campos individuales
const idEmpleado = joi.number().integer();
const nombre = joi.string().min(2).max(50);
const apellido = joi.string().min(2).max(50);
const cargo = joi.string().min(3).max(50);
const documento = joi.string().min(5).max(20);
const telefono = joi.string().min(7).max(15);
const fechaContratacion = joi.date();

// Crear empleado
const createEmpleadoSchema = joi.object({
  nombre: nombre.required(),
  apellido: apellido.required(),
  cargo: cargo.required(),
  documento: documento.required(),
  telefono: telefono.required(),
  fechaContratacion: fechaContratacion.required(),
});

// Actualizar empleado
const updateEmpleadoSchema = joi.object({
  nombre,
  apellido,
  cargo,
  documento,
  telefono,
  fechaContratacion,
});

// Obtener o eliminar por ID
const getEmpleadoSchema = joi.object({
  id: joi.number().integer().required(), // debe coincidir con el parámetro de la URL
});

module.exports = {
  createEmpleadoSchema,
  updateEmpleadoSchema,
  getEmpleadoSchema,
};
