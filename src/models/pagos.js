class Pago {

    #idPago = null;
    #fechaPago = null;
    #monto = null;
    #metodoPago = null;
    #estadoPago = null;
    #idFactura = null; // FK hacia Factura

    constructor(
        idPago = null,
        fechaPago = null,
        monto = null,
        metodoPago = null,
        estadoPago = null,
        idFactura = null
    ) {
        this.#idPago = idPago;
        this.#fechaPago = fechaPago;
        this.#monto = monto;
        this.#metodoPago = metodoPago;
        this.#estadoPago = estadoPago;
        this.#idFactura = idFactura;
    }

    // ======================
    //         GETTERS
    // ======================

    getIdPago() {
        return this.#idPago;
    }

    getFechaPago() {
        return this.#fechaPago;
    }

    getMonto() {
        return this.#monto;
    }

    getMetodoPago() {
        return this.#metodoPago;
    }

    getEstadoPago() {
        return this.#estadoPago;
    }

    getIdFactura() {
        return this.#idFactura;
    }

    // ======================
    //         SETTERS
    // ======================

    setIdPago(idPago) {
        this.#idPago = idPago;
    }

    setFechaPago(fechaPago) {
        this.#fechaPago = fechaPago;
    }

    setMonto(monto) {
        this.#monto = monto;
    }

    setMetodoPago(metodoPago) {
        this.#metodoPago = metodoPago;
    }

    setEstadoPago(estadoPago) {
        this.#estadoPago = estadoPago;
    }

    setIdFactura(idFactura) {
        this.#idFactura = idFactura;
    }

    // ======================
    //   Obtener valores
    // ======================

    getValues() {
        return {
            idPago: this.#idPago,
            fechaPago: this.#fechaPago,
            monto: this.#monto,
            metodoPago: this.#metodoPago,
            estadoPago: this.#estadoPago,
            idFactura: this.#idFactura
        };
    }
}

module.exports = Pago;
