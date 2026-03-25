const connection = require("../libs/mysql");
const Request = require("../models/Request.js");

class RequestRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM requests ORDER BY fecha DESC");

    return rows.map(
      (r) =>
        new Request(
          r.idRequest,
          r.tipo,
          r.respuesta,
          r.asunto,
          r.descripcion,
          r.prioridad,
          r.estado,
          r.fecha,
          r.propietarioId,
          r.propietarioNombre,
          r.remitenteUsuario,
          r.remitenteNombre
        )
    );
  }

  async create(request) {
    let fecha = request.getFecha();
    if (fecha) {
      fecha = new Date(fecha).toISOString().slice(0, 19).replace('T', ' ');
    }

    const query = `
      INSERT INTO requests 
      (tipo, asunto, descripcion, prioridad, estado, fecha, propietarioId, propietarioNombre, remitenteUsuario, remitenteNombre)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      request.getTipo(),
      request.getAsunto(),
      request.getDescripcion(),
      request.getPrioridad(),
      request.getEstado(),
      fecha,
      request.getPropietarioId(),
      request.getPropietarioNombre(),
      request.getRemitenteUsuario(),
      request.getRemitenteNombre(),
    ];

    const [result] = await this.#connection.execute(query, values);
    request.setIdRequest(result.insertId);

    return request;
  }

  async getById(id) {
    const [rows] = await this.#connection.execute("SELECT * FROM requests WHERE idRequest = ?", [id]);

    if (rows.length === 0) return null;

    const r = rows[0];
    return new Request(
      r.idRequest,
      r.tipo,
      r.respuesta,
      r.asunto,
      r.descripcion,
      r.prioridad,
      r.estado,
      r.fecha,
      r.propietarioId,
      r.propietarioNombre,
      r.remitenteUsuario,
      r.remitenteNombre
    );
  }

  async update(request) {
    const values = [
      request.getTipo(),
      request.getAsunto(),
      request.getDescripcion(),
      request.getPrioridad(),
      request.getEstado(),
      request.getRespuesta(),
      request.getFecha() ? new Date(request.getFecha()).toISOString().slice(0, 19).replace('T', ' ') : null,
      request.getPropietarioId(),
      request.getPropietarioNombre(),
      request.getRemitenteUsuario(),
      request.getRemitenteNombre(),
      request.getIdRequest(),
    ];

    const query = `
      UPDATE requests 
      SET tipo = ?, asunto = ?, descripcion = ?, prioridad = ?, estado = ?, 
          respuesta = ?, fecha = ?, propietarioId = ?, 
          propietarioNombre = ?, remitenteUsuario = ?, remitenteNombre = ?
      WHERE idRequest = ?
    `;

    await this.#connection.execute(query, values);
    return request;
  }

  async updateStatus(id, estado) {
    const query = "UPDATE requests SET estado = ? WHERE idRequest = ?";
    await this.#connection.execute(query, [estado, id]);
  }

  async delete(id) {
    const query = "DELETE FROM requests WHERE idRequest = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = RequestRepository;