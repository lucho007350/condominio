const { Router } = require('express');
const IngresoService = require('../services/ingreso.service.js');
const { createIngresoSchema, updateIngresoSchema, getIngresoSchema } = require('../schemas/ingreso.schema.js');

const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const ingresoService = new IngresoService();

// 🔹 Obtener todos los ingresos (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const ingresos = await ingresoService.get();
    res.status(200).json(ingresos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los ingresos" });
  }
});

// 🔹 Crear un ingreso
router.post(
  "/",
  validatorHandler(createIngresoSchema, "body"),
  async (req, res) => {
    try {
      const { fecha, monto, concepto, idPago } = req.body;
      const ingreso = await ingresoService.create(fecha, monto, concepto, idPago);
      res.status(201).json(ingreso);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el ingreso" });
    }
  }
);

// 🔹 Obtener un ingreso por ID
router.get(
  "/:id",
  validatorHandler(getIngresoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const ingreso = await ingresoService.getById(id);

      if (!ingreso) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }

      res.status(200).json(ingreso);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el ingreso" });
    }
  }
);

// 🔹 Actualizar un ingreso
router.put(
  "/:id",
  validatorHandler(getIngresoSchema, "params"),
  validatorHandler(updateIngresoSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fecha, monto, concepto, idPago } = req.body;

      const ingreso = await ingresoService.update(id, fecha, monto, concepto, idPago);

      if (!ingreso) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }

      res.status(200).json(ingreso);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el ingreso" });
    }
  }
);

// 🔹 Eliminar un ingreso
router.delete(
  "/:id",
  validatorHandler(getIngresoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ingresoService.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }

      res.status(200).json({ message: "Ingreso eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el ingreso" });
    }
  }
);

module.exports = router;
