const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authenticateToken.js");
const validatorHandler = require("../middlewares/validator.handle");
const { createFacturaSchema } = require("../schemas/factura.schema");

const FacturaService = require("../services/factura.service");
const service = new FacturaService();

// 🔐 Traer todas las facturas (con token)
router.get("/", authenticateToken, async (req, res) => {
  const data = await service.get();
  res.json(data);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const factura = await service.getById(id);
    if (!factura) return res.status(404).json({ message: "Factura no encontrada" });
    res.json(factura);
  });
  

// 🔹 Traer facturas de una unidad
router.get("/unidad/:idUnidad", async (req, res) => {
  const { idUnidad } = req.params;
  const data = await service.getByUnidad(idUnidad);
  res.json(data);
});

// 🔹 Crear factura
router.post(
  "/",
  validatorHandler(createFacturaSchema, "body"),
  async (req, res) => {
    const data = await service.create(req.body);
    res.json(data);
  }
);

// 🔹 ACTUALIZAR factura por ID
router.put(
  "/:idFactura",
  async (req, res) => {
    const { idFactura } = req.params;
    const data = await service.update(idFactura, req.body);
    res.json(data);
  }
);

// 🔹 Eliminar factura
router.delete("/:idFactura", async (req, res) => {
  const { idFactura } = req.params;
  const data = await service.delete(idFactura);
  res.json(data);
});

module.exports = router;
