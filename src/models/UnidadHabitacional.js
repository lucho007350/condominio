class UnidadHabitacional {

    #idUnidad = null;
    #tipoUnidad = null;
    #numero = null;
    #estado = null;
    #area = null;
    #valorCuota = null;

    constructor(
        idUnidad = null,
        tipoUnidad = null,
        numero = null,
        estado = null,
        area = null,
        valorCuota = null
    ) {
        this.#idUnidad = idUnidad;
        this.#tipoUnidad = tipoUnidad;
        this.#numero = numero;
        this.#estado = estado;
        this.#area = area;
        this.#valorCuota = valorCuota;
    }

    // Getters
    getIdUnidad() {
        return this.#idUnidad;
    }

    getTipoUnidad() {
        return this.#tipoUnidad;
    }

    getNumero() {
        return this.#numero;
    }

    getEstado() {
        return this.#estado;
    }

    getArea() {
        return this.#area;
    }

    getValorCuota() {
        return this.#valorCuota;
    }

    // Setters
    setIdUnidad(idUnidad) {
        this.#idUnidad = idUnidad;
    }

    setTipoUnidad(tipoUnidad) {
        this.#tipoUnidad = tipoUnidad;
    }

    setNumero(numero) {
        this.#numero = numero;
    }

    setEstado(estado) {
        this.#estado = estado;
    }

    setArea(area) {
        this.#area = area;
    }

    setValorCuota(valorCuota) {
        this.#valorCuota = valorCuota;
    }

    // Devuelve todos los valores como un objeto
    getValues() {
        return {
            idUnidad: this.#idUnidad,
            tipoUnidad: this.#tipoUnidad,
            numero: this.#numero,
            estado: this.#estado,
            area: this.#area,
            valorCuota: this.#valorCuota
        };
    }
}

module.exports = UnidadHabitacional;
