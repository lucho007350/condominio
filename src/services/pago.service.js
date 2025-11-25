const PagoRepository = require("../repositories/pago.repositorie.js");
const Pago = require("../models/pagos.js");

class PagoService {
  #repository;

  constructor() {
    this.#repository = new PagoRepository();
  }

  // 🔹 Obtener todos los pagos
  async get() {
    const pagos = await this.#repository.get();
    return pagos.map((p) => p.getValues());
  }

  // 🔹 Crear pago
  async create(fechaPago, monto, metodoPago, estadoPago, idFactura) {
    const pago = new Pago(
      null,
      fechaPago,
      monto,
      metodoPago,
      estadoPago,
      idFactura
    );

    const created = await this.#repository.create(pago);
    return created.getValues();
  }

  // 🔹 Obtener pago por ID
  async getById(id) {
    const pago = await this.#repository.getById(id);
    if (!pago) return null;
    return pago.getValues();
  }

  // 🔹 Actualizar pago
  async update(id, fechaPago, monto, metodoPago, estadoPago, idFactura) {
    const pago = await this.#repository.getById(id);
    if (!pago) return null;

    pago.setFechaPago(fechaPago);
    pago.setMonto(monto);
    pago.setMetodoPago(metodoPago);
    pago.setEstadoPago(estadoPago);
    pago.setIdFactura(idFactura);

    const updated = await this.#repository.update(pago);
    return updated.getValues();
  }

  // 🔹 Eliminar pago
  async delete(id) {
    const pago = await this.#repository.getById(id);
    if (!pago) return null;

    await this.#repository.delete(id);
    return pago.getValues();
  }
}

module.exports = PagoService;
