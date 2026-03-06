const EmpleadoRepository = require("../repositories/empleado.repositorie.js");
const Empleado = require("../models/empleado.js");

class EmpleadoService {
  #repository;

  constructor() {
    this.#repository = new EmpleadoRepository();
  }

  // 🔹 Obtener todos
  async get() {
    const empleados = await this.#repository.get();
    return empleados.map((e) => e.getValues());
  }

  // 🔹 Crear
  async create(nombre, apellido, cargo, documento, telefono, fechaContratacion, salario) {
    const empleado = new Empleado(
      null,
      nombre,
      apellido,
      cargo,
      documento,
      telefono,
      fechaContratacion,
      salario
    );
  

    const created = await this.#repository.create(empleado);
    return created.getValues();
  }

  // 🔹 Obtener por ID
  async getById(id) {
    const empleado = await this.#repository.getById(id);
    if (!empleado) return null;
    return empleado.getValues();
  }

  // 🔹 Actualizar
  async update(id, nombre, apellido, cargo, documento, telefono, fechaContratacion, salario) {
    const empleado = await this.#repository.getById(id);
    if (!empleado) return null;

    empleado.setNombre(nombre);
    empleado.setApellido(apellido);
    empleado.setCargo(cargo);
    empleado.setDocumento(documento);
    empleado.setTelefono(telefono);
    empleado.setFechaContratacion(fechaContratacion);
    empleado.setSalario(salario);

    const updated = await this.#repository.update(empleado);
    return updated.getValues();
  }

  // 🔹 Eliminar
  async delete(id) {
    const empleado = await this.#repository.getById(id);
    if (!empleado) return null;

    await this.#repository.delete(id);
    return empleado.getValues();
  }
}

module.exports = EmpleadoService;
