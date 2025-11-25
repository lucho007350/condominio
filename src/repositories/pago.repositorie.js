const connection = require("../libs/mysql");
const Pago = require("../models/pagos.js");

class PagoRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Obtener todos los pagos
  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM pagos");

    return rows.map(
      (p) =>
        new Pago(
          p.idPago,
          p.fechaPago,
          p.monto,
          p.metodoPago,
          p.estadoPago,
          p.idFactura
        )
    );
  }

  // 🔹 Crear un pago
  async create(pago) {
    const query = `
      INSERT INTO pagos
      (fechaPago, monto, metodoPago, estadoPago, idFactura)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      pago.getFechaPago(),
      pago.getMonto(),
      pago.getMetodoPago(),
      pago.getEstadoPago(),
      pago.getIdFactura(),
    ];

    const [result] = await this.#connection.execute(query, values);
    pago.setIdPago(result.insertId);

    return pago;
  }

  // 🔹 Buscar un pago por su ID
  async getById(id) {
    const query = "SELECT * FROM pagos WHERE idPago = ?";
    const [rows] = await this.#connection.execute(query, [id]);

    if (rows.length === 0) return null;

    const p = rows[0];
    return new Pago(
      p.idPago,
      p.fechaPago,
      p.monto,
      p.metodoPago,
      p.estadoPago,
      p.idFactura
    );
  }

  // 🔹 Actualizar un pago
  async update(pago) {
    const query = `
      UPDATE pagos
      SET fechaPago = ?, monto = ?, metodoPago = ?, 
          estadoPago = ?, idFactura = ?
      WHERE idPago = ?
    `;

    const values = [
      pago.getFechaPago(),
      pago.getMonto(),
      pago.getMetodoPago(),
      pago.getEstadoPago(),
      pago.getIdFactura(),
      pago.getIdPago(),
    ];

    await this.#connection.execute(query, values);
    return pago;
  }

  // 🔹 Eliminar un pago
  async delete(id) {
    const query = "DELETE FROM pagos WHERE idPago = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = PagoRepository;
