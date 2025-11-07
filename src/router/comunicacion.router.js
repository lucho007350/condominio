const { Router } = require('express');
const ComunicacionService = require('../services/Comunicacion.service.js');
const { 
  createComunicacionSchema, 
  updateComunicacionSchema, 
  getComunicacionSchema 
} = require('../schemas/Comunicacion.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const comunicacionService = new ComunicacionService();

// 🔹 Obtener todas las comunicaciones (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const comunicaciones = await comunicacionService.get();
    res.status(200).json(comunicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las comunicaciones" });
  }
});

// 🔹 Crear una comunicación
router.post(
  "/",
  validatorHandler(createComunicacionSchema, "body"),
  async (req, res) => {
    try {
      const { titulo, contenido, fechaPublicacion, tipo } = req.body;
      const comunicacion = await comunicacionService.create(
        titulo,
        contenido,
        fechaPublicacion,
        tipo
      );
      res.status(201).json(comunicacion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear la comunicación" });
    }
  }
);

// 🔹 Obtener una comunicación por ID
router.get(
  "/:id",
  validatorHandler(getComunicacionSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const comunicacion = await comunicacionService.getById(id);

      if (!comunicacion) {
        return res.status(404).json({ message: "Comunicación no encontrada" });
      }

      res.status(200).json(comunicacion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la comunicación" });
    }
  }
);

// 🔹 Actualizar una comunicación
router.put(
  "/:id",
  validatorHandler(getComunicacionSchema, "params"),
  validatorHandler(updateComunicacionSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, contenido, fechaPublicacion, tipo } = req.body;

      const comunicacion = await comunicacionService.update(
        id,
        titulo,
        contenido,
        fechaPublicacion,
        tipo
      );

      if (!comunicacion) {
        return res.status(404).json({ message: "Comunicación no encontrada" });
      }

      res.status(200).json(comunicacion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la comunicación" });
    }
  }
);

// 🔹 Eliminar una comunicación
router.delete(
  "/:id",
  validatorHandler(getComunicacionSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await comunicacionService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Comunicación no encontrada" });
      }

      res.status(200).json({ message: "Comunicación eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la comunicación" });
    }
  }
);

module.exports = router;
