const ResidenteRepository = require("../repositories/resident.repositorie.js");
const Residente = require("../models/Residents.js");
const getConnection = require('../libs/mysql');

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
    console.log('=== ELIMINANDO RESIDENTE ID:', id);
    const residente = await this.#repository.getById(id);
    if (!residente) return null;

    console.log('Residente a eliminar:', residente.getValues());
    
    // Desasignar todas las unidades del residente antes de eliminarlo
    const conn = await getConnection();
    console.log('Desasignando unidades para residente:', id);
    const [result] = await conn.execute(
      'UPDATE residente_unidad SET fechaFin = CURDATE() WHERE idResidente = ? AND fechaFin IS NULL',
      [id]
    );
    console.log('Unidades desasignadas:', result.affectedRows);

    await this.#repository.delete(id);
    console.log('Residente eliminado');
    return residente.getValues();
  }
}

module.exports = ResidenteService;
