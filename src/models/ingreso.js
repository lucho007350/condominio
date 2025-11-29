class Ingreso {

    #idIngreso = null;
    #fecha = null;
    #monto = null;
    #concepto = null;
    #idPago = null; // FK a Pago

    constructor(
        idIngreso = null,
        fecha = null,
        monto = null,
        concepto = null,
        idPago = null
    ) {
        this.#idIngreso = idIngreso;
        this.#fecha = fecha;
        this.#monto = monto;
        this.#concepto = concepto;
        this.#idPago = idPago;
    }

    // Getters
    getIdIngreso() {
        return this.#idIngreso;
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

    getIdPago() {
        return this.#idPago;
    }

    // Setters
    setIdIngreso(idIngreso) {
        this.#idIngreso = idIngreso;
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

    setIdPago(idPago) {
        this.#idPago = idPago;
    }

    // Devuelve todos los valores como objeto plano
    getValues() {
        return {
            idIngreso: this.#idIngreso,
            fecha: this.#fecha,
            monto: this.#monto,
            concepto: this.#concepto,
            idPago: this.#idPago
        };
    }
}

module.exports = Ingreso;
