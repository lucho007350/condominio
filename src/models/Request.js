class Request {

    #idRequest = null;
    #tipo = null;
    #asunto = null;
    #descripcion = null;
    #prioridad = null;
    #estado = null;
    #fecha = null;
    #propietarioId = null;
    #propietarioNombre = null;
    #remitenteUsuario = null;
    #remitenteNombre = null;

    constructor(
        idRequest = null,
        tipo = null,
        asunto = null,
        descripcion = null,
        prioridad = null,
        estado = null,
        fecha = null,
        propietarioId = null,
        propietarioNombre = null,
        remitenteUsuario = null,
        remitenteNombre = null
    ) {
        this.#idRequest = idRequest;
        this.#tipo = tipo;
        this.#asunto = asunto;
        this.#descripcion = descripcion;
        this.#prioridad = prioridad;
        this.#estado = estado;
        this.#fecha = fecha;
        this.#propietarioId = propietarioId;
        this.#propietarioNombre = propietarioNombre;
        this.#remitenteUsuario = remitenteUsuario;
        this.#remitenteNombre = remitenteNombre;
    }

    getIdRequest() {
        return this.#idRequest;
    }

    getTipo() {
        return this.#tipo;
    }

    getAsunto() {
        return this.#asunto;
    }

    getDescripcion() {
        return this.#descripcion;
    }

    getPrioridad() {
        return this.#prioridad;
    }

    getEstado() {
        return this.#estado;
    }

    getFecha() {
        return this.#fecha;
    }

    getPropietarioId() {
        return this.#propietarioId;
    }

    getPropietarioNombre() {
        return this.#propietarioNombre;
    }

    getRemitenteUsuario() {
        return this.#remitenteUsuario;
    }

    getRemitenteNombre() {
        return this.#remitenteNombre;
    }

    setIdRequest(idRequest) {
        this.#idRequest = idRequest;
    }

    setTipo(tipo) {
        this.#tipo = tipo;
    }

    setAsunto(asunto) {
        this.#asunto = asunto;
    }

    setDescripcion(descripcion) {
        this.#descripcion = descripcion;
    }

    setPrioridad(prioridad) {
        this.#prioridad = prioridad;
    }

    setEstado(estado) {
        this.#estado = estado;
    }

    setFecha(fecha) {
        this.#fecha = fecha;
    }

    setPropietarioId(propietarioId) {
        this.#propietarioId = propietarioId;
    }

    setPropietarioNombre(propietarioNombre) {
        this.#propietarioNombre = propietarioNombre;
    }

    setRemitenteUsuario(remitenteUsuario) {
        this.#remitenteUsuario = remitenteUsuario;
    }

    setRemitenteNombre(remitenteNombre) {
        this.#remitenteNombre = remitenteNombre;
    }

    getValues() {
        return {
            idRequest: this.#idRequest,
            tipo: this.#tipo,
            asunto: this.#asunto,
            descripcion: this.#descripcion,
            prioridad: this.#prioridad,
            estado: this.#estado,
            fecha: this.#fecha,
            propietarioId: this.#propietarioId,
            propietarioNombre: this.#propietarioNombre,
            remitenteUsuario: this.#remitenteUsuario,
            remitenteNombre: this.#remitenteNombre
        };
    }
}

module.exports = Request;
