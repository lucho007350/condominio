const { Router } = require('express');
const EgresoService = require('../services/egreso.service.js');
const { 
  createEgresoSchema, 
  updateEgresoSchema, 
  getEgresoSchema 
} = require('../schemas/egreso.schema.js');

const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const egresoService = new EgresoService();

// 🔹 Obtener todos los egresos (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const egresos = await egresoService.get();
    res.status(200).json(egresos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los egresos" });
  }
});

// 🔹 Crear un egreso
router.post(
  "/",
  validatorHandler(createEgresoSchema, "body"),
  async (req, res) => {
    try {
      const { fecha, monto, concepto, idEmpleado } = req.body;

      const egreso = await egresoService.create(
        fecha,
        monto,
        concepto,
        idEmpleado
      );

      res.status(201).json(egreso);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el egreso" });
    }
  }
);

// 🔹 Obtener un egreso por ID
router.get(
  "/:id",
  validatorHandler(getEgresoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const egreso = await egresoService.getById(id);

      if (!egreso) {
        return res.status(404).json({ message: "Egreso no encontrado" });
      }

      res.status(200).json(egreso);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el egreso" });
    }
  }
);

// 🔹 Actualizar un egreso
router.put(
  "/:id",
  validatorHandler(getEgresoSchema, "params"),
  validatorHandler(updateEgresoSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fecha, monto, concepto, idEmpleado } = req.body;

      const egreso = await egresoService.update(
        id,
        fecha,
        monto,
        concepto,
        idEmpleado
      );

      if (!egreso) {
        return res.status(404).json({ message: "Egreso no encontrado" });
      }

      res.status(200).json(egreso);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el egreso" });
    }
  }
);

// 🔹 Eliminar un egreso
router.delete(
  "/:id",
  validatorHandler(getEgresoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await egresoService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Egreso no encontrado" });
      }

      res.status(200).json({ message: "Egreso eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el egreso" });
    }
  }
);

module.exports = router;
