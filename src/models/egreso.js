class Egreso {
    #idEgreso = null;
    #fecha = null;
    #monto = null;
    #concepto = null;
    #idEmpleado = null; // FK a empleado

    constructor(
        idEgreso = null,
        fecha = null,
        monto = null,
        concepto = null,
        idEmpleado = null
    ) {
        this.#idEgreso = idEgreso;
        this.#fecha = fecha;
        this.#monto = monto;
        this.#concepto = concepto;
        this.#idEmpleado = idEmpleado;
    }

    // Getters
    getIdEgreso() {
        return this.#idEgreso;
    }

    getFecha() {
        return this.#fecha;
    }

    getMonto() {
        return this.#monto;
    }

    getConcepto() {
        return this.#concepto;
    }

    getIdEmpleado() {
        return this.#idEmpleado;
    }

    // Setters
    setIdEgreso(idEgreso) {
        this.#idEgreso = idEgreso;
    }

    setFecha(fecha) {
        this.#fecha = fecha;
    }

    setMonto(monto) {
        this.#monto = monto;
    }

    setConcepto(concepto) {
        this.#concepto = concepto;
    }

    setIdEmpleado(idEmpleado) {
        this.#idEmpleado = idEmpleado;
    }

    // Retornar valores en objeto
    getValues() {
        return {
            idEgreso: this.#idEgreso,
            fecha: this.#fecha,
            monto: this.#monto,
            concepto: this.#concepto,
            idEmpleado: this.#idEmpleado
        };
    }
}

module.exports = Egreso;
