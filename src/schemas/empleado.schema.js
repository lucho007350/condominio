const joi = require("joi");

// Campos individuales
const idEmpleado = joi.number().integer();
const nombre = joi.string().min(2).max(50);
const apellido = joi.string().min(2).max(50);
const cargo = joi.string().min(3).max(50);
const documento = joi.string().min(5).max(20);
const telefono = joi.string().min(7).max(15);
const fechaContratacion = joi.date();
const salario = joi.number().min(0); // ✅ Campo agregado correctamente

// Crear empleado
const createEmpleadoSchema = joi.object({
  nombre: nombre.required(),
  apellido: apellido.required(),
  cargo: cargo.required(),
  documento: documento.required(),
  telefono: telefono.required(),
  fechaContratacion: fechaContratacion.required(),
  salario: salario.required() // ✅ Ahora sí funciona
});

// Actualizar empleado
const updateEmpleadoSchema = joi.object({
  nombre,
  apellido,
  cargo,
  documento,
  telefono,
  fechaContratacion,
  salario // ✅ permitido pero no obligatorio
});

// Obtener o eliminar por ID
const getEmpleadoSchema = joi.object({
  id: joi.number().integer().required(),
});

module.exports = {
  createEmpleadoSchema,
  updateEmpleadoSchema,
  getEmpleadoSchema,
};