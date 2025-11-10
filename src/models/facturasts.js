class Factura {

    #idFactura = null;
    #fechaEmision = null;
    #monto = null;
    #fechaVencimiento = null;
    #estadoFactura = null;
    #idUnidad = null; // FK a UnidadHabitacional

    constructor(
        idFactura = null,
        fechaEmision = null,
        monto = null,
        fechaVencimiento = null,
        estadoFactura = null,
        idUnidad = null
    ) {
        this.#idFactura = idFactura;
        this.#fechaEmision = fechaEmision;
        this.#monto = monto;
        this.#fechaVencimiento = fechaVencimiento;
        this.#estadoFactura = estadoFactura;
        this.#idUnidad = idUnidad;
    }

    // Getters
    getIdFactura() {
        return this.#idFactura;
    }

    getFechaEmision() {
        return this.#fechaEmision;
    }

    getMonto() {
        return this.#monto;
    }

    getFechaVencimiento() {
        return this.#fechaVencimiento;
    }

    getEstadoFactura() {
        return this.#estadoFactura;
    }

    getIdUnidad() {
        return this.#idUnidad;
    }

    // Setters
    setIdFactura(idFactura) {
        this.#idFactura = idFactura;
    }

    setFechaEmision(fechaEmision) {
        this.#fechaEmision = fechaEmision;
    }

    setMonto(monto) {
        this.#monto = monto;
    }

    setFechaVencimiento(fechaVencimiento) {
        this.#fechaVencimiento = fechaVencimiento;
    }

    setEstadoFactura(estadoFactura) {
        this.#estadoFactura = estadoFactura;
    }

    setIdUnidad(idUnidad) {
        this.#idUnidad = idUnidad;
    }

    // Devuelve los valores de la factura en un objeto plano → ideal para inserts/updates
    getValues() {
        return {
            idFactura: this.#idFactura,
            fechaEmision: this.#fechaEmision,
            monto: this.#monto,
            fechaVencimiento: this.#fechaVencimiento,
            estadoFactura: this.#estadoFactura,
            idUnidad: this.#idUnidad
        };
    }
}

module.exports = Factura;
