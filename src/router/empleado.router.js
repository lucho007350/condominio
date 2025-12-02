const { Router } = require('express');
const EmpleadoService = require('../services/empleado.service.js');
const { createEmpleadoSchema, updateEmpleadoSchema, getEmpleadoSchema } = require('../schemas/empleado.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const empleadoService = new EmpleadoService();

// 🔹 Obtener todos los empleados (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const empleados = await empleadoService.get();
    res.status(200).json(empleados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los empleados" });
  }
});

// 🔹 Crear un empleado
router.post(
  "/",
  validatorHandler(createEmpleadoSchema, "body"),
  async (req, res) => {
    try {
      const { nombre, apellido, cargo, documento, telefono, fechaContratacion } = req.body;
      const empleado = await empleadoService.create(
        nombre,
        apellido,
        cargo,
        documento,
        telefono,
        fechaContratacion
      );

      res.status(201).json(empleado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el empleado" });
    }
  }
);

// 🔹 Obtener un empleado por ID
router.get(
  "/:id",
  validatorHandler(getEmpleadoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await empleadoService.getById(id);

      if (!empleado) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      res.status(200).json(empleado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el empleado" });
    }
  }
);

// 🔹 Actualizar un empleado
router.put(
  "/:id",
  validatorHandler(getEmpleadoSchema, "params"),
  validatorHandler(updateEmpleadoSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, cargo, documento, telefono, fechaContratacion } = req.body;

      const empleado = await empleadoService.update(
        id,
        nombre,
        apellido,
        cargo,
        documento,
        telefono,
        fechaContratacion
      );

      if (!empleado) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      res.status(200).json(empleado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el empleado" });
    }
  }
);

// 🔹 Eliminar un empleado
router.delete(
  "/:id",
  validatorHandler(getEmpleadoSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await empleadoService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      res.status(200).json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el empleado" });
    }
  }
);

module.exports = router;
