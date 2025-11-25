const connection = require("../libs/mysql"); // conexión MySQL
const Factura = require("../models/facturasts.js");

class FacturaRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Obtener todas las facturas
  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM factura");

    return rows.map(
      (f) =>
        new Factura(
          f.idFactura,
          f.fechaEmision,
          f.monto,
          f.fechaVencimiento,
          f.estadoFactura,
          f.idUnidad
        )
    );
  }

  // 🔹 Crear una factura
  async create(factura) {
    const query = `
      INSERT INTO factura 
      (fechaEmision, monto, fechaVencimiento, estadoFactura, idUnidad)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      factura.getFechaEmision(),
      factura.getMonto(),
      factura.getFechaVencimiento(),
      factura.getEstadoFactura(),
      factura.getIdUnidad()
    ];

    const [result] = await this.#connection.execute(query, values);
    factura.setIdFactura(result.insertId);

    return factura;
  }

  // 🔹 Buscar factura por ID
  async getById(id) {
    const query = "SELECT * FROM factura WHERE idFactura = ?";
    const [rows] = await this.#connection.execute(query, [id]);

    if (rows.length === 0) return null;

    const f = rows[0];
    return new Factura(
      f.idFactura,
      f.fechaEmision,
      f.monto,
      f.fechaVencimiento,
      f.estadoFactura,
      f.idUnidad
    );
  }

  // 🔹 Actualizar una factura
  async update(factura) {
    const query = `
      UPDATE factura 
      SET fechaEmision = ?, monto = ?, fechaVencimiento = ?, estadoFactura = ?, idUnidad = ?
      WHERE idFactura = ?
    `;

    const values = [
      factura.getFechaEmision(),
      factura.getMonto(),
      factura.getFechaVencimiento(),
      factura.getEstadoFactura(),
      factura.getIdUnidad(),
      factura.getIdFactura(),
    ];

    await this.#connection.execute(query, values);

    return factura;
  }

  // 🔹 Eliminar factura
  async delete(id) {
    const query = "DELETE FROM factura WHERE idFactura = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = FacturaRepository;
