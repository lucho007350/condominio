const connection = require("../libs/mysql"); // Conexión a la base de datos
const Residente = require("../models/Residents.js");
const { models } = require("../libs/sequelize.js");

class ResidenteRepository {

    #residentes = []; // arreglo local de residentes
    #connection = null;

    constructor() {
        this.#residentes = [];

        this.getConnection();
    }

    async getConnection() {
        this.#connection = await connection();
    }

    // 🔹 Obtener todos los residentes (usando Sequelize)
    async get() {
        const residentes = await models.Resident.findAll();
        return residentes.map(res =>
            new Residente(
                res.idResidente,
                res.nombre,
                res.apellido,
                res.tipoResidente,
                res.documento,
                res.telefono,
                res.correo,
                res.estado
            )
        );
    }

    // 🔹 Crear un nuevo residente (usando MySQL directo)
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
            residente.getEstado()
        ];

        const [result] = await this.#connection.execute(query, values);

        residente.setIdResidente(result.insertId);

        return residente;
    }

    // 🔹 Buscar un residente por su ID
    async getById(id) {
        const query = "SELECT * FROM residentes WHERE idResidente = ?";
        const [rows] = await this.#connection.execute(query, [id]);

        if (rows.length === 0) {
            return null;
        }

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

    // 🔹 Actualizar un residente existente
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
            residente.getIdResidente()
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
