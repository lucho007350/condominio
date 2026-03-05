const connection = require("../libs/mysql"); // Conexión a la base de datos
const Comunicacion = require("../models/Comunications.js");
const { models } = require("../libs/sequelize.js");

/** Convierte fecha ISO o Date a formato MySQL DATETIME (YYYY-MM-DD HH:MM:SS) */
function toMySQLDateTime(value) {
    if (value == null) return null;
    const d = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

class ComunicacionRepository {

    #comunicaciones = []; // arreglo local de comunicaciones
    #connection = null;

    constructor() {
        this.#comunicaciones = [];
        this.getConnection();
    }

    async getConnection() {
        this.#connection = await connection();
    }

    // 🔹 Obtener todas las comunicaciones (usando Sequelize)
    async get() {
        const [rows] = await this.#connection.execute("SELECT * FROM comunicaciones");
        return rows.map(c =>
            new Comunicacion(
                c.idComunicado,
                c.titulo,
                c.contenido,
                c.fechaPublicacion,
                c.tipo
            )
        );
    }
    

    // 🔹 Crear una nueva comunicación (usando MySQL directo)
    async create(comunicacion) {
        const query = `
            INSERT INTO comunicaciones 
            (titulo, contenido, fechaPublicacion, tipo)
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            comunicacion.getTitulo(),
            comunicacion.getContenido(),
            toMySQLDateTime(comunicacion.getFechaPublicacion()),
            comunicacion.getTipo()
        ];

        const [result] = await this.#connection.execute(query, values);

        comunicacion.setIdComunicado(result.insertId);

        return comunicacion;
    }

    // 🔹 Buscar una comunicación por su ID
    async getById(id) {
        const query = "SELECT * FROM comunicaciones WHERE idComunicado = ?";
        const [rows] = await this.#connection.execute(query, [id]);

        if (rows.length === 0) {
            return null;
        }

        const c = rows[0];
        return new Comunicacion(
            c.idComunicado,
            c.titulo,
            c.contenido,
            c.fechaPublicacion,
            c.tipo
        );
    }

    // 🔹 Actualizar una comunicación existente
    async update(comunicacion) {
        const query = `
            UPDATE comunicaciones 
            SET titulo = ?, contenido = ?, fechaPublicacion = ?, tipo = ?
            WHERE idComunicado = ?
        `;

        const values = [
            comunicacion.getTitulo(),
            comunicacion.getContenido(),
            toMySQLDateTime(comunicacion.getFechaPublicacion()),
            comunicacion.getTipo(),
            comunicacion.getIdComunicado()
        ];

        await this.#connection.execute(query, values);

        return comunicacion;
    }

    // 🔹 Eliminar una comunicación
    async delete(id) {
        const query = "DELETE FROM comunicaciones WHERE idComunicado = ?";
        await this.#connection.execute(query, [id]);
    }
}

module.exports = ComunicacionRepository;