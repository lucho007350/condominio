const connection = require("../libs/mysql"); // Conexión a la base de datos
const Residente = require("../models/Residents.js");

class ResidenteRepository {
  #connection = null;

  constructor() {
    this.initConnection();
  }

  async initConnection() {
    this.#connection = await connection();
  }

  // 🔹 Obtener todos los residentes
  async get() {
    const [rows] = await this.#connection.execute("SELECT * FROM residentes");

    return rows.map(
      (r) =>
        new Residente(
          r.idResidente,
          r.nombre,
          r.apellido,
          r.tipoResidente,
          r.documento,
          r.telefono,
          r.correo,
          r.estado
        )
    );
  }

  // 🔹 Crear un nuevo residente
  async create(residente) {
    const query = `
      INSERT INTO residentes 
      (nombre, apellido, tipoResidente, documento, telefono, correo, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      residente.getNombre(),
      residente.getApellido(),
      residente.getTipoResidente(),
      residente.getDocumento(),
      residente.getTelefono(),
      residente.getCorreo(),
      residente.getEstado(),
    ];

    const [result] = await this.#connection.execute(query, values);
    residente.setIdResidente(result.insertId);

    return residente;
  }

  // 🔹 Buscar un residente por su ID
  async getById(id) {
    const query = "SELECT * FROM residentes WHERE idResidente = ?";
    const [rows] = await this.#connection.execute(query, [id]);

    if (rows.length === 0) return null;

    const r = rows[0];
    return new Residente(
      r.idResidente,
      r.nombre,
      r.apellido,
      r.tipoResidente,
      r.documento,
      r.telefono,
      r.correo,
      r.estado
    );
  }

  // 🔹 Actualizar un residente
  async update(residente) {
    const query = `
      UPDATE residentes 
      SET nombre = ?, apellido = ?, tipoResidente = ?, documento = ?, 
          telefono = ?, correo = ?, estado = ?
      WHERE idResidente = ?
    `;

    const values = [
      residente.getNombre(),
      residente.getApellido(),
      residente.getTipoResidente(),
      residente.getDocumento(),
      residente.getTelefono(),
      residente.getCorreo(),
      residente.getEstado(),
      residente.getIdResidente(),
    ];

    await this.#connection.execute(query, values);

    return residente;
  }

  // 🔹 Eliminar un residente
  async delete(id) {
    const query = "DELETE FROM residentes WHERE idResidente = ?";
    await this.#connection.execute(query, [id]);
  }
}

module.exports = ResidenteRepository;
