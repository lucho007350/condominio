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
      null,
      tipo,
      asunto,
      descripcion,
      prioridad,
      estado,
      fecha,
      propietarioId,
      propietarioNombre,
      remitenteUsuario,
      remitenteNombre
    );

    const created = await this.#repository.create(request);
    return created.getValues();
  }

  async getById(id) {
    const request = await this.#repository.getById(id);
    if (!request) return null;
    return request.getValues();
  }

  async update(id, tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre) {
    const request = await this.#repository.getById(id);
    if (!request) return null;

    request.setTipo(tipo);
    request.setAsunto(asunto);
    request.setDescripcion(descripcion);
    request.setPrioridad(prioridad);
    request.setEstado(estado);
    request.setFecha(fecha);
    request.setPropietarioId(propietarioId);
    request.setPropietarioNombre(propietarioNombre);
    request.setRemitenteUsuario(remitenteUsuario);
    request.setRemitenteNombre(remitenteNombre);

    const updated = await this.#repository.update(request);
    return updated.getValues();
  }

  async updateStatus(id, estado) {
    const request = await this.#repository.getById(id);
    if (!request) return null;

    await this.#repository.updateStatus(id, estado);
    return request.getValues();
  }

  async delete(id) {
    const request = await this.#repository.getById(id);
    if (!request) return null;

    await this.#repository.delete(id);
    return request.getValues();
  }
}

module.exports = RequestService;
