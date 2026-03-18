const { Router } = require('express');
const RequestService = require('../services/Request.service.js');
const { createRequestSchema, updateRequestSchema, updateStatusSchema, idRequestSchema } = require('../schemas/Request.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const requestService = new RequestService();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const requests = await requestService.get();
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los requests" });
  }
});

router.post(
  "/",
  validatorHandler(createRequestSchema, "body"),
  async (req, res) => {
    try {
      const { tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre } = req.body;
      const request = await requestService.create(tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre);
      res.status(201).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el request" });
    }
  }
);

router.get(
  "/:id",
  validatorHandler(idRequestSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const request = await requestService.getById(id);

      if (!request) {
        return res.status(404).json({ message: "Request no encontrado" });
      }

      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el request" });
    }
  }
);

router.put(
  "/:id",
  validatorHandler(idRequestSchema, "params"),
  validatorHandler(updateRequestSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre } = req.body;

      const request = await requestService.update(id, tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre);

      if (!request) {
        return res.status(404).json({ message: "Request no encontrado" });
      }

      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el request" });
    }
  }
);

router.put(
  "/:id/status",
  validatorHandler(idRequestSchema, "params"),
  validatorHandler(updateStatusSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const request = await requestService.updateStatus(id, estado);

      if (!request) {
        return res.status(404).json({ message: "Request no encontrado" });
      }

      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el estado" });
    }
  }
);

router.delete(
  "/:id",
  validatorHandler(idRequestSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await requestService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Request no encontrado" });
      }

      res.status(200).json({ message: "Request eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el request" });
    }
  }
);

module.exports = router;
