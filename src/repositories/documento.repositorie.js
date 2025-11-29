const connection = require("../libs/mysql");
const Documentos = require("../models/documentos.js");

class DocumentosRepository {
    #connection = null;

    constructor() {
        this.initConnection();
    }

    async initConnection() {
        this.#connection = await connection();
    }

    // Obtener todos los documentos
    async get() {
        const [rows] = await this.#connection.execute("SELECT * FROM documentos");

        return rows.map(
            (d) =>
                new Documentos(
                    d.idDocumentos,
                    d.nombre,
                    d.tipo,
                    d.fechaCreacion,
                    d.idUnidad,
                    d.idEmpleado,
                    d.idComunicado
                )
        );
    }

    // Crear un nuevo documento
    async create(documento) {
        const query = `
            INSERT INTO documentos
            (nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            documento.getNombre(),
            documento.getTipo(),
            documento.getFechaCreacion(),
            documento.getIdUnidad(),
            documento.getIdEmpleado(),
            documento.getIdComunicado(),
        ];

        const [result] = await this.#connection.execute(query, values);
        documento.setIdDocumentos(result.insertId);

        return documento;
    }

    // Obtener por ID
    async getById(id) {
        const query = "SELECT * FROM documentos WHERE idDocumentos = ?";
        const [rows] = await this.#connection.execute(query, [id]);

        if (rows.length === 0) return null;

        const d = rows[0];
        return new Documentos(
            d.idDocumentos,
            d.nombre,
            d.tipo,
            d.fechaCreacion,
            d.idUnidad,
            d.idEmpleado,
            d.idComunicado
        );
    }

    // Actualizar documento
    async update(documento) {
        const query = `
            UPDATE documentos
            SET nombre = ?, tipo = ?, fechaCreacion = ?, idUnidad = ?,
                idEmpleado = ?, idComunicado = ?
            WHERE idDocumentos = ?
        `;

        const values = [
            documento.getNombre(),
            documento.getTipo(),
            documento.getFechaCreacion(),
            documento.getIdUnidad(),
            documento.getIdEmpleado(),
            documento.getIdComunicado(),
            documento.getIdDocumentos(),
        ];

        await this.#connection.execute(query, values);
        return documento;
    }

    // Eliminar documento
    async delete(id) {
        const query = "DELETE FROM documentos WHERE idDocumentos = ?";
        await this.#connection.execute(query, [id]);
    }
}

module.exports = DocumentosRepository;