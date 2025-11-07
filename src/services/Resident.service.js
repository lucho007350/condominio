const ResidenteRepository = require("../repositories/resident.repositorie.js");
const Residente = require("../models/Residents.js");

class ResidenteService {
  #repository;

  constructor() {
    this.#repository = new ResidenteRepository();
  }

  // 🔹 Obtener todos
  async get() {
    const residentes = await this.#repository.get();
    return residentes.map((r) => r.getValues());
  }

  // 🔹 Crear
  async create(nombre, apellido, tipoResidente, documento, telefono, correo, estado) {
    const residente = new Residente(
      null,
      nombre,
      apellido,
      tipoResidente,
      documento,
      telefono,
      correo,
      estado
    );

    const created = await this.#repository.create(residente);
    return created.getValues();
  }

  // 🔹 Obtener por ID
  async getById(id) {
    const residente = await this.#repository.getById(id);
    if (!residente) return null;
    return residente.getValues();
  }

  // 🔹 Actualizar
  async update(id, nombre, apellido, tipoResidente, documento, telefono, correo, estado) {
    const residente = await this.#repository.getById(id);
    if (!residente) return null;

    residente.setNombre(nombre);
    residente.setApellido(apellido);
    residente.setTipoResidente(tipoResidente);
    residente.setDocumento(documento);
    residente.setTelefono(telefono);
    residente.setCorreo(correo);
    residente.setEstado(estado);

    const updated = await this.#repository.update(residente);
    return updated.getValues();
  }

  // 🔹 Eliminar
  async delete(id) {
    const residente = await this.#repository.getById(id);
    if (!residente) return null;

    await this.#repository.delete(id);
    return residente.getValues();
  }
}

module.exports = ResidenteService;
