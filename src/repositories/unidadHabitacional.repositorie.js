const connection = require("../libs/mysql"); // Conexión directa a la base de datos
const UnidadHabitacional = require("../models/UnidadHabitacional.js"); // Clase del modelo
const { models } = require("../libs/sequelize.js"); // Modelos de Sequelize

class UnidadHabitacionalRepository {

    #unidades = []; 
    #connection = null;

    constructor() {
        this.#unidades = [];
        this.getConnection();
    }

    async getConnection() {
        this.#connection = await connection();
    }

    // 🔹 Obtener todas las unidades (usando Sequelize)
    async get() {
        const unidades = await models.UnidadHabitacional.findAll();
        return unidades.map(u =>
            new UnidadHabitacional(
                u.idUnidad,
                u.tipoUnidad,
                u.numero,
                u.estado,
                u.area,
                u.valorCuota
            )
        );
    }

    // 🔹 Crear una nueva unidad (usando MySQL directo)
    async create(unidad) {
        const query = `
            INSERT INTO unidades_habitacionales 
            (tipoUnidad, numero, estado, area, valorCuota)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            unidad.getTipoUnidad(),
            unidad.getNumero(),
            unidad.getEstado(),
            unidad.getArea(),
            unidad.getValorCuota()
        ];

        const [result] = await this.#connection.execute(query, values);

        unidad.setIdUnidad(result.insertId);

        return unidad;
    }

    // 🔹 Buscar una unidad por su ID
    async getById(id) {
        const query = "SELECT * FROM unidades_habitacionales WHERE idUnidad = ?";
        const [rows] = await this.#connection.execute(query, [id]);

        if (rows.length === 0) {
            return null;
        }

        const u = rows[0];
        return new UnidadHabitacional(
            u.idUnidad,
            u.tipoUnidad,
            u.numero,
            u.estado,
            u.area,
            u.valorCuota
        );
    }

    // 🔹 Actualizar una unidad existente
    async update(unidad) {
        const query = `
            UPDATE unidades_habitacionales
            SET tipoUnidad = ?, numero = ?, estado = ?, area = ?, valorCuota = ?
            WHERE idUnidad = ?
        `;

        const values = [
            unidad.getTipoUnidad(),
            unidad.getNumero(),
            unidad.getEstado(),
            unidad.getArea(),
            unidad.getValorCuota(),
            unidad.getIdUnidad()
        ];

        await this.#connection.execute(query, values);

        return unidad;
    }

    // 🔹 Eliminar una unidad
    async delete(id) {
        const query = "DELETE FROM unidades_habitacionales WHERE idUnidad = ?";
        await this.#connection.execute(query, [id]);
    }
}

module.exports = UnidadHabitacionalRepository;





