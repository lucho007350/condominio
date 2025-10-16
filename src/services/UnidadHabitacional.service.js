const crypto = require('crypto'); // Para generar un ID único (opcional)
const UnidadHabitacionalRepository = require('../repositories/unidadHabitacional.repositorie.js'); // Repositorio de unidad habitacional
const UnidadHabitacional = require('../models/UnidadHabitacional.js'); // Modelo de unidad habitacional

class UnidadHabitacionalService {

    #repository; // Repositorio privado

    constructor() {
        this.#repository = new UnidadHabitacionalRepository(); // Instanciamos el repositorio
    }

    // 🔹 Obtener todas las unidades habitacionales
    async get() {
        const unidades = await this.#repository.get(); // Llama al método get() del repositorio
        return unidades.map(unidad => unidad.getValues()); // Retorna los valores limpios
    }

    // 🔹 Crear una nueva unidad habitacional
    async create(numero, tipoUnidad, area, estado) {
        const id = crypto.randomUUID(); // Genera un ID único (si lo usas)
        const unidad = new UnidadHabitacional(id, numero, tipoUnidad, area, estado); // Crea un nuevo objeto

        const createdUnidad = await this.#repository.create(unidad); // Lo guarda en la base de datos
        return createdUnidad.getValues(); // Devuelve los valores del objeto creado
    }

    // 🔹 Obtener una unidad por su ID
    async getById(id) {
        const unidad = await this.#repository.getById(id);
        if (!unidad) {
            return null;
        }
        return unidad.getValues();
    }

    // 🔹 Actualizar una unidad existente
    async update(id, numero, tipoUnidad, area, estado) {
        const unidad = await this.#repository.getById(id);
        if (!unidad) {
            return null; // No existe la unidad
        }

        // Actualizamos sus propiedades
        unidad.setNumero(numero);
        unidad.setTipoUnidad(tipoUnidad);
        unidad.setArea(area);
        unidad.setEstado(estado);

        const updatedUnidad = await this.#repository.update(unidad);
        return updatedUnidad.getValues();
    }

    // 🔹 Eliminar una unidad
    async delete(id) {
        const unidad = await this.#repository.getById(id);
        if (!unidad) {
            return null;
        }

        await this.#repository.delete(id);
        return unidad.getValues();
    }
}

module.exports = UnidadHabitacionalService;
