const crypto = require('crypto');
const ComunicacionRepository = require('../repositories/Comunicacion.repositorie.js');
const Comunicacion = require('../models/Comunications.js');

class ComunicacionService {

    #repository; // Repositorio privado

    constructor() {
        this.#repository = new ComunicacionRepository(); // Instanciamos el repositorio
    }

    // 🔹 Obtener todas las comunicaciones
    async get() {
        const comunicaciones = await this.#repository.get(); // Llama al método get() del repositorio
        return comunicaciones.map(comunicacion => comunicacion.getValues()); // Retorna los valores limpios
    }

    // 🔹 Crear una nueva comunicación
    async create(titulo, contenido, fechaPublicacion, tipo) {
        // El validador Joi ya garantiza que 'tipo' es uno de:
        // 'Aviso', 'Evento', 'Reglamento', 'Emergencia', 'Otro'
        const id = crypto.randomUUID();
        const comunicacion = new Comunicacion(id, titulo, contenido, fechaPublicacion, tipo);

        const createdComunicacion = await this.#repository.create(comunicacion);
        return createdComunicacion.getValues();
    }

    // 🔹 Obtener una comunicación por su ID
    async getById(id) {
        const comunicacion = await this.#repository.getById(id);
        if (!comunicacion) {
            return null;
        }
        return comunicacion.getValues();
    }

    // 🔹 Actualizar una comunicación existente
    async update(id, titulo, contenido, fechaPublicacion, tipo) {
        const comunicacion = await this.#repository.getById(id);
        if (!comunicacion) {
            return null; // No existe la comunicación
        }

        // Actualizamos sus propiedades
        comunicacion.setTitulo(titulo);
        comunicacion.setContenido(contenido);
        comunicacion.setFechaPublicacion(fechaPublicacion);
        // 'tipo' ya viene validado por Joi como uno de los valores permitidos
        if (tipo !== undefined) {
            comunicacion.setTipo(tipo);
        }

        const updatedComunicacion = await this.#repository.update(comunicacion);
        return updatedComunicacion.getValues();
    }

    // 🔹 Eliminar una comunicación
    async delete(id) {
        const comunicacion = await this.#repository.getById(id);
        if (!comunicacion) {
            return null;
        }

        await this.#repository.delete(id);
        return comunicacion.getValues();
    }
}

module.exports = ComunicacionService;