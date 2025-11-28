const DocumentoRepository = require("../repositories/documento.repositorie.js");
const Documentos = require("../models/documentos.js");

class DocumentoService {
  #repository;

  constructor() {
    this.#repository = new DocumentoRepository();
  }

  // 🔹 Obtener todos
  async get() {
    const documentos = await this.#repository.get();
    return documentos.map((d) => d.getValues());
  }

  // 🔹 Crear
  async create(nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado) {
    const documento = new Documentos(
      null,
      nombre,
      tipo,
      fechaCreacion,
      idUnidad,
      idEmpleado,
      idComunicado
    );

    const created = await this.#repository.create(documento);
    return created.getValues();
  }

  // 🔹 Obtener por ID
  async getById(id) {
    const documento = await this.#repository.getById(id);
    if (!documento) return null;
    return documento.getValues();
  }

  // 🔹 Actualizar
  async update(id, nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado) {
    const documento = await this.#repository.getById(id);
    if (!documento) return null;

    documento.setNombre(nombre);
    documento.setTipo(tipo);
    documento.setFechaCreacion(fechaCreacion);
    documento.setIdUnidad(idUnidad);
    documento.setIdEmpleado(idEmpleado);
    documento.setIdComunicado(idComunicado);

    const updated = await this.#repository.update(documento);
    return updated.getValues();
  }

  // 🔹 Eliminar
  async delete(id) {
    const documento = await this.#repository.getById(id);
    if (!documento) return null;

    await this.#repository.delete(id);
    return documento.getValues();
  }
}

module.exports = DocumentoService;
