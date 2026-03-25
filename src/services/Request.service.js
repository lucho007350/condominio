const RequestRepository = require("../repositories/request.repositorie.js");
const Request = require("../models/Request.js");

class RequestService {
  #repository;

  constructor() {
    this.#repository = new RequestRepository();
  }

  async get() {
    const requests = await this.#repository.get();
    return requests.map((r) => r.getValues());
  }

  async create(tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre) {
    const request = new Request(
      null, tipo, null, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre
    );

    const created = await this.#repository.create(request);
    return created.getValues();
  }

  async getById(id) {
    const request = await this.#repository.getById(id);
    if (!request) return null;
    return request.getValues();
  }

  async update(id, tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre, respuesta) {
    const request = await this.#repository.getById(id);
    if (!request) return null;

    if (tipo !== undefined) request.setTipo(tipo);
    if (asunto !== undefined) request.setAsunto(asunto);
    if (descripcion !== undefined) request.setDescripcion(descripcion);
    if (prioridad !== undefined) request.setPrioridad(prioridad);
    if (estado !== undefined) request.setEstado(estado);
    if (fecha !== undefined) request.setFecha(fecha);
    if (propietarioId !== undefined) request.setPropietarioId(propietarioId);
    if (propietarioNombre !== undefined) request.setPropietarioNombre(propietarioNombre);
    if (remitenteUsuario !== undefined) request.setRemitenteUsuario(remitenteUsuario);
    if (remitenteNombre !== undefined) request.setRemitenteNombre(remitenteNombre);
    if (respuesta !== undefined) request.setRespuesta(respuesta);

    const updated = await this.#repository.update(request);
    return updated.getValues();
  }

  async updateStatus(id, estado) {
    await this.#repository.updateStatus(id, estado);
    return await this.getById(id);
  }

  async delete(id) {
    const request = await this.#repository.getById(id);
    if (!request) return null;
    await this.#repository.delete(id);
    return request.getValues();
  }
}

module.exports = RequestService;