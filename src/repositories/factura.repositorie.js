const connection = require("../libs/mysql");
const Factura = require("../models/Factura");

class FacturaRepository {
  #connection;

  constructor() {
    this.#connection = null;
  }

  // Inicializa la conexión solo si no existe
  async initConnection() {
    if (!this.#connection) {
      this.#connection = await connection();
    }
  }

  async create(data) {
    await this.initConnection();

    const query = `
      INSERT INTO factura 
      (fechaEmision, monto, fechaVencimiento, estadoFactura, idUnidad)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      data.fechaEmision,
      data.monto,
      data.fechaVencimiento,
      data.estadoFactura,
      data.idUnidad
    ];

    const [result] = await this.#connection.execute(query, values);

    return {
      idFactura: result.insertId,
      ...data
    };
  }

  async get() {
    await this.initConnection();

    const query = `
      SELECT f.*, u.numero AS numeroUnidad, u.tipoUnidad
      FROM factura f
      LEFT JOIN unidades_habitacionales u 
        ON f.idUnidad = u.idUnidad
    `;

    const [rows] = await this.#connection.execute(query);
    return rows;
  }

  async getById(id) {
    await this.initConnection();

    const [rows] = await this.#connection.execute(
      "SELECT * FROM factura WHERE idFactura = ?",
      [id]
    );

    return rows[0];
  }

  async update(idFactura, data) {
    await this.initConnection();

    const query = `
      UPDATE factura
      SET fechaEmision = ?, 
          monto = ?, 
          fechaVencimiento = ?, 
          estadoFactura = ?, 
          idUnidad = ?
      WHERE idFactura = ?
    `;

    const values = [
      data.fechaEmision,
      data.monto,
      data.fechaVencimiento,
      data.estadoFactura,
      data.idUnidad,
      idFactura
    ];

    await this.#connection.execute(query, values);

    return {
      idFactura,
      ...data
    };
  }

  async getByUnidad(idUnidad) {
    await this.initConnection();

    const query = `
      SELECT *
      FROM factura
      WHERE idUnidad = ?
    `;

    const [rows] = await this.#connection.execute(query, [idUnidad]);
    return rows;
  }

  async delete(idFactura) {
    await this.initConnection();

    const query = "DELETE FROM factura WHERE idFactura = ?";
    await this.#connection.execute(query, [idFactura]);

    return { message: "Factura eliminada" };
  }
}

module.exports = FacturaRepository;
 // corregido