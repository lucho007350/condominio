const { Router } = require('express');
const ResidenteService = require('../services/Resident.service.js');
const { createResidenteSchema, updateResidenteSchema, getResidenteSchema } = require('../schemas/Resident.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const residenteService = new ResidenteService();

// 🔹 Obtener todos los residentes (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const residentes = await residenteService.get();
    res.status(200).json(residentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los residentes" });
  }
});

// 🔹 Crear un residente
router.post(
  "/",
  validatorHandler(createResidenteSchema, "body"),
  async (req, res) => {
    try {
      const { nombre, apellido, tipoResidente, documento, telefono, correo, estado } = req.body;
      const residente = await residenteService.create(nombre, apellido, tipoResidente, documento, telefono, correo, estado);
      res.status(201).json(residente);
    } catch (error) {
      console.error(error);
      const code = error?.code;
      const errno = error?.errno;

      // MySQL duplicate entry
      if (code === 'ER_DUP_ENTRY' || errno === 1062) {
        return res.status(409).json({ message: 'Ya existe un residente con ese documento o correo' });
      }

      res.status(500).json({ message: error?.message || "Error al crear el residente" });
    }
  }
);

// 🔹 Obtener un residente por ID
router.get(
  "/:id",
  validatorHandler(getResidenteSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const residente = await residenteService.getById(id);

      if (!residente) {
        return res.status(404).json({ message: "Residente no encontrado" });
      }

      res.status(200).json(residente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el residente" });
    }
  }
);

// 🔹 Actualizar un residente
router.put(
  "/:id",
  validatorHandler(getResidenteSchema, "params"),
  validatorHandler(updateResidenteSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, tipoResidente, documento, telefono, correo, estado } = req.body;

      const residente = await residenteService.update(id, nombre, apellido, tipoResidente, documento, telefono, correo, estado);

      if (!residente) {
        return res.status(404).json({ message: "Residente no encontrado" });
      }

      res.status(200).json(residente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el residente" });
    }
  }
);

// 🔹 Eliminar un residente
router.delete(
  "/:id",
  validatorHandler(getResidenteSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await residenteService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Residente no encontrado" });
      }

      res.status(200).json({ message: "Residente eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el residente" });
    }
  }
);

module.exports = router;
