const connection = require("../libs/mysql"); // Conexión a la base de datos
const Ingreso = require("../models/ingreso.js");

class IngresoRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Obtener todos los ingresos
  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM ingresos");

    return rows.map(
      (i) =>
        new Ingreso(
          i.idIngreso,
          i.fecha,
          i.monto,
          i.concepto,
          i.idPago
        )
    );
  }

  // 🔹 Crear un nuevo ingreso
  async create(ingreso) {
    const query = `
      INSERT INTO ingresos 
      (fecha, monto, concepto, idPago)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      ingreso.getFecha(),
      ingreso.getMonto(),
      ingreso.getConcepto(),
      ingreso.getIdPago(),
    ];

    const [result] = await this.#connection.execute(query, values);
    ingreso.setIdIngreso(result.insertId);

    return ingreso;
  }

  // 🔹 Buscar ingreso por ID
  async getById(id) {
    const query = "SELECT * FROM ingresos WHERE idIngreso = ?";
    const [rows] = await this.#connection.execute(query, [id]);

    if (rows.length === 0) return null;

    const i = rows[0];

    return new Ingreso(
      i.idIngreso,
      i.fecha,
      i.monto,
      i.concepto,
      i.idPago
    );
  }

  // 🔹 Actualizar un ingreso
  async update(ingreso) {
    const query = `
      UPDATE ingresos 
      SET fecha = ?, monto = ?, concepto = ?, idPago = ?
      WHERE idIngreso = ?
    `;

    const values = [
      ingreso.getFecha(),
      ingreso.getMonto(),
      ingreso.getConcepto(),
      ingreso.getIdPago(),
      ingreso.getIdIngreso(),
    ];

    await this.#connection.execute(query, values);

    return ingreso;
  }

  // 🔹 Eliminar un ingreso
  async delete(id) {
    const query = "DELETE FROM ingresos WHERE idIngreso = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = IngresoRepository;