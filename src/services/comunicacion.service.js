const crypto = require('crypto'); // Para generar un ID único (opcional)
const ComunicacionRepository = require('../repositories/Comunicacion.repositorie.js'); // Repositorio de comunicaciones
const Comunicacion = require('../models/Comunications.js'); // Modelo de comunicación

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
        const id = crypto.randomUUID(); // Genera un ID único
        const comunicacion = new Comunicacion(id, titulo, contenido, fechaPublicacion, tipo); // Crea una nueva instancia

        const createdComunicacion = await this.#repository.create(comunicacion); // Guarda en la base de datos
        return createdComunicacion.getValues(); // Devuelve los valores del registro creado
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
        comunicacion.setTipo(tipo);

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