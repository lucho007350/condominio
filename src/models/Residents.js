class Residente {

    #idResidente = null;
    #nombre = null;
    #apellido = null;
    #tipoResidente = null;
    #documento = null;
    #telefono = null;
    #correo = null;
    #estado = null;

    constructor(
        idResidente = null,
        nombre = null,
        apellido = null,
        tipoResidente = null,
        documento = null,
        telefono = null,
        correo = null,
        estado = null
    ) {
        this.#idResidente = idResidente;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#tipoResidente = tipoResidente;
        this.#documento = documento;
        this.#telefono = telefono;
        this.#correo = correo;
        this.#estado = estado;
    }

    // Getters
    getIdResidente() {
        return this.#idResidente;
    }

    getNombre() {
        return this.#nombre;
    }

    getApellido() {
        return this.#apellido;
    }

    getTipoResidente() {
        return this.#tipoResidente;
    }

    getDocumento() {
        return this.#documento;
    }

    getTelefono() {
        return this.#telefono;
    }

    getCorreo() {
        return this.#correo;
    }

    getEstado() {
        return this.#estado;
    }

    // Setters
    setIdResidente(idResidente) {
        this.#idResidente = idResidente;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    setApellido(apellido) {
        this.#apellido = apellido;
    }

    setTipoResidente(tipoResidente) {
        this.#tipoResidente = tipoResidente;
    }

    setDocumento(documento) {
        this.#documento = documento;
    }

    setTelefono(telefono) {
        this.#telefono = telefono;
    }

    setCorreo(correo) {
        this.#correo = correo;
    }

    setEstado(estado) {
        this.#estado = estado;
    }

    // Devuelve todos los valores del residente como un objeto
    getValues() {
        return {
            idResidente: this.#idResidente,
            nombre: this.#nombre,
            apellido: this.#apellido,
            tipoResidente: this.#tipoResidente,
            documento: this.#documento,
            telefono: this.#telefono,
            correo: this.#correo,
            estado: this.#estado
        };
    }
}

module.exports = Residente;
