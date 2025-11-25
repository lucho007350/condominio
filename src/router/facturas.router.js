const { Router } = require("express");
const FacturaService = require("../services/factura.service.js");
const {
  createFacturaSchema,
  updateFacturaSchema,
  getFacturaSchema
} = require("../schemas/factura.schema.js");

const validatorHandler = require("../middlewares/validator.handle.js");
const authenticateToken = require("../middlewares/authenticateToken.js");

const router = Router();
const facturaService = new FacturaService();

// 🔹 Obtener todas las facturas (privado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const facturas = await facturaService.get();
    res.status(200).json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
});

// 🔹 Crear una factura
router.post(
  "/",
  validatorHandler(createFacturaSchema, "body"),
  async (req, res) => {
    try {
      const {
        fechaEmision,
        monto,
        fechaVencimiento,
        estadoFactura,
        idUnidad
      } = req.body;

      const factura = await facturaService.create(
        fechaEmision,
        monto,
        fechaVencimiento,
        estadoFactura,
        idUnidad
      );

      res.status(201).json(factura);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear la factura" });
    }
  }
);

// 🔹 Obtener una factura por ID
router.get(
  "/:id",
  validatorHandler(getFacturaSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const factura = await facturaService.getById(id);

      if (!factura) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      res.status(200).json(factura);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la factura" });
    }
  }
);

// 🔹 Actualizar una factura
router.put(
  "/:id",
  validatorHandler(getFacturaSchema, "params"),
  validatorHandler(updateFacturaSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        fechaEmision,
        monto,
        fechaVencimiento,
        estadoFactura,
        idUnidad
      } = req.body;

      const factura = await facturaService.update(
        id,
        fechaEmision,
        monto,
        fechaVencimiento,
        estadoFactura,
        idUnidad
      );

      if (!factura) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      res.status(200).json(factura);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la factura" });
    }
  }
);

// 🔹 Eliminar una factura
router.delete(
  "/:id",
  validatorHandler(getFacturaSchema, "params"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await facturaService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      res.status(200).json({ message: "Factura eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la factura" });
    }
  }
);

module.exports = router;
