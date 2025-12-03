const EgresoRepository = require("../repositories/egreso.repositorie.js");
const Egreso = require("../models/egreso.js");

class EgresoService {
  #repository;

  constructor() {
    this.#repository = new EgresoRepository();
  }

  // 🔹 Obtener todos los egresos
  async get() {
    const egresos = await this.#repository.get();
    return egresos.map((e) => e.getValues());
  }

  // 🔹 Crear un egreso
  async create(fecha, monto, concepto, idEmpleado) {
    const egreso = new Egreso(
      null,
      fecha,
      monto,
      concepto,
      idEmpleado
    );

    const created = await this.#repository.create(egreso);
    return created.getValues();
  }

  // 🔹 Obtener por ID
  async getById(id) {
    const egreso = await this.#repository.getById(id);
    if (!egreso) return null;
    return egreso.getValues();
  }

  // 🔹 Actualizar
  async update(id, fecha, monto, concepto, idEmpleado) {
    const egreso = await this.#repository.getById(id);
    if (!egreso) return null;

    egreso.setFecha(fecha);
    egreso.setMonto(monto);
    egreso.setConcepto(concepto);
    egreso.setIdEmpleado(idEmpleado);

    const updated = await this.#repository.update(egreso);
    return updated.getValues();
  }

  // 🔹 Eliminar
  async delete(id) {
    const egreso = await this.#repository.getById(id);
    if (!egreso) return null;

    await this.#repository.delete(id);
    return egreso.getValues();
  }
}

module.exports = EgresoService;
