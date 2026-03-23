const { Router } = require('express');
const ResidenteService = require('../services/Resident.service.js');
const { createResidenteSchema, updateResidenteSchema, getResidenteSchema } = require('../schemas/Resident.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');
const joi = require('joi');
const getConnection = require('../libs/mysql');

const router = Router();
const residenteService = new ResidenteService();

const assignUnidadSchema = joi.object({
  idUnidad: joi.number().integer().required(),
});

const residenteIdParamsSchema = joi.object({
  id: joi.number().integer().required(),
});

const residenteUnidadParamsSchema = joi.object({
  id: joi.number().integer().required(),
  idUnidad: joi.number().integer().required(),
});

// 🔹 Obtener todos los residentes (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const residentes = await residenteService.get();
    res.status(200).json(residentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener residentes' });
  }
});

// 🔹 Obtener unidades de un residente (privado)
router.get(
  "/:id/unidades",
  authenticateToken,
  validatorHandler(residenteIdParamsSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const role = String(req.user?.role || '').toLowerCase();
      const isAdmin = role === 'admin';
      const isSelf = req.user?.idResidente && String(req.user.idResidente) === String(id);
      
      if (!isAdmin && !isSelf) {
        return res.status(403).json({ message: 'No autorizado para ver unidades' });
      }

      const conn = await getConnection();
      const [rows] = await conn.execute(
        `
          SELECT ru.id, ru.idResidente, ru.idUnidad, ru.fechaInicio, ru.fechaFin,
                 u.numero, u.tipoUnidad, u.estado, u.area, u.valorCuota
          FROM residente_unidad ru
          INNER JOIN unidades_habitacionales u ON ru.idUnidad = u.idUnidad
          WHERE ru.idResidente = ? AND ru.fechaFin IS NULL
          ORDER BY u.numero
        `,
        [id]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener unidades del residente' });
    }
  }
);

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
        return res.status(404).json({ message: 'Residente no encontrado' });
      }
      res.status(200).json(residente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el residente' });
    }
  }
);

// 🔹 Asignar una unidad a un residente (privado: admin)
router.post(
  '/:id/unidades',
  authenticateToken,
  validatorHandler(residenteIdParamsSchema, 'params'),
  validatorHandler(assignUnidadSchema, 'body'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { idUnidad } = req.body;
      const role = String(req.user?.role || '').toLowerCase();
      const isAdmin = role === 'admin';
      const isSelf = req.user?.idResidente && String(req.user.idResidente) === String(id);
      
      if (!isAdmin && !isSelf) {
        return res.status(403).json({ message: 'No autorizado para asignar unidades' });
      }

      const conn = await getConnection();

      const [existing] = await conn.execute(
        'SELECT id FROM residente_unidad WHERE idResidente = ? AND idUnidad = ? AND fechaFin IS NULL LIMIT 1',
        [id, idUnidad]
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: 'La unidad ya esta asignada a este residente' });
      }

      const [result] = await conn.execute(
        'INSERT INTO residente_unidad (idResidente, idUnidad, fechaInicio) VALUES (?, ?, CURDATE())',
        [id, idUnidad]
      );

      res.status(201).json({ id: result.insertId, idResidente: Number(id), idUnidad: Number(idUnidad) });
    } catch (error) {
      console.error(error);
      const code = error?.code;
      const errno = error?.errno;
      if (code === 'ER_NO_REFERENCED_ROW_2' || errno === 1452) {
        return res.status(400).json({ message: 'Residente o unidad no existen' });
      }
      res.status(500).json({ message: 'Error al asignar unidad' });
    }
  }
);

// 🔹 Desasignar una unidad (cierra la asignacion) (privado: admin)
router.delete(
  '/:id/unidades/:idUnidad',
  authenticateToken,
  validatorHandler(residenteUnidadParamsSchema, 'params'),
  async (req, res) => {
    try {
      const role = String(req.user?.role || '').toLowerCase();
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Solo admin puede desasignar unidades' });
      }

      const { id, idUnidad } = req.params;
      const conn = await getConnection();
      const [result] = await conn.execute(
        'UPDATE residente_unidad SET fechaFin = CURDATE() WHERE idResidente = ? AND idUnidad = ? AND fechaFin IS NULL',
        [id, idUnidad]
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: 'Asignacion no encontrada' });
      }
      res.status(200).json({ message: 'Unidad desasignada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al desasignar unidad' });
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
