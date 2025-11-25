const connection = require("../libs/mysql");
const Factura = require("../models/Factura");

class FacturaRepository {
  #connection;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  async create(data) {
    const query = `
      INSERT INTO facturas (fechaEmision, monto, fechaVencimiento, estadoFactura, idUnidad)
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
    const query = `
      SELECT f.*, u.numero AS numeroUnidad, u.tipoUnidad
      FROM facturas f
      INNER JOIN unidades_habitacionales u ON f.idUnidad = u.idUnidad
    `;

    const [rows] = await this.#connection.execute(query);
    return rows;
  }

  async getById(id) {
    const [rows] = await this.#connection.execute(
      "SELECT * FROM facturas WHERE idFactura = ?",
      [id]
    );
    return rows[0]; // devuelve un solo objeto
  }
  

  async update(idFactura, data) {
    const query = `
      UPDATE facturas
      SET fechaEmision = ?, monto = ?, fechaVencimiento = ?, estadoFactura = ?, idUnidad = ?
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
    const query = `
      SELECT *
      FROM facturas
      WHERE idUnidad = ?
    `;

    const [rows] = await this.#connection.execute(query, [idUnidad]);
    return rows;
  }

  async delete(idFactura) {
    const query = "DELETE FROM facturas WHERE idFactura = ?";
    await this.#connection.execute(query, [idFactura]);
    return { message: "Factura eliminada" };
  }
}

module.exports = FacturaRepository;
