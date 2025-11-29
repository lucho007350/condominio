const IngresoRepository = require("../repositories/ingreso.repositorie.js");
const Ingreso = require("../models/ingreso.js");

class IngresoService {
  #repository;

  constructor() {
    this.#repository = new IngresoRepository();
  }

  // 🔹 Obtener todos
  async get() {
    const ingresos = await this.#repository.get();
    return ingresos.map((i) => i.getValues());
  }

  // 🔹 Crear
  async create(fecha, monto, concepto, idPago) {
    const ingreso = new Ingreso(
      null,
      fecha,
      monto,
      concepto,
      idPago
    );

    const created = await this.#repository.create(ingreso);
    return created.getValues();
  }

  // 🔹 Obtener por ID
  async getById(id) {
    const ingreso = await this.#repository.getById(id);
    if (!ingreso) return null;

    return ingreso.getValues();
  }

  // 🔹 Actualizar
  async update(id, fecha, monto, concepto, idPago) {
    const ingreso = await this.#repository.getById(id);
    if (!ingreso) return null;

    ingreso.setFecha(fecha);
    ingreso.setMonto(monto);
    ingreso.setConcepto(concepto);
    ingreso.setIdPago(idPago);

    const updated = await this.#repository.update(ingreso);
    return updated.getValues();
  }

  // 🔹 Eliminar
  async delete(id) {
    const ingreso = await this.#repository.getById(id);
    if (!ingreso) return null;

    await this.#repository.delete(id);
    return ingreso.getValues();
  }
}

module.exports = IngresoService;