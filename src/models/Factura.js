class Factura {
    constructor({ idFactura, fechaEmision, monto, fechaVencimiento, estadoFactura, idUnidad }) {
      this.idFactura = idFactura;
      this.fechaEmision = fechaEmision;
      this.monto = monto;
      this.fechaVencimiento = fechaVencimiento;
      this.estadoFactura = estadoFactura;
      this.idUnidad = idUnidad;
    }
  }
  
  module.exports = Factura;
  