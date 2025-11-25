const joi = require("joi");

// Campos individuales
const idPago = joi.number().integer();
const fechaPago = joi.date();
const monto = joi.number().positive();
const metodoPago = joi.string().valid("Efectivo", "Transferencia", "Tarjeta");
const estadoPago = joi.string().valid("Pendiente", "Procesado", "Rechazado"); // ENUM real de tu tabla
const idFactura = joi.number().integer(); // FK a Factura

// Crear pago
const createPagoSchema = joi.object({
  fechaPago: fechaPago.required(),
  monto: monto.required(),
  metodoPago: metodoPago.required(),
  estadoPago: estadoPago.required(),
  idFactura: idFactura.required(),
});

// Actualizar pago (todos opcionales)
const updatePagoSchema = joi.object({
  fechaPago,
  monto,
  metodoPago,
  estadoPago,
  idFactura,
});

// Obtener o eliminar por ID
const getPagoSchema = joi.object({
  id: joi.number().integer().required(),
});

module.exports = {
  createPagoSchema,
  updatePagoSchema,
  getPagoSchema,
};
