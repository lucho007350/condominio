const connection = require("../libs/mysql"); // Conexión a la base de datos
const Comunicacion = require("../models/Comunications.js");
const { models } = require("../libs/sequelize.js");

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

    /**
     * Obtiene los valores permitidos del ENUM de la columna tipo desde la base de datos.
     * Si falta 'Reglamento', intenta añadirlo al ENUM para que se pueda guardar.
     */
    async getTipoEnumValues() {
        if (!this.#connection) await this.getConnection();
        const [rows] = await this.#connection.execute(
            `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comunicaciones' AND COLUMN_NAME = 'tipo'`
        );
        if (!rows.length) return ['otro'];
        const columnType = rows[0].COLUMN_TYPE || '';
        const match = columnType.match(/^enum\((.*)\)$/i);
        if (!match) return ['otro'];
        let valores = match[1].split(',').map(s => s.replace(/^'|'$/g, '').trim());

        const tieneReglamento = valores.some(v => v.toLowerCase() === 'reglamento');
        if (!tieneReglamento && valores.length > 0) {
            const primeraMayuscula = valores[0] && valores[0][0] === valores[0][0].toUpperCase();
            const reglamento = primeraMayuscula ? 'Reglamento' : 'reglamento';
            const orden = ['aviso', 'evento', 'reglamento', 'emergencia', 'otro'];
            const nuevosValores = [];
            for (const nombre of orden) {
                const existente = valores.find(v => v.toLowerCase() === nombre);
                if (existente) nuevosValores.push(existente);
                else if (nombre === 'reglamento') nuevosValores.push(reglamento);
            }
            valores.forEach(v => {
                if (!nuevosValores.find(n => n.toLowerCase() === v.toLowerCase())) nuevosValores.push(v);
            });
            const enumStr = nuevosValores.map(v => `'${v}'`).join(',');
            try {
                await this.#connection.execute(
                    `ALTER TABLE comunicaciones MODIFY COLUMN tipo ENUM(${enumStr}) NOT NULL DEFAULT 'Otro'`
                );
                valores = nuevosValores;
            } catch (e) {
                console.warn('No se pudo añadir Reglamento al ENUM de comunicaciones.tipo:', e.message);
            }
        }
        return valores;
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
            comunicacion.getFechaPublicacion(),
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
            comunicacion.getFechaPublicacion(),
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