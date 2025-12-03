const connection = require("../libs/mysql");
const ResidentePago = require("../models/residentepago.js");

class ResidentePagoRepository {
  #connection;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Crear registro de pago de residente
  async create(data) {
    const query = `
      INSERT INTO residente_pago (idResidente, idPago, montoPagado, fechaPago)
      VALUES (?, ?, ?, NOW())
    `;

    const values = [data.idResidente, data.idPago, data.montoPagado];
    const [result] = await this.#connection.execute(query, values);

    return {
      id: result.insertId,
      ...data,
      fechaPago: new Date(),
    };
  }

  // 🔹 Obtener todos (JOIN con residentes y pagos)
  async get() {
    const query = `
      SELECT rp.*, r.nombre, r.apellido, p.monto AS montoPagoOriginal, p.metodoPago
      FROM residente_pago rp
      INNER JOIN residentes r ON rp.idResidente = r.idResidente
      INNER JOIN pagos p ON rp.idPago = p.idPago
    `;

    const [rows] = await this.#connection.execute(query);
    return rows;
  }

  // 🔹 Eliminar por ID
  async delete(id) {
    const query = "DELETE FROM residente_pago WHERE id = ?";
    await this.#connection.execute(query, [id]);
    return { message: "Registro eliminado" };
  }
}

module.exports = ResidentePagoRepository;
