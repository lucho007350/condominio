const connection = require("../libs/mysql");
const RC = require("../models/ResidenteComunicacion");

class ResidenteComunicacionRepository {
  #connection;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  async create(data) {
    const query = `
      INSERT INTO residente_comunicacion (idResidente, idComunicado, fechaEnvio)
      VALUES (?, ?, NOW())
    `;

    const values = [data.idResidente, data.idComunicado];
    const [result] = await this.#connection.execute(query, values);

    return { id: result.insertId, ...data, fechaEnvio: new Date() };
  }

  async get() {
    const query = `
      SELECT rc.*, r.nombre, r.apellido, c.titulo
      FROM residente_comunicacion rc
      INNER JOIN residentes r ON rc.idResidente = r.idResidente
      INNER JOIN comunicaciones c ON rc.idComunicado = c.idComunicado
    `;

    const [rows] = await this.#connection.execute(query);
    return rows;
  }

  async delete(id) {
    const query = "DELETE FROM residente_comunicacion WHERE id = ?";
    await this.#connection.execute(query, [id]);
    return { message: "Registro eliminado" };
  }
}

module.exports = ResidenteComunicacionRepository;
