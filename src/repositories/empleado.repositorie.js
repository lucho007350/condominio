const connection = require("../libs/mysql"); // Conexión a la base de datos
const Empleado = require("../models/empleado.js");

class EmpleadoRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Obtener todos los empleados
  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM empleado");

    return rows.map(
      (e) =>
        new Empleado(
          e.idEmpleado,
          e.nombre,
          e.apellido,
          e.cargo,
          e.documento,
          e.telefono,
          e.fechaContratacion
        )
    );
  }

  // 🔹 Crear un nuevo empleado
  async create(empleado) {
    const query = `
      INSERT INTO empleado
      (nombre, apellido, cargo, documento, telefono, fechaContratacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      empleado.getNombre(),
      empleado.getApellido(),
      empleado.getCargo(),
      empleado.getDocumento(),
      empleado.getTelefono(),
      empleado.getFechaContratacion(),
    ];

    const [result] = await this.#connection.execute(query, values);
    empleado.setIdEmpleado(result.insertId);

    return empleado;
  }

  // 🔹 Buscar un empleado por su ID
  async getById(id) {
    const query = "SELECT * FROM empleado WHERE idEmpleado = ?";
    const [rows] = await this.#connection.execute(query, [id]);

    if (rows.length === 0) return null;

    const e = rows[0];
    return new Empleado(
      e.idEmpleado,
      e.nombre,
      e.apellido,
      e.cargo,
      e.documento,
      e.telefono,
      e.fechaContratacion
    );
  }

  // 🔹 Actualizar un empleado
  async update(empleado) {
    const query = `
      UPDATE empleado
      SET nombre = ?, apellido = ?, cargo = ?, documento = ?, 
          telefono = ?, fechaContratacion = ?
      WHERE idEmpleado = ?
    `;

    const values = [
      empleado.getNombre(),
      empleado.getApellido(),
      empleado.getCargo(),
      empleado.getDocumento(),
      empleado.getTelefono(),
      empleado.getFechaContratacion(),
      empleado.getIdEmpleado(),
    ];

    await this.#connection.execute(query, values);

    return empleado;
  }

  // 🔹 Eliminar un empleado
  async delete(id) {
    const query = "DELETE FROM empleado WHERE idEmpleado = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = EmpleadoRepository;
