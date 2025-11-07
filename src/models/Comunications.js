class Comunicacion {

    #idComunicado = null;
    #titulo = null;
    #contenido = null;
    #fechaPublicacion = null;
    #tipo = null;

    constructor(
        idComunicado = null,
        titulo = null,
        contenido = null,
        fechaPublicacion = null,
        tipo = null
    ) {
        this.#idComunicado = idComunicado;
        this.#titulo = titulo;
        this.#contenido = contenido;
        this.#fechaPublicacion = fechaPublicacion;
        this.#tipo = tipo;
    }

    // Getters
    getIdComunicado() {
        return this.#idComunicado;
    }

    getTitulo() {
        return this.#titulo;
    }

    getContenido() {
        return this.#contenido;
    }

    getFechaPublicacion() {
        return this.#fechaPublicacion;
    }

    getTipo() {
        return this.#tipo;
    }

    // Setters
    setIdComunicado(idComunicado) {
        this.#idComunicado = idComunicado;
    }

    setTitulo(titulo) {
        this.#titulo = titulo;
    }

    setContenido(contenido) {
        this.#contenido = contenido;
    }

    setFechaPublicacion(fechaPublicacion) {
        this.#fechaPublicacion = fechaPublicacion;
    }

    setTipo(tipo) {
        this.#tipo = tipo;
    }

    // Devuelve todos los valores de la comunicación como objeto
    getValues() {
        return {
            idComunicado: this.#idComunicado,
            titulo: this.#titulo,
            contenido: this.#contenido,
            fechaPublicacion: this.#fechaPublicacion,
            tipo: this.#tipo
        };
    }
}

module.exports = Comunicacion;
