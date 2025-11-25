const express = require("express");
const router = express.Router();

const validatorHandler = require("../middlewares/validator.handle");
const { createRCSchema, getRCSchema } = require("../schemas/residenteComunicacion.schema");
const authenticateToken = require('../middlewares/authenticateToken.js');

const RCService = require("../services/residenteComunicacion.service");
const service = new RCService();

router.get("/", authenticateToken, async (req, res) => {
    const data = await service.get();
    res.json(data);
  });

router.post(
  "/",
  validatorHandler(createRCSchema, "body"),
  async (req, res) => {
    const data = await service.create(req.body);
    res.json(data);
  }
);

router.delete(
  "/:id",
  validatorHandler(getRCSchema, "params"),
  async (req, res) => {
    const data = await service.delete(req.params.id);
    res.json(data);
  }
);

module.exports = router;
