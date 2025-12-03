class ResidentePago {
  constructor({ id, idResidente, idPago, montoPagado, fechaPago }) {
    this.id = id;
    this.idResidente = idResidente;
    this.idPago = idPago;
    this.montoPagado = montoPagado;
    this.fechaPago = fechaPago;
  }

  // Getters
  getId() {
    return this.id;
  }

  getIdResidente() {
    return this.idResidente;
  }

  getIdPago() {
    return this.idPago;
  }

  getMontoPagado() {
    return this.montoPagado;
  }

  getFechaPago() {
    return this.fechaPago;
  }

  // Setters
  setIdResidente(idResidente) {
    this.idResidente = idResidente;
  }

  setIdPago(idPago) {
    this.idPago = idPago;
  }

  setMontoPagado(montoPagado) {
    this.montoPagado = montoPagado;
  }

  setFechaPago(fechaPago) {
    this.fechaPago = fechaPago;
  }

  // Para enviar limpio al servicio o repositorio
  getValues() {
    return {
      id: this.id,
      idResidente: this.idResidente,
      idPago: this.idPago,
      montoPagado: this.montoPagado,
      fechaPago: this.fechaPago,
    };
  }
}

module.exports = ResidentePago;
