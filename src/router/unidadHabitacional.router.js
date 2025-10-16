const { Router } = require('express');
const UnidadHabitacionalService = require('../services/UnidadHabitacional.service.js');
const { 
  createUnidadHabitacionalSchema, 
  updateUnidadHabitacionalSchema, 
  getUnidadHabitacionalSchema 
} = require('../schemas/UnidadHabitacional.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const unidadHabitacionalService = new UnidadHabitacionalService();

// 🔹 Obtener todas las unidades habitacionales (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const unidades = await unidadHabitacionalService.get();
    res.status(200).json(unidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las unidades habitacionales" });
  }
});

// 🔹 Crear una nueva unidad habitacional
router.post(
  "/",
  validatorHandler(createUnidadHabitacionalSchema, "body"),
  async (req, res) => {
    try {
      const { tipoUnidad, numero, estado, area, valorCuota } = req.body;
      const unidad = await unidadHabitacionalService.create(
        tipoUnidad,
        numero,
        estado,
        area,
        valorCuota
      );
      res.status(201).json(unidad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear la unidad habitacional" });
    }
  }
);

// 🔹 Obtener una unidad habitacional por ID
router.get(
  "/:id",
  validatorHandler(getUnidadHabitacionalSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const unidad = await unidadHabitacionalService.getById(id);

      if (!unidad) {
        return res.status(404).json({ message: "Unidad habitacional no encontrada" });
      }

      res.status(200).json(unidad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la unidad habitacional" });
    }
  }
);

// 🔹 Actualizar una unidad habitacional
router.put(
  "/:id",
  validatorHandler(getUnidadHabitacionalSchema, "params"),
  validatorHandler(updateUnidadHabitacionalSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { tipoUnidad, numero, estado, area, valorCuota } = req.body;

      const unidad = await unidadHabitacionalService.update(
        id,
        tipoUnidad,
        numero,
        estado,
        area,
        valorCuota
      );

      if (!unidad) {
        return res.status(404).json({ message: "Unidad habitacional no encontrada" });
      }

      res.status(200).json(unidad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la unidad habitacional" });
    }
  }
);

// 🔹 Eliminar una unidad habitacional
router.delete(
  "/:id",
  validatorHandler(getUnidadHabitacionalSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await unidadHabitacionalService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Unidad habitacional no encontrada" });
      }

      res.status(200).json({ message: "Unidad habitacional eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la unidad habitacional" });
    }
  }
);

module.exports = router;
