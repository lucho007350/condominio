const express = require("express");
const router = express.Router();

const validatorHandler = require("../middlewares/validator.handle");
const {
  createResidentePagoSchema,
  getResidentePagoSchema,
} = require("../schemas/residentepago.schema");

const authenticateToken = require("../middlewares/authenticateToken.js");

const ResidentePagoService = require("../services/residentepago.service");
const service = new ResidentePagoService();

// 🔹 Obtener todos los pagos de residentes (protegido)
router.get("/", authenticateToken, async (req, res) => {
  const data = await service.get();
  res.json(data);
});

// 🔹 Crear registro de pago de residente
router.post(
  "/",
  validatorHandler(createResidentePagoSchema, "body"),
  async (req, res) => {
    const data = await service.create(req.body);
    res.json(data);
  }
);

// 🔹 Eliminar registro por ID
router.delete(
  "/:id",
  validatorHandler(getResidentePagoSchema, "params"),
  async (req, res) => {
    const data = await service.delete(req.params.id);
    res.json(data);
  }
);

module.exports = router;
