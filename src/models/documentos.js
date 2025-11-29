class Documentos {
    #idDocumentos = null;
    #nombre = null;
    #tipo = null;
    #fechaCreacion = null;
    #idUnidad = null;      // FK a UnidadHabitacional
    #idEmpleado = null;    // FK a Empleado
    #idComunicado = null;  // FK a Comunicacion

    constructor(
        idDocumentos = null,
        nombre = null,
        tipo = null,
        fechaCreacion = null,
        idUnidad = null,
        idEmpleado = null,
        idComunicado = null
    ) {
        this.#idDocumentos = idDocumentos;
        this.#nombre = nombre;
        this.#tipo = tipo;
        this.#fechaCreacion = fechaCreacion;
        this.#idUnidad = idUnidad;
        this.#idEmpleado = idEmpleado;
        this.#idComunicado = idComunicado;
    }

    // Getters
    getIdDocumentos() {
        return this.#idDocumentos;
    }

    getNombre() {
        return this.#nombre;
    }

    getTipo() {
        return this.#tipo;
    }

    getFechaCreacion() {
        return this.#fechaCreacion;
    }

    getIdUnidad() {
        return this.#idUnidad;
    }

    getIdEmpleado() {
        return this.#idEmpleado;
    }

    getIdComunicado() {
        return this.#idComunicado;
    }

    // Setters
    setIdDocumentos(idDocumentos) {
        this.#idDocumentos = idDocumentos;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    setTipo(tipo) {
        this.#tipo = tipo;
    }

    setFechaCreacion(fechaCreacion) {
        this.#fechaCreacion = fechaCreacion;
    }

    setIdUnidad(idUnidad) {
        this.#idUnidad = idUnidad;
    }

    setIdEmpleado(idEmpleado) {
        this.#idEmpleado = idEmpleado;
    }

    setIdComunicado(idComunicado) {
        this.#idComunicado = idComunicado;
    }

    // Devuelve todos los valores como un objeto
    getValues() {
        return {
            idDocumentos: this.#idDocumentos,
            nombre: this.#nombre,
            tipo: this.#tipo,
            fechaCreacion: this.#fechaCreacion,
            idUnidad: this.#idUnidad,
            idEmpleado: this.#idEmpleado,
            idComunicado: this.#idComunicado
        };
    }
}

module.exports = Documentos;