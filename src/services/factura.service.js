const FacturaRepository = require("../repositories/factura.repositorie.js");
const Factura = require("../models/facturasts.js");

class FacturaService {
  #repository;

  constructor() {
    this.#repository = new FacturaRepository();
  }

  // 🔹 Obtener todas las facturas
  async get() {
    const facturas = await this.#repository.get();
    return facturas.map((f) => f.getValues());
  }

  // 🔹 Crear factura
  async create(fechaEmision, monto, fechaVencimiento, estadoFactura, idUnidad) {
    const factura = new Factura(
      null,
      fechaEmision,
      monto,
      fechaVencimiento,
      estadoFactura,
      idUnidad
    );

    const created = await this.#repository.create(factura);
    return created.getValues();
  }

  // 🔹 Obtener factura por ID
  async getById(id) {
    const factura = await this.#repository.getById(id);
    if (!factura) return null;
    return factura.getValues();
  }

  // 🔹 Actualizar factura
  async update(id, fechaEmision, monto, fechaVencimiento, estadoFactura, idUnidad) {
    const factura = await this.#repository.getById(id);
    if (!factura) return null;

    factura.setFechaEmision(fechaEmision);
    factura.setMonto(monto);
    factura.setFechaVencimiento(fechaVencimiento);
    factura.setEstadoFactura(estadoFactura);
    factura.setIdUnidad(idUnidad);

    const updated = await this.#repository.update(factura);
    return updated.getValues();
  }

  // 🔹 Eliminar factura
  async delete(id) {
    const factura = await this.#repository.getById(id);
    if (!factura) return null;

    await this.#repository.delete(id);
    return factura.getValues();
  }
}

module.exports = FacturaService;
