const { Router } = require('express');
const PagoService = require('../services/pago.service.js');
const {
  createPagoSchema,
  updatePagoSchema,
  getPagoSchema
} = require('../schemas/pago.schema.js');

const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const pagoService = new PagoService();

// 🔹 Obtener todos los pagos (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const pagos = await pagoService.get();
    res.status(200).json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pagos" });
  }
});

// 🔹 Crear un pago
router.post(
  "/",
  validatorHandler(createPagoSchema, "body"),
  async (req, res) => {
    try {
      const { fechaPago, monto, metodoPago, estadoPago, idFactura } = req.body;
      const pago = await pagoService.create(
        fechaPago,
        monto,
        metodoPago,
        estadoPago,
        idFactura
      );

      res.status(201).json(pago);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el pago" });
    }
  }
);

// 🔹 Obtener un pago por ID
router.get(
  "/:id",
  validatorHandler(getPagoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const pago = await pagoService.getById(id);

      if (!pago) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }

      res.status(200).json(pago);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el pago" });
    }
  }
);

// 🔹 Actualizar un pago
router.put(
  "/:id",
  validatorHandler(getPagoSchema, "params"),
  validatorHandler(updatePagoSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fechaPago, monto, metodoPago, estadoPago, idFactura } = req.body;

      const pago = await pagoService.update(
        id,
        fechaPago,
        monto,
        metodoPago,
        estadoPago,
        idFactura
      );

      if (!pago) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }

      res.status(200).json(pago);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el pago" });
    }
  }
);

// 🔹 Eliminar un pago
router.delete(
  "/:id",
  validatorHandler(getPagoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pagoService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }

      res.status(200).json({ message: "Pago eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el pago" });
    }
  }
);

module.exports = router;
