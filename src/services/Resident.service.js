const crypto = require('crypto'); // Para generar un ID único (opcional)
const ResidenteRepository = require('../repositories/resident.repositorie.js'); // Repositorio de residentes
const Residente = require('../models/Residents.js'); // Modelo de residente

class ResidenteService {

    #repository; // Repositorio privado

    constructor() {
        this.#repository = new ResidenteRepository(); // Instanciamos el repositorio
    }

    // 🔹 Obtener todos los residentes
    async get() {
        const residentes = await this.#repository.get(); // Llama al método get() del repositorio
        return residentes.map(residente => residente.getValues()); // Retorna los valores limpios
    }

    // 🔹 Crear un nuevo residente
    async create(nombre, apellido, tipoResidente, documento, telefono, correo, estado) {
        const id = crypto.randomUUID(); // Genera un ID único
        const residente = new Residente(id, nombre, apellido, tipoResidente, documento, telefono, correo, estado); // Crea un nuevo objeto Residente

        const createdResidente = await this.#repository.create(residente); // Lo guarda en la base de datos
        return createdResidente.getValues(); // Devuelve los valores del residente creado
    }

    // 🔹 Obtener un residente por su ID
    async getById(id) {
        const residente = await this.#repository.getById(id);
        if (!residente) {
            return null;
        }
        return residente.getValues();
    }

    // 🔹 Actualizar un residente existente
    async update(id, nombre, apellido, tipoResidente, documento, telefono, correo, estado) {
        const residente = await this.#repository.getById(id);
        if (!residente) {
            return null; // No existe el residente
        }

        // Actualizamos sus propiedades
        residente.setNombre(nombre);
        residente.setApellido(apellido);
        residente.setTipoResidente(tipoResidente);
        residente.setDocumento(documento);
        residente.setTelefono(telefono);
        residente.setCorreo(correo);
        residente.setEstado(estado);

        const updatedResidente = await this.#repository.update(residente);
        return updatedResidente.getValues();
    }

    // 🔹 Eliminar un residente
    async delete(id) {
        const residente = await this.#repository.getById(id);
        if (!residente) {
            return null;
        }

        await this.#repository.delete(id);
        return residente.getValues();
    }
}

module.exports = ResidenteService;
