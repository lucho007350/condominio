const connection = require("../libs/mysql");
const Egreso = require("../models/egreso.js");

class EgresoRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Obtener todos los egresos
  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM egresos");

    return rows.map(
      (e) =>
        new Egreso(
          e.idEgreso,
          e.fecha,
          e.monto,
          e.concepto,
          e.idEmpleado
        )
    );
  }

  // 🔹 Crear un nuevo egreso
  async create(egreso) {
    const query = `
      INSERT INTO egresos 
      (fecha, monto, concepto, idEmpleado)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      egreso.getFecha(),
      egreso.getMonto(),
      egreso.getConcepto(),
      egreso.getIdEmpleado(),
    ];

    const [result] = await this.#connection.execute(query, values);
    egreso.setIdEgreso(result.insertId);

    return egreso;
  }

  // 🔹 Obtener un egreso por ID
  async getById(id) {
    const query = "SELECT * FROM egresos WHERE idEgreso = ?";
    const [rows] = await this.#connection.execute(query, [id]);

    if (rows.length === 0) return null;

    const e = rows[0];

    return new Egreso(
      e.idEgreso,
      e.fecha,
      e.monto,
      e.concepto,
      e.idEmpleado
    );
  }

  // 🔹 Actualizar un egreso
  async update(egreso) {
    const query = `
      UPDATE egresos 
      SET fecha = ?, monto = ?, concepto = ?, idEmpleado = ?
      WHERE idEgreso = ?
    `;

    const values = [
      egreso.getFecha(),
      egreso.getMonto(),
      egreso.getConcepto(),
      egreso.getIdEmpleado(),
      egreso.getIdEgreso(),
    ];

    await this.#connection.execute(query, values);

    return egreso;
  }

  // 🔹 Eliminar un egreso
  async delete(id) {
    const query = "DELETE FROM egresos WHERE idEgreso = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = EgresoRepository;
